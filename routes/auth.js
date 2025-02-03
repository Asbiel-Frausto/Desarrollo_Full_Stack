const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Para generar un token JWT
const bcrypt = require('bcryptjs'); // Importar bcryptjs para cifrar contraseñas

const router = express.Router();

// Ruta para registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Verificar si el correo ya está registrado
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Cifrar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario con la contraseña cifrada
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Guardar la contraseña cifrada
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;
