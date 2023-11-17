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
