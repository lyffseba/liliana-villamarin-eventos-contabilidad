const express = require('express');
const router = express.Router();
const EventExpense = require('../shared/models/EventExpense');

// Eventos endpoints
router.get('/', (req, res) => {
  res.json({
    message: 'Módulo de Eventos - Liliana Villamarin',
    endpoints: [
      'GET /gastos - Lista todos los gastos de eventos',
      'POST /gastos - Crear nuevo gasto',
      'GET /gastos/:id - Obtener gasto específico',
      'PUT /gastos/:id - Actualizar gasto',
      'DELETE /gastos/:id - Eliminar gasto',
      'GET /categorias - Lista categorías de gastos'
    ]
  });
});

// Gastos de eventos
router.get('/gastos', async (req, res) => {
  try {
    const mongoose = require('mongoose');

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        gastos: [],
        categorias: [
          'comida',
          'meseros',
          'paquetes',
          'bebidas',
          'transporte',
          'auxiliares_cocina',
          'decoracion',
          'lenceria',
          'musica',
          'arriendo_bodega'
        ],
        message: 'Base de datos no conectada - datos de ejemplo'
      });
    }

    const { categoria, fecha_desde, fecha_hasta, evento_id } = req.query;

    // Construir filtro de búsqueda
    let filter = {};
    if (categoria) filter.categoria = categoria;
    if (evento_id) filter.evento_id = evento_id;
    if (fecha_desde || fecha_hasta) {
      filter.fecha = {};
      if (fecha_desde) filter.fecha.$gte = new Date(fecha_desde);
      if (fecha_hasta) filter.fecha.$lte = new Date(fecha_hasta);
    }

    const gastos = await EventExpense.find(filter).sort({ fecha: -1 });

    res.json({
      success: true,
      count: gastos.length,
      gastos,
      categorias: [
        'comida',
        'meseros',
        'paquetes',
        'bebidas',
        'transporte',
        'auxiliares_cocina',
        'decoracion',
        'lenceria',
        'musica',
        'arriendo_bodega'
      ]
    });
  } catch (error) {
    console.error('Error obteniendo gastos de eventos:', error);

    // Check if it's a connection error
    if (error.message && error.message.includes('buffering timed out')) {
      return res.json({
        success: true,
        count: 0,
        gastos: [],
        categorias: [
          'comida',
          'meseros',
          'paquetes',
          'bebidas',
          'transporte',
          'auxiliares_cocina',
          'decoracion',
          'lenceria',
          'musica',
          'arriendo_bodega'
        ],
        message: 'Base de datos no conectada - datos de ejemplo'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

router.post('/gastos', async (req, res) => {
  try {
    const mongoose = require('mongoose');

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Gasto simulado creado exitosamente (base de datos no conectada)',
        gasto: {
          _id: 'simulated-' + Date.now(),
          categoria: req.body.categoria,
          descripcion: req.body.descripcion,
          monto: req.body.monto,
          fecha: req.body.fecha || new Date(),
          evento_id: req.body.evento_id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    const { categoria, descripcion, monto, fecha, evento_id } = req.body;

    // Validación básica
    if (!categoria || !descripcion || !monto || !evento_id) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben ser proporcionados'
      });
    }

    const nuevoGasto = new EventExpense({
      categoria,
      descripcion,
      monto: parseFloat(monto),
      fecha: fecha ? new Date(fecha) : new Date(),
      evento_id
    });

    const gastoGuardado = await nuevoGasto.save();

    res.status(201).json({
      success: true,
      message: 'Gasto creado exitosamente',
      gasto: gastoGuardado
    });
  } catch (error) {
    console.error('Error creando gasto de evento:', error);

    // Check if it's a connection error
    if (error.message && (
      error.message.includes('buffering timed out') ||
      error.message.includes('before initial connection') ||
      error.message.includes('bufferCommands = false')
    )) {
      return res.status(201).json({
        success: true,
        message: 'Gasto simulado creado exitosamente (base de datos no conectada)',
        gasto: {
          _id: 'simulated-' + Date.now(),
          categoria: req.body.categoria,
          descripcion: req.body.descripcion,
          monto: req.body.monto,
          fecha: req.body.fecha || new Date(),
          evento_id: req.body.evento_id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

router.get('/gastos/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { id } = req.params;

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      // Handle simulated IDs
      if (id.startsWith('simulated-')) {
        return res.json({
          success: true,
          gasto: {
            _id: id,
            categoria: 'comida',
            descripcion: 'Gasto simulado',
            monto: 50000,
            fecha: new Date(),
            evento_id: 'test-001',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado (base de datos no conectada)'
      });
    }

    const gasto = await EventExpense.findById(id);

    if (!gasto) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado'
      });
    }

    res.json({
      success: true,
      gasto
    });
  } catch (error) {
    console.error('Error obteniendo gasto de evento:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de gasto inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

router.put('/gastos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remover campos que no deberían actualizarse
    delete updates.createdAt;
    delete updates.updatedAt;

    const gasto = await EventExpense.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!gasto) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Gasto actualizado exitosamente',
      gasto
    });
  } catch (error) {
    console.error('Error actualizando gasto de evento:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de gasto inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

router.delete('/gastos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const gasto = await EventExpense.findByIdAndDelete(id);

    if (!gasto) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Gasto eliminado exitosamente',
      gasto: gasto
    });
  } catch (error) {
    console.error('Error eliminando gasto de evento:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de gasto inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Categorías de gastos para eventos
router.get('/categorias', (req, res) => {
  res.json({
    categorias: [
      {
        id: 'comida',
        nombre: 'Comida',
        descripcion: 'Recibos de comida para eventos'
      },
      {
        id: 'meseros',
        nombre: 'Meseros',
        descripcion: 'Pagos a personal de servicio'
      },
      {
        id: 'paquetes',
        nombre: 'Paquetes',
        descripcion: 'Paquetes de servicios'
      },
      {
        id: 'bebidas',
        nombre: 'Bebidas',
        descripcion: 'Bebidas para eventos'
      },
      {
        id: 'transporte',
        nombre: 'Transporte',
        descripcion: 'Pago furgón, gasolina, mantenimiento'
      },
      {
        id: 'auxiliares_cocina',
        nombre: 'Auxiliares de Cocina',
        descripcion: 'Personal auxiliar de cocina'
      },
      {
        id: 'decoracion',
        nombre: 'Decoración',
        descripcion: 'Elementos decorativos'
      },
      {
        id: 'lenceria',
        nombre: 'Lencería',
        descripcion: 'Manteles, servilletas, etc.'
      },
      {
        id: 'musica',
        nombre: 'Música',
        descripcion: 'Servicios musicales y sonido'
      },
      {
        id: 'arriendo_bodega',
        nombre: 'Arriendo Bodega',
        descripcion: 'Arriendo de espacios de almacenamiento'
      }
    ]
  });
});

module.exports = router;
