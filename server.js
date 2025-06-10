const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept', 'ngrok-skip-browser-warning']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.get('/datas', async (req, res) => {
  try {
    console.log("Solicitud recibida en /datas");
    const response = await axios.get('https://callback-iot.onrender.com/data', {
      timeout: 5000
    });
    
    const lastTwoRecords = response.data.slice(-2);
    console.log("Datos enviados:", lastTwoRecords);
    
    res.json(lastTwoRecords);
  } catch (error) {
    console.error("Error en /datas:", error);
    res.status(500).json({ 
      error: "Error al obtener datos",
      details: error.message 
    });
  }
});

// Método POST para enviar datos a visualización (Node-RED)
app.post('/visualize', async (req, res) => {
  try {
    // Convertir el objeto recibido en un array de un elemento
    const dataToSend = [req.body];
    
    const nodeRedResponse = await axios.post('http://localhost:1880/visualize', dataToSend);
    
    res.json({
      status: "Datos enviados a Node-RED correctamente",
      nodeRedResponse: nodeRedResponse.data
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Error al enviar datos a Node-RED",
      details: error.message 
    });
  }
});

app.get('/test', (req, res) => {
  res.json({ 
    status: "OK",
    message: "Conexión exitosa desde Wokwi",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});