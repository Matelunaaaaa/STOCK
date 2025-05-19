const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const fetch = require('node-fetch'); 

const app = express();

// Configura CORS para permitir credenciales (cookies de sesión)
app.use(cors({
  origin: 'http://52.20.1.18:3000', 
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'clavesuperseguralol',
  resave: false,
  saveUninitialized: false
}));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '..')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/pages', express.static(path.join(__dirname, '../pages')));

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

// ================== RUTAS DE API (PÚBLICAS) ==================

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

// API Logout
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

// API Productos
app.get('/api/productos', (req, res) => {
  connection.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      console.error('Error productos:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.json(results);
  });
});

// Agregar producto
app.post('/api/productos', (req, res) => {
  const { nombre, categoria, stock, proveedor } = req.body;
  const sql = 'INSERT INTO productos (nombre, categoria, stock, proveedor) VALUES (?, ?, ?, ?)';
  connection.query(sql, [nombre, categoria, stock, proveedor], (err, result) => {
    if (err) {
      console.error('Error al agregar producto:', err);
      return res.status(500).json({ error: 'Error al agregar producto' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Actualizar producto
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, stock, proveedor } = req.body;
  const sql = 'UPDATE productos SET nombre = ?, categoria = ?, stock = ?, proveedor = ? WHERE id = ?';
  connection.query(sql, [nombre, categoria, stock, proveedor, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar producto:', err);
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }
    res.json({ success: true });
  });
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM productos WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
    res.json({ success: true });
  });
});

// API Asientos contables 
app.get('/api/asientos-proxy', async (req, res) => {
  try {
    const apiResponse = await fetch('http://34.225.192.85:8000/api/asientoscontables/');
    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error en proxy:', error);
    res.status(500).json({ error: 'Error al obtener asientos' });
  }
});

// Manejador para rutas de API que no existen
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// ================== FIN RUTAS DE API ==================

// Middleware para proteger rutas
function requireLogin(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/');
  }
}

// Rutas frontend
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

app.use((req, res, next) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(404).json({ error: 'Ruta no encontrada' });
  }
  res.redirect('/');
});

// Manejador de errores generales
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.message);
  res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});
