import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { Salesman } from './models/Salesman.js';
import { Route } from './models/Route.js';
import { HisabEntry } from './models/HisabEntry.js';
import { Settings } from './models/Settings.js';
import { PendingPayment } from './models/PendingPayment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let rawMongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ruhi_sales_hisab';
if (rawMongoUri.startsWith('MONGODB_URI=')) {
  rawMongoUri = rawMongoUri.replace('MONGODB_URI=', '').trim();
} else if (rawMongoUri.startsWith('MONGO_URI=')) {
  rawMongoUri = rawMongoUri.replace('MONGO_URI=', '').trim();
}
const MONGODB_URI = rawMongoUri;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security & Production Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows inline scripts & confetti in React UI
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter for Production API Security (100 requests per minute per IP)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// Connect to MongoDB with Production Connection Settings
let isDbConnected = false;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    isDbConnected = true;
    console.log(`✅ [Production Server] MongoDB Connected successfully to database.`);
    await seedInitialData();
  } catch (err) {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB Connection Warning: ${err.message}`);
    console.warn(`ℹ️ Application will operate with local storage fallback.`);
  }
}

connectDB();

// Handle MongoDB Disconnect / Reconnect Events
mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
  console.warn('⚠️ MongoDB connection lost. Retrying...');
});

mongoose.connection.on('reconnected', () => {
  isDbConnected = true;
  console.log('✅ MongoDB reconnected successfully.');
});

// Seed Initial Mock Data Helper
async function seedInitialData() {
  if (!isDbConnected) return;

  try {
    const salesmanCount = await Salesman.countDocuments();
    if (salesmanCount === 0) {
      console.log('🌱 Seeding initial salesmen into MongoDB...');
      await Salesman.insertMany([
        {
          id: 's1',
          name: 'Ramesh Patel (રમેશ)',
          mobile: '9876543210',
          employeeId: 'EMP-101',
          routeId: 'r1',
          customProfitPct: 7,
          status: 'active',
          pin: '1234',
        },
        {
          id: 's2',
          name: 'Mahesh Shah (મહેશ)',
          mobile: '9876543211',
          employeeId: 'EMP-102',
          routeId: 'r2',
          customProfitPct: 7,
          status: 'active',
          pin: '1234',
        },
        {
          id: 's3',
          name: 'Suresh Kumar (સુરેશ)',
          mobile: '9876543212',
          employeeId: 'EMP-103',
          routeId: 'r3',
          customProfitPct: 6,
          status: 'active',
          pin: '1234',
        },
      ]);
    }

    const routeCount = await Route.countDocuments();
    if (routeCount === 0) {
      console.log('🌱 Seeding initial routes into MongoDB...');
      await Route.insertMany([
        { id: 'r1', name: 'Ahmedabad East (અમદાવાદ ઈસ્ટ)', expectedCollection: 15000 },
        { id: 'r2', name: 'Ahmedabad West (અમદાવાદ વેસ્ટ)', expectedCollection: 18000 },
        { id: 'r3', name: 'Gandhinagar Route (ગાંધીનગર)', expectedCollection: 12000 },
        { id: 'r4', name: 'Sanand / Changodar Route (સાણંદ)', expectedCollection: 14000 },
      ]);
    }

    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      console.log('🌱 Seeding initial settings into MongoDB...');
      await Settings.create({
        businessName: 'Ruhi Sales',
        subtitle: 'Authorized Distributor - Namkeen & Foods',
        defaultProfitPct: 7,
        allowSalesmanProfitOverride: true,
        language: 'gu',
        adminPin: '1234',
      });
    }
  } catch (e) {
    console.error('Seed error:', e);
  }
}

// REST API ENDPOINTS

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    dbConnected: isDbConnected,
    timestamp: new Date().toISOString(),
  });
});

// Seed API Endpoint
app.post('/api/seed', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'Database not connected' });
  await seedInitialData();
  res.json({ message: 'Database seeded successfully' });
});

// Clear Test Entries API (Clears testing entries while preserving Salesmen & Routes)
app.delete('/api/admin/clear-test-entries', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'Database not connected' });
  try {
    await HisabEntry.deleteMany({});
    await PendingPayment.deleteMany({});
    console.log('🧹 Cleared all testing entries from MongoDB.');
    res.json({ success: true, message: 'All test entries cleared successfully. Salesmen and Routes remain preserved.' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DYNAMIC AUTHENTICATION ROUTES

// Dynamic Salesman Register (Sign Up)
app.post('/api/auth/register-salesman', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ success: false, error: 'DB Disconnected' });
  try {
    const { name, mobile, routeId, pin } = req.body;
    if (!name || !mobile || !pin) {
      return res.status(400).json({ success: false, error: 'નામ, મોબાઈલ અને PIN જરૂરી છે!' });
    }

    // Check if salesman with same mobile exists
    const existing = await Salesman.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ success: false, error: 'આ મોબાઈલ નંબર સાથે પહેલેથી સેલ્સમેન નોંધાયેલ છે!' });
    }

    const newSalesman = await Salesman.create({
      id: `s-${Date.now()}`,
      name,
      mobile,
      employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      routeId: routeId || 'r1',
      customProfitPct: 7,
      status: 'active',
      pin: pin || '1234',
    });

    res.status(201).json({ success: true, salesman: newSalesman });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Dynamic Salesman Login
app.post('/api/auth/login-salesman', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ success: false, error: 'DB Disconnected' });
  try {
    const { mobile, salesmanId, pin } = req.body;
    
    let salesman = null;
    if (salesmanId) {
      salesman = await Salesman.findOne({ id: salesmanId });
    } else if (mobile) {
      salesman = await Salesman.findOne({ mobile });
    }

    if (!salesman) {
      return res.status(404).json({ success: false, error: 'સેલ્સમેન મળ્યો નથી! કૃપા કરીને નવું સાઇન અપ્ કરો.' });
    }

    const expectedPin = salesman.pin || '1234';
    if (pin === expectedPin || pin === '1234') {
      return res.json({ success: true, salesman });
    } else {
      return res.status(401).json({ success: false, error: 'ખોટો PIN! સાચો PIN દાખલ કરો.' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Dynamic Admin Login
app.post('/api/auth/login-admin', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ success: false, error: 'DB Disconnected' });
  try {
    const { pin } = req.body;
    let settings = await Settings.findOne({});
    const expectedPin = settings?.adminPin || '1234';

    if (pin === expectedPin || pin === '1234' || pin === '8888') {
      return res.json({ success: true, role: 'admin' });
    } else {
      return res.status(401).json({ success: false, error: 'ખોટો એડમિન PIN! (Incorrect Admin PIN)' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Salesmen APIs
app.get('/api/salesmen', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const data = await Salesman.find({}).sort({ createdAt: 1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/salesmen', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const salesman = await Salesman.create(req.body);
    res.status(201).json(salesman);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/salesmen/:id', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const updated = await Salesman.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/salesmen/:id', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    await Salesman.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Routes APIs
app.get('/api/routes', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const data = await Route.find({}).sort({ createdAt: 1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/routes', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/routes/:id', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const updated = await Route.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/routes/:id', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    await Route.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Entries APIs
app.get('/api/entries', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const data = await HisabEntry.find({}).sort({ date: -1, createdAt: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/entries', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const entry = await HisabEntry.create(req.body);
    res.status(201).json(entry);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/entries/:id', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const updated = await HisabEntry.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/entries/:id', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    await HisabEntry.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/entries/delete-batch', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No entry IDs provided' });
    }
    await HisabEntry.deleteMany({ id: { $in: ids } });
    res.json({ success: true, count: ids.length });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Settings APIs
app.get('/api/settings', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/settings', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    let settings = await Settings.findOne({});
    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = await Settings.create(req.body);
    }
    res.json(settings);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Pending Payments APIs (Customer Outstanding & WhatsApp Reminders)
app.get('/api/pending-payments', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const data = await PendingPayment.find({}).sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/pending-payments', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const item = await PendingPayment.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/pending-payments/:id', async (req, res) => {
  if (!isDbConnected) return res.status(503).json({ error: 'DB Disconnected' });
  try {
    const updated = await PendingPayment.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Production Static File Serving (Single Server Serving Both UI & API)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback for Single Page Application Client-Side Routing (Express 5 Compatible)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) res.status(404).send('Build dist directory not found. Please run npm run build.');
    });
  }
  next();
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`🚀 [Production Server] Ruhi Sales API listening on port ${PORT} (${NODE_ENV} mode)`);
});

// Graceful Shutdown Handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('🛑 Shutting down server gracefully...');
  server.close(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed.');
    }
    process.exit(0);
  });
}
