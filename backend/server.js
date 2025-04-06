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
const pixRoutes = require('./src/routes/pix.routes');

// Usa as rotas
app.use(authRoutes);
app.use(clientRoutes);
app.use(clothingRoutes);
app.use(purchaseRoutes);
app.use(pixRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
