const mysql = require("mysql2");
const fs = require("fs");

console.log("🚀 Iniciando script...");

const db = mysql.createConnection({
  host: "maglev.proxy.rlwy.net",
  user: "root",
  password: "WqNLqtSPJRYaxosPtaNETItDkXmvnDTG",
  database: "railway",
  port: 47596
});

// leer JSON
const data = JSON.parse(fs.readFileSync("./data.json"));

console.log("📦 JSON cargado");
console.log("Cantidad de productos:", data.productos?.length);

// recorrer productos
data.productos.forEach(p => {

  console.log("➡️ Insertando:", p.nombre);

  const nombre = p.nombre || "";
  const descripcion = p.descripcion || "";
  const categoria = p.categoria || "";
  const precio = parseInt(p.precio) || 0;
  const imagen = p.imagen || "";
  const galeria = JSON.stringify(p.galeria || []);
  const badge = p.badge || "";

  db.query(
    `INSERT INTO productos 
    (nombre, descripcion, categoria, precio, imagen, galeria, badge) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, categoria, precio, imagen, galeria, badge],
    (err) => {
      if (err) console.log("❌ ERROR:", err);
    }
  );

});

console.log("🔥 Script terminado");