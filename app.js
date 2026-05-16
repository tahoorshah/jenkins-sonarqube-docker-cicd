const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
 res.json({
 message: 'Hello from Docker CI/CD on Kali!',
 version: process.env.APP_VERSION || '1.0.0',
 timestamp: new Date().toISOString()
 });
});
app.get('/health', (req, res) => {
 res.status(200).json({
 status: 'healthy',
 uptime: process.uptime()
 });
});
const server = app.listen(port, () =>
 console.log('App running on port ' + port)
);
module.exports = { app, server };
