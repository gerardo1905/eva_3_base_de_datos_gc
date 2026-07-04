// Instanciamos/Importamos las depedencias necesarias y las almacenamos en una constante
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Iniciamos nuestra aplicacion express
const aplicacion = express();
const puerto = 3000;

// Instanciamos las depedencias de la aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Crear la conexion con DB
mongoose.connect('mongodb://localhost:27017/AP-N3-C2')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse con la DB, error ocurrido: ', excepcion));

const PORT = process.env.PORT || 3000;
aplicacion.listen(PORT, 'localhost', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const direccion = new mongoose.Schema({
    comuna: String,
    calle: String,
    numero: String,
    departamento: String
});

const usuario = new mongoose.Schema({
    nombre: String,
    rut: String,
    nacionalidad: String,
    email: String,
    celular: String,
    fechaNacimiento: Date,
    contrasena: String,
    direccion: [direccion],
    foto: {
        filename: String,
        path: String,
        mimetype: String
    }
});

const pais = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});

//nueva entidad mascota
const mascota = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', // Relación 1:N referenciada al ID del Usuario
        required: true 
    },
    nombre: String,
    especie: String,
    raza: String,
    edad: Number,
    peso: Number,
    color: String,
    sexo: String,
    fechaNacimiento: Date,
    observaciones: String
});

const Usuario = mongoose.model('Usuario', usuario, 'usuarios');
const Pais = mongoose.model('Pais', pais, 'paises');
// Nuevo modelo de Mascotas
const Mascota = mongoose.model('Mascota', mascota, 'mascotas');

// RUTAS DE USUARIOS Y PAISES

aplicacion.post('/guardarUsuario', async (req, res) => {
    try {
        const { nombre, rut, nacionalidad, email, celular, fechaNacimiento, contrasena, direccion, foto } = req.body;
        const direccionUsuario = JSON.parse(direccion);

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(contrasena, salt);

        const nuevoUsuario = new Usuario({ nombre, rut, nacionalidad, email, celular, fechaNacimiento, contrasena:hash, direccion: direccionUsuario, foto });
        await nuevoUsuario.save();

        res.status(200).json({ mensaje: 'Datos almacenados correctamente.' })
    }
    catch (error) {
        res.status(500).json({ mensaje: 'No se han podido guardar los datos. ', error });
    };
});

aplicacion.get('/obtenerUsuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.aggregate([{
            $lookup: {
                from: 'paises',
                localField: 'nacionalidad',
                foreignField: 'iso2',
                as: 'paisOrigen'
            }
        }]);
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos. ', error });
    }
});

aplicacion.get('/obtenerPaises', async (req, res) => {
    try {
        const paises = await Pais.find();
        res.json(paises);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos. ', error });
    }
});

// NUEVAS RUTAS PARA MASCOTAS

// 1. Ruta para guardar una nueva mascota
aplicacion.post('/guardarMascota', async (req, res) => {
    try {
        const { usuario, nombre, especie, raza, edad, peso, color, sexo, fechaNacimiento, observaciones } = req.body;
        
        const nuevaMascota = new Mascota({ 
            usuario, // Aquí llegará el string con el ID del dueño
            nombre, 
            especie, 
            raza, 
            edad: Number(edad), 
            peso: Number(peso), 
            color, 
            sexo, 
            fechaNacimiento, 
            observaciones 
        });

        await nuevaMascota.save();
        res.status(200).json({ mensaje: 'Mascota registrada correctamente.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo registrar la mascota. ', error });
    }
});

// 2. Ruta para obtener las mascotas con agregación ($lookup) para traer los datos del dueño
aplicacion.get('/obtenerMascotas', async (req, res) => {
    try {
        const mascotas = await Mascota.aggregate([
            {
                $lookup: {
                    from: 'usuarios',          // Coleccion de donde sacaremos los datos
                    localField: 'usuario',     // El campo en la coleccion mascota que guarda el ID
                    foreignField: '_id',       // El campo ID en la coleccion de usuarios
                    as: 'dueno'                // Nombre del array resultante con la info del usuario
                }
            }
        ]);
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudieron obtener las mascotas. ', error });
    }
});