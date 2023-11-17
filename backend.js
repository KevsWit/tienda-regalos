const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Agregamos esta línea
const app = express();
const port = 3000;

app.use(cors()); // Habilitamos CORS

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/regalos', { useNewUrlParser: true, useUnifiedTopology: true });

const Usuario = mongoose.model('Usuario', {
    nombre: String,
    email: String,
    contrasena: String,
});

// Endpoint para registrar un usuario
app.post('/registrar', async (req, res) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.save();
        res.send('Registro exitoso');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        const usuario = await Usuario.findOne({ email, contrasena });
        if (usuario) {
            res.send('Ingreso satisfactorio');
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

const Producto = mongoose.model('Producto', {
    tipo: String,
    nombre: String,
    imagenPath: String,
});

// Añadir algunos productos a la base de datos (esto puede ir en una ruta específica)
const productosIniciales = [
    { tipo: 'jarro', nombre: 'Jarro de porcelana llano', imagenPath: 'images/jarro-de-porcelana-llano.jpg' },
    { tipo: 'jarro', nombre: 'Jarro de porcelana con cuchara', imagenPath: 'images/jarro-de-porcelana-con-cuchara.jpg' },
    { tipo: 'jarro', nombre: 'Jarro de porcelana grande', imagenPath: 'images/jarra-de-porcelana-grande.jpg' },
    { tipo: 'camiseta', nombre: 'Camiseta Polo', imagenPath: 'images/camiseta-polo.jpg' },
    { tipo: 'camiseta', nombre: 'Camiseta cuello redondo', imagenPath: 'images/camiseta-cuello-redondo.jpg' },
    { tipo: 'camiseta', nombre: 'Camiseta cuello en V', imagenPath: 'images/camiseta-llana-cuello-v.png' },
    { tipo: 'llavero', nombre: 'Llavero estándar', imagenPath: 'images/llavero-std.jpeg' },
    { tipo: 'llavero', nombre: 'Llavero circular', imagenPath: 'images/llavero-circular.jpg' },
    { tipo: 'llavero', nombre: 'Llavero con forma de corazón', imagenPath: 'images/llavero-corazon.jpeg' },
];

Producto.countDocuments({})
    .then(count => {
        if (count === 0) {
            // La colección está vacía, insertar productos
            return Producto.insertMany(productosIniciales);
        } else {
            console.log('La colección de productos ya contiene documentos. No se insertaron productos iniciales.');
            return Promise.resolve(); // Resuelve la promesa sin hacer nada
        }
    })
    .then(productos => {
        if (productos) {
            console.log('Productos insertados:', productos);
        }
    })
    .catch(error => {
        console.error('Error al verificar/insertar productos:', error);
    });

// Endpoint para obtener todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find({});
        res.send(productos);
    } catch (error) {
        res.status(500).send(error);
    }
});
