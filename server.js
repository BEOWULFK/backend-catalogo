const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});
// 🔹 obtener todos los productos
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
    } else {
      res.json(result);
    }
  });
});

// 🔹 crear producto
app.post("/productos", (req, res) => {
  const { nombre, descripcion, categoria, precio, imagen, galeria, badge } = req.body;

  db.query(
    `INSERT INTO productos (nombre, descripcion, categoria, precio, imagen, galeria, badge)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, categoria, precio, imagen, galeria, badge],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al guardar");
      } else {
        res.send("Producto guardado");
      }
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto " + PORT);
});