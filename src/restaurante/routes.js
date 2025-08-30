const express = require('express');
const router = express.Router();
const RestaurantExpense = require('../shared/models/RestaurantExpense');

// Restaurante endpoints
router.get('/', (req, res) => {
  res.json({
    message: 'Módulo de Restaurante - Liliana Villamarin',
    endpoints: [
      'GET /gastos - Lista todos los gastos del restaurante',
      'POST /gastos - Crear nuevo gasto',
      'GET /gastos/:id - Obtener gasto específico',
      'PUT /gastos/:id - Actualizar gasto',
      'DELETE /gastos/:id - Eliminar gasto',
      'GET /categorias - Lista categorías de gastos',
      'GET /nomina - Gestión de nómina',
      'POST /nomina - Agregar empleado a nómina'
    ]
  });
});

// Gastos del restaurante
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
          'nomina',
          'mercado',
          'arriendo_local'
        ],
        message: 'Base de datos no conectada - datos de ejemplo'
      });
    }

    const { categoria, fecha_desde, fecha_hasta } = req.query;

    // Construir filtro de búsqueda
    let filter = {};
    if (categoria) filter.categoria = categoria;
    if (fecha_desde || fecha_hasta) {
      filter.fecha = {};
      if (fecha_desde) filter.fecha.$gte = new Date(fecha_desde);
      if (fecha_hasta) filter.fecha.$lte = new Date(fecha_hasta);
    }

    const gastos = await RestaurantExpense.find(filter).sort({ fecha: -1 });

    res.json({
      success: true,
      count: gastos.length,
      gastos,
      categorias: [
        'nomina',
        'mercado',
        'arriendo_local'
      ]
    });
  } catch (error) {
    console.error('Error obteniendo gastos del restaurante:', error);

    // Check if it's a connection error
    if (error.message && (
      error.message.includes('buffering timed out') ||
      error.message.includes('before initial connection') ||
      error.message.includes('bufferCommands = false')
    )) {
      return res.json({
        success: true,
        count: 0,
        gastos: [],
        categorias: [
          'nomina',
          'mercado',
          'arriendo_local'
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
    const { categoria, descripcion, monto, fecha, nombre, cargo, salario, fecha_ingreso } = req.body;

    // Validación básica
    if (!categoria || !descripcion || !monto) {
      return res.status(400).json({
        success: false,
        message: 'Los campos categoria, descripcion y monto son obligatorios'
      });
    }

    // Validación adicional para nómina
    if (categoria === 'nomina') {
      if (!nombre || !cargo || !salario || !fecha_ingreso) {
        return res.status(400).json({
          success: false,
          message: 'Para gastos de nómina, nombre, cargo, salario y fecha_ingreso son obligatorios'
        });
      }
    }

    const nuevoGasto = new RestaurantExpense({
      categoria,
      descripcion,
      monto: parseFloat(monto),
      fecha: fecha ? new Date(fecha) : new Date(),
      ...(categoria === 'nomina' && {
        nombre,
        cargo,
        salario: parseFloat(salario),
        fecha_ingreso: new Date(fecha_ingreso)
      })
    });

    const gastoGuardado = await nuevoGasto.save();

    res.status(201).json({
      success: true,
      message: 'Gasto del restaurante creado exitosamente',
      gasto: gastoGuardado
    });
  } catch (error) {
    console.error('Error creando gasto del restaurante:', error);

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
    const { id } = req.params;

    const gasto = await RestaurantExpense.findById(id);

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
    console.error('Error obteniendo gasto del restaurante:', error);

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

    const gasto = await RestaurantExpense.findByIdAndUpdate(
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
    console.error('Error actualizando gasto del restaurante:', error);

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

    const gasto = await RestaurantExpense.findByIdAndDelete(id);

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
    console.error('Error eliminando gasto del restaurante:', error);

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

// Nómina
router.get('/nomina', async (req, res) => {
  try {
    const mongoose = require('mongoose');

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        empleados: [],
        total_nomina: 0,
        total_nomina_formateado: '$0',
        message: 'Base de datos no conectada - datos de ejemplo'
      });
    }

    const empleados = await RestaurantExpense.find({ categoria: 'nomina' })
      .sort({ fecha_ingreso: -1 });

    const total_nomina = empleados.reduce((total, empleado) => {
      return total + (empleado.salario || 0);
    }, 0);

    res.json({
      success: true,
      count: empleados.length,
      empleados,
      total_nomina,
      total_nomina_formateado: new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(total_nomina)
    });
  } catch (error) {
    console.error('Error obteniendo nómina del restaurante:', error);

    // Check if it's a connection error
    if (error.message && (
      error.message.includes('buffering timed out') ||
      error.message.includes('before initial connection') ||
      error.message.includes('bufferCommands = false')
    )) {
      return res.json({
        success: true,
        count: 0,
        empleados: [],
        total_nomina: 0,
        total_nomina_formateado: '$0',
        message: 'Base de datos no conectada - datos de ejemplo'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

router.post('/nomina', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { nombre, cargo, salario, fecha_ingreso, descripcion } = req.body;

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Empleado simulado agregado a la nómina (base de datos no conectada)',
        empleado: {
          _id: 'simulated-' + Date.now(),
          categoria: 'nomina',
          descripcion: descripcion || `Salario de ${nombre} - ${cargo}`,
          monto: parseFloat(salario),
          fecha: new Date(),
          nombre,
          cargo,
          salario: parseFloat(salario),
          fecha_ingreso: new Date(fecha_ingreso),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    // Validación básica
    if (!nombre || !cargo || !salario || !fecha_ingreso) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios: nombre, cargo, salario, fecha_ingreso'
      });
    }

    const nuevoEmpleado = new RestaurantExpense({
      categoria: 'nomina',
      descripcion: descripcion || `Salario de ${nombre} - ${cargo}`,
      monto: parseFloat(salario),
      fecha: new Date(),
      nombre,
      cargo,
      salario: parseFloat(salario),
      fecha_ingreso: new Date(fecha_ingreso)
    });

    const empleadoGuardado = await nuevoEmpleado.save();

    res.status(201).json({
      success: true,
      message: 'Empleado agregado a la nómina exitosamente',
      empleado: empleadoGuardado
    });
  } catch (error) {
    console.error('Error agregando empleado a nómina:', error);

    // Check if it's a connection error
    if (error.message && (
      error.message.includes('buffering timed out') ||
      error.message.includes('before initial connection') ||
      error.message.includes('bufferCommands = false')
    )) {
      const { nombre, cargo, salario, fecha_ingreso, descripcion } = req.body;
      return res.status(201).json({
        success: true,
        message: 'Empleado simulado agregado a la nómina (base de datos no conectada)',
        empleado: {
          _id: 'simulated-' + Date.now(),
          categoria: 'nomina',
          descripcion: descripcion || `Salario de ${nombre} - ${cargo}`,
          monto: parseFloat(salario),
          fecha: new Date(),
          nombre,
          cargo,
          salario: parseFloat(salario),
          fecha_ingreso: new Date(fecha_ingreso),
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

// Categorías de gastos para restaurante
router.get('/categorias', (req, res) => {
  res.json({
    categorias: [
      {
        id: 'nomina',
        nombre: 'Nómina',
        descripcion: 'Salarios y pagos al personal'
      },
      {
        id: 'mercado',
        nombre: 'Mercado',
        descripcion: 'Compras de insumos y productos'
      },
      {
        id: 'arriendo_local',
        nombre: 'Arriendo Local',
        descripcion: 'Pago de arriendo del local del restaurante'
      }
    ]
  });
});

module.exports = router;
