require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sql } = require('./config/database');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/auth.routes');
const clientRoutes = require('./src/routes/client.routes');
const clothingRoutes = require('./src/routes/clothing.routes');
const purchaseRoutes = require('./src/routes/purchase.routes');
const miningRoutes = require('./src/routes/mining.routes');
const pixRoutes = require('./src/routes/pix.routes');
const paymentRoutes = require('./src/routes/payment.routes');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/clothing', clothingRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/mining', miningRoutes);
app.use('/api/pix', pixRoutes);
app.use('/api/payments', paymentRoutes);

app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Request error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Database connection error:', error.message);
  }
};

startServer();
