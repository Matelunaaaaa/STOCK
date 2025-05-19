const express = require('express');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const fetch = require('node-fetch'); 
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'clavesuperseguralol',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: 'lax',
    httpOnly: false
  }
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

// IMPORTANTE 
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

// ================== SCRIPTS DIRECTOS DESDE NODE ==================

// Agregar producto desde línea de comandos
if (
  require.main === module && // Solo si se ejecuta directamente, no como require
  process.argv[1].endsWith('server.js') && // Solo si es este archivo
  process.argv.length > 2 // Si hay argumentos
) {
  const nombre = process.argv[2];
  const categoria = process.argv[3];
  const stock = parseInt(process.argv[4]);
  const proveedor = process.argv[5];

  if (!nombre || !categoria || isNaN(stock) || !proveedor) {
    console.log('Uso: node server.js <nombre> <categoria> <stock> <proveedor>');
    process.exit(1);
  }

  connection.query(
    'INSERT INTO productos (nombre, categoria, stock, proveedor) VALUES (?, ?, ?, ?)',
    [nombre, categoria, stock, proveedor],
    (err, result) => {
      if (err) throw err;
      console.log('Producto agregado con ID:', result.insertId);
      process.exit(0);
    }
  );
}

// Editar producto desde línea de comandos
if (
  require.main === module &&
  process.argv[1].endsWith('server.js') &&
  process.argv[2] === '--editar'
) {
  const id = parseInt(process.argv[3]);
  const nombre = process.argv[4];
  const categoria = process.argv[5];
  const stock = parseInt(process.argv[6]);
  const proveedor = process.argv[7];

  if (isNaN(id) || !nombre || !categoria || isNaN(stock) || !proveedor) {
    console.log('Uso: node server.js --editar <id> <nombre> <categoria> <stock> <proveedor>');
    process.exit(1);
  }

  connection.query(
    'UPDATE productos SET nombre = ?, categoria = ?, stock = ?, proveedor = ? WHERE id = ?',
    [nombre, categoria, stock, proveedor, id],
    (err, result) => {
      if (err) throw err;
      console.log('Producto actualizado. Filas afectadas:', result.affectedRows);
      process.exit(0);
    }
  );
}

// Eliminar producto desde línea de comandos
if (
  require.main === module &&
  process.argv[1].endsWith('server.js') &&
  process.argv[2] === '--eliminar'
) {
  const id = parseInt(process.argv[3]);

  if (isNaN(id)) {
    console.log('Uso: node server.js --eliminar <id>');
    process.exit(1);
  }

  connection.query(
    'DELETE FROM productos WHERE id = ?',
    [id],
    (err, result) => {
      if (err) throw err;
      console.log('Producto eliminado. Filas afectadas:', result.affectedRows);
      process.exit(0);
    }
  );
}

// ================== FIN SCRIPTS DIRECTOS ==================

//API Productos
app.get('/api/productos', (req, res) => {
  connection.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      console.error('Error productos:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.json(results);
  });
});


// Agregar producto (API)
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

//// Actualizar producto (API)
//app.put('/api/productos/:id', (req, res) => {
//  const { id } = req.params;
//  const { nombre, categoria, stock, proveedor } = req.body;
//  const sql = 'UPDATE productos SET nombre = ?, categoria = ?, stock = ?, proveedor = ? WHERE id = ?';
//  connection.query(sql, [nombre, categoria, stock, proveedor, id], (err, result) => {
//    if (err) {
//      console.error('Error al actualizar producto:', err);
//      return res.status(500).json({ error: 'Error al actualizar producto' });
//    }
//    res.json({ success: true });
//  });
//});
//
// Eliminar producto (API)
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
