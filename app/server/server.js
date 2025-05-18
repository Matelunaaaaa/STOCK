const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de sesión
app.use(session({
  secret: 'clavesuperseguralol', 
  resave: false,
  saveUninitialized: false
}));

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

// Middleware para proteger rutas
function requireLogin(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/');
  }
}

// Ruta principal - siempre redirige a home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/home.html'));
});

// Rutas protegidas
app.get('/stock', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/stock.html'));
});

app.get('/asientoscontables', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/asientoscontables.html'));
});

// API Login
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';
  
  connection.query(sql, [usuario, contrasena], (err, results) => {
    if (err) {
      console.error('Error login:', err);
      return res.json({ success: false });
    }
    if (results.length > 0) {
      req.session.usuario = usuario;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// API Logout mejorada
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
      return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// API Productos (protegida)
app.get('/api/productos', requireLogin, (req, res) => {
  connection.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      console.error('Error productos:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.json(results);
  });
});

// Manejo de errores - TODOS los errores redirigen a home.html
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.message);
  res.redirect('/');
});

// Rutas no definidas
app.use((req, res) => {
  res.redirect('/'); // Cualquier ruta no definida va a home
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});