const axios = require('axios');
const { Buffer } = require('buffer');

async function fetchAndDecodeData() {
    try {
        // Consumir datos del endpoint
        const response = await axios.get('https://callback-iot.onrender.com/data');
        const data = response.data;

        // Procesar cada dispositivo
        data.forEach(deviceData => {
            if (!deviceData.hexData) return;

            console.log('\n----------------------------------------');
            console.log(`Dispositivo: ${deviceData.device}`);
            console.log(`Fecha: ${formatTimestamp(deviceData.timestamp)}`);

            // Decodificar los datos hexadecimales
            const { temperature, humidity, pressure } = decodeHexData(deviceData.hexData);

            console.log(`Temperatura: ${temperature.toFixed(2)} °C`);
            console.log(`Humedad: ${humidity.toFixed(2)}%`);
            console.log(`Presión: ${pressure.toFixed(2)} hPa`);
        });

    } catch (error) {
        console.error('Error al obtener o procesar los datos:', error.message);
    }
}

function decodeHexData(hexString) {
    // Convertir el string hexadecimal a un buffer de bytes
    const buffer = Buffer.from(hexString, 'hex');

    // Verificar que tenemos suficientes bytes (3 floats de 32 bits = 12 bytes)
    if (buffer.length < 12) {
        throw new Error('Datos hexadecimales insuficientes. Se esperaban al menos 12 bytes.');
    }

    // Leer números de float de 32 bits en formato little-endian.
    const temperature = buffer.readFloatLE(0); // 0-3.
    const humidity = buffer.readFloatLE(4); // 4-7.
    const pressure = buffer.readFloatLE(8); //8-11.

    return { temperature, humidity, pressure };
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toISOString().replace('T', ' ').replace(/\.\d+Z/, '');
}

fetchAndDecodeData();