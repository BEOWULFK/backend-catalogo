const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 🔹 CONEXIÓN MYSQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// 🔴 verificar conexión
db.connect((err) => {
  if (err) {
    console.error("❌ Error conexión BD:", err);
  } else {
    console.log("✅ Conectado a MySQL");
  }
});

// 🔐 LOGIN
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

app.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  if (usuario === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
});

// 🔹 OBTENER PRODUCTOS
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }

    res.json(result);
  });
});

// 🔹 CREAR PRODUCTO
app.post("/productos", (req, res) => {
  const { nombre, descripcion, categoria, precio, imagen } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  db.query(
    `INSERT INTO productos (nombre, descripcion, categoria, precio, imagen)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, descripcion, categoria, precio, imagen],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al guardar producto" });
      }

      res.json({ message: "Producto guardado correctamente" });
    }
  );
});

// 🔹 EDITAR PRODUCTO (CORREGIDO PRO)
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria, precio, imagen } = req.body;

  let query = `
    UPDATE productos 
    SET nombre=?, descripcion=?, categoria=?, precio=?
  `;

  let params = [nombre, descripcion, categoria, precio];

  if (imagen) {
    query += `, imagen=?`;
    params.push(imagen);
  }

  query += ` WHERE id=?`;
  params.push(id);

  db.query(query, params, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al actualizar" });
    }

    res.json({ message: "Producto actualizado" });
  });
});

// 🔹 ELIMINAR
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM productos WHERE id=?", [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al eliminar" });
    }

    res.json({ message: "Producto eliminado" });
  });
});

// 🚀 PUERTO
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto " + PORT);
});