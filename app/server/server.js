const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '..'))); // Raíz del proyecto
app.use('/js', express.static(path.join(__dirname, '../js'))); // JS
app.use('/css', express.static(path.join(__dirname, '../css'))); // CSS
app.use('/pages', express.static(path.join(__dirname, '../pages'))); // Páginas HTML

// Conexión MySQL
const connection = mysql.createConnection({
  host: '54.197.46.233',
  user: 'admin',
  password: 'admin',
  database: 'BDSTOCK'
});

connection.connect(err => {
  if (err) {
    console.error('Error MySQL:', err);
  } else {
    console.log('✅ MySQL conectado');
  }
});

// Ruta principal - siempre redirige a home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/home.html'));
});

// Rutas para otras páginas
app.get('/stock', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/stock.html'));
});

app.get('/asientoscontables', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/asientoscontables.html'));
});

// API Login
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';
  
  connection.query(sql, [usuario, contrasena], (err, results) => {
    if (err) {
      console.error('Error login:', err);
      return res.redirect('/'); // Redirige a home si hay error
    }
    res.json({ success: results.length > 0 });
  });
});

// API Productos
app.get('/api/productos', (req, res) => {
  connection.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      console.error('Error productos:', err);
      return res.redirect('/'); // Redirige a home si hay error
    }
    res.json(results);
  });
});

// Manejo de errores - TODOS los errores redirigen a home.html
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.message);
  res.redirect('/');
});

app.use((req, res) => {
  res.redirect('/'); // Cualquier ruta no definida va a home
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});