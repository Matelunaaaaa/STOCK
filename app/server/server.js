const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: '54.197.46.233',
  user: 'admin',
  password: 'admin',
  database: 'BDSTOCK'
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';

  connection.query(sql, [usuario, contrasena], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Inicio de sesión correcto' });
    } else {
      res.json({ success: false, message: 'Credenciales inválidas' });
    }
  });
});

app.get('/api/productos', (req, res) => {
  const sql = 'SELECT id, nombre, categoria, stock, proveedor FROM productos';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    res.json(results);
  });
});

app.use(express.static('pages'));

// Ruta principal
app.get('/', (req, res) => {
  res.redirect('/home.html');
});


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
