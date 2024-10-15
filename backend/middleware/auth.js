const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Obtener el token del encabezado de autorización
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token faltante' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Separa "Bearer" del token
    req.user = decoded;
    next();  // Continúa con la siguiente función middleware o la ruta
  } catch (error) {
    res.status(401).json({ message: 'Token no válido' });
  }
};
