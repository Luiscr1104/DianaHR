const express = require('express');
const router = express.Router();
const WorkRecord = require('../models/WorkRecord');
const auth = require('../middleware/auth');

// Crear un nuevo registro laboral (Check-in)
router.post('/workrecords', auth, async (req, res) => {
  const { checkInTime, location } = req.body;

  try {
    const userId = req.user.userId;

    // Creando un nuevo registro laboral
    const newWorkRecord = new WorkRecord({
      userId,
      checkInTime,
      location,
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
    const userId = req.user.userId;
    const workRecords = await WorkRecord.find({ userId });
    res.status(200).json(workRecords);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros laborales' });
  }
});

// Actualizar la hora de salida de un registro (Check-out)
router.put('/workrecords/:id', auth, async (req, res) => {
  const { checkOutTime } = req.body;

  try {
    const workRecord = await WorkRecord.findByIdAndUpdate(req.params.id, { checkOutTime }, { new: true });
    if (!workRecord) {
      return res.status(404).json({ message: 'Registro laboral no encontrado' });
    }
    res.status(200).json(workRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro laboral' });
  }
});

// Eliminar un registro laboral
router.delete('/workrecords/:id', auth, async (req, res) => {
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
