const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors'); 
const app = express();

// Habilita CORS para todas las solicitudes
app.use(cors());

app.use(express.json());

// Conexión a MongoDB
//const uri = "mongodb+srv://angelrp:abc123.@cluster0.76po7.mongodb.net/chat?retryWrites=true&w=majority&appName=Cluster0";
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let collection;

// Función para conectar con la base de datos
async function connectToDB() {
  try {
    await client.connect();
    const database = client.db('chat');
    collection = database.collection('usuarios');
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
  }
}
connectToDB();

app.get('/api/check-db', async (req, res) => {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }
    const test = await collection.findOne();
    res.json({ message: 'Conexión exitosa con MongoDB Atlas', test });
  } catch (error) {
    res.status(500).json({ message: 'Error al conectar con MongoDB', error });
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API hola joel hola' });
});

// Registro de usuario
app.post("/api/register", async (req, res) => {
  try {
    console.log(req.body);  // Verifica que los datos lleguen correctamente
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
    }

    // Verificar si el correo ya existe
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Este correo ya está registrado." });
    }

    // Guardar el nuevo usuario sin encriptar la contraseña
    await collection.insertOne({ email, password });

    res.status(201).json({ success: true, message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});
//login
app.post("/api/login", async (req, res) => {
  try {
      console.log("Datos recibidos en /api/login:", req.body);
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
      }

      const user = await collection.findOne({ email, password });

      if (!user) {
          return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos." });
      }

      res.status(200).json({ success: true, message: "Inicio de sesión exitoso." });
  } catch (error) {
      console.error("error en el login:", error);
      res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});














































































//angel