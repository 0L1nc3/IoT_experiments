# Proyecto IoT - Visualización de Datos con Node.js y Node-RED

Este proyecto permite la recepción, decodificación y visualización de datos IoT utilizando Node.js y Node-RED.

## Requisitos

- [Node.js](https://nodejs.org/)
- npm (viene con Node.js)
- Node-RED

## Instalación

Clona el repositorio y navega al directorio:

```bash
git clone https://github.com/0L1nc3/IoT_experiments.git
cd IoT_experiments
npm install
```

## Ejecución del servidor
Servidor principal API
```bash
node server.js
```
Decodificador (análisis de datos de callback-iot.onreader/data)

```bash
node decoder.js
```

## Node-RED
Instala Node-RED de forma global:

```bash
npm install -g node-red
```

Inicia Node-RED:
```bash
node-red
```

Accede a la interfaz en: http://localhost:1880

### Flujo de visualización
Importa el siguiente flujo en Node-RED para visualizar datos:

```
[
  {
    "id": "http-in-post",
    "type": "http in",
    "z": "flow1",
    "name": "",
    "url": "/visualize",
    "method": "post",
    "upload": false,
    "swaggerDoc": "",
    "x": 100,
    "y": 80,
    "wires": [["json-parser", "process-data"]]
  },
  {
    "id": "json-parser",
    "type": "json",
    "z": "flow1",
    "name": "Convertir a JSON",
    "property": "payload",
    "x": 290,
    "y": 80,
    "wires": [["ui-text"]]
  },
  {
    "id": "process-data",
    "type": "function",
    "z": "flow1",
    "name": "Procesar datos",
    "func": "// Supone que payload es un arreglo de objetos\nconst datos = msg.payload;\nlet temp = \"---\";\nif (Array.isArray(datos) && datos[0]?.temperature) {\n    temp = datos[0].temperature;\n}\nmsg.payload = `Temperatura: ${temp} °C`;\nreturn msg;",
    "outputs": 1,
    "x": 290,
    "y": 140,
    "wires": [["ui-text", "http-response"]]
  },
  {
    "id": "ui-text",
    "type": "ui_text",
    "z": "flow1",
    "group": "dashboard-group",
    "order": 0,
    "width": 0,
    "height": 0,
    "name": "Mostrar temperatura",
    "label": "Dato recibido",
    "format": "{{msg.payload}}",
    "layout": "row-spread",
    "x": 510,
    "y": 80,
    "wires": []
  },
  {
    "id": "http-response",
    "type": "http response",
    "z": "flow1",
    "name": "",
    "x": 530,
    "y": 140,
    "wires": []
  },
  {
    "id": "dashboard-group",
    "type": "ui_group",
    "name": "Grupo Principal",
    "tab": "dashboard-tab",
    "order": 1,
    "disp": true,
    "width": "6",
    "collapse": false
  },
  {
    "id": "dashboard-tab",
    "type": "ui_tab",
    "name": "Dashboard",
    "icon": "dashboard",
    "order": 1
  }
]
```

### Dashboard
Para visualizar los datos, asegúrate de instalar el paquete node-red-dashboard:

```bash
cd ~/.node-red
npm install node-red-dashboard
```
Reinicia Node-RED y abre: http://localhost:1880/ui