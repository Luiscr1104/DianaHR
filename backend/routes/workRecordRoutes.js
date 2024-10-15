const express = require('express');
const router = express.Router();
const WorkRecord = require('../models/WorkRecord');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Crear un nuevo registro laboral (Check-in, breake, Check-out)
router.post('/workrecords', auth, async (req, res) => {
  const { location, type, userId } = req.body;

  try {
    // Si el usuario es empleado, usar su propio userId, pero si es admin, puede especificar el userId
    const creatorUserId = req.user.role === 'admin' ? userId : req.user.userId;

    if (req.user.role === 'admin' && userId) {
      const employee = await User.findById(userId);
      if (!employee) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
    }

    // Creando un nuevo registro laboral con la hora actual
    const newWorkRecord = new WorkRecord({
      userId: creatorUserId,
      checkInTime: new Date(),
      location,
      type,
    });

    await newWorkRecord.save();
    res.status(201).json(newWorkRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro laboral' });
  }
});

// Obtener todos los registros laborales de un usuario
router.get('/workrecords', auth, async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? req.query.userId : req.user.userId;  // Si es admin, puede especificar el userId
    const workRecords = await WorkRecord.find({ userId });

    if (workRecords.length === 0) {
      return res.status(404).json({ message: 'Registros laborales no encontrados' });
    }
    
    res.status(200).json(workRecords);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros laborales' });
  }
});

// Actualizar un registro laboral (solo admin puede editar)
router.put('/workrecords/:id', auth, checkRole('admin'), async (req, res) => {
  const { checkOutTime } = req.body;

  try {
    const workRecord = await WorkRecord.findByIdAndUpdate(req.params.id);
    if (!workRecord) {
      return res.status(404).json({ message: 'Registro laboral no encontrado' });
    }

    // Actualizar el registro laboral solo si es admin
    workRecord.checkOutTime = checkOutTime;
    await workRecord.save();
    res.status(200).json(workRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro laboral' });
  }
});

// Eliminar un registro laboral (solo admin puede eliminar)
router.delete('/workrecords/:id', auth, checkRole('admin'), async (req, res) => {
  try {
    const workRecord = await WorkRecord.findByIdAndDelete(req.params.id);
    if (!workRecord) {
      return res.status(404).json({ message: 'Registro laboral no encontrado' });
    }
    res.status(200).json({ message: 'Registro laboral eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro laboral' });
  }
});

module.exports = router;
