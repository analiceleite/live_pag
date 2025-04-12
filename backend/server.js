require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Importa todas as rotas corretamente
const authRoutes = require('./src/routes/auth.routes');
const clientRoutes = require('./src/routes/client.routes');
const clothingRoutes = require('./src/routes/clothing.routes');
const purchaseRoutes = require('./src/routes/purchase.routes');
const miningRoutes = require('./src/routes/mining.routes');
const pixRoutes = require('./src/routes/pix.routes');
const paymentRoutes = require('./src/routes/payment.routes');

// Usa as rotas
app.use(authRoutes);
app.use(clientRoutes);
app.use(clothingRoutes);
app.use(purchaseRoutes);
app.use(miningRoutes);
app.use(pixRoutes);
app.use(paymentRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
