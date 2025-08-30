const express = require('express');
const router = express.Router();

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
router.get('/gastos', (req, res) => {
  // TODO: Implementar lógica para obtener gastos del restaurante
  res.json({
    gastos: [],
    categorias: [
      'nomina',
      'mercado',
      'arriendo_local'
    ]
  });
});

router.post('/gastos', (req, res) => {
  // TODO: Implementar validación y creación de gastos
  const { categoria, descripcion, monto, fecha } = req.body;
  
  res.status(201).json({
    message: 'Gasto del restaurante creado exitosamente',
    gasto: {
      id: Date.now(), // Temporal ID
      categoria,
      descripcion,
      monto,
      fecha,
      created_at: new Date().toISOString()
    }
  });
});

router.get('/gastos/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implementar búsqueda por ID
  res.json({
    message: `Gasto del restaurante ${id}`,
    gasto: null
  });
});

router.put('/gastos/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implementar actualización
  res.json({
    message: `Gasto del restaurante ${id} actualizado`
  });
});

router.delete('/gastos/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implementar eliminación
  res.json({
    message: `Gasto del restaurante ${id} eliminado`
  });
});

// Nómina
router.get('/nomina', (req, res) => {
  // TODO: Implementar gestión de nómina
  res.json({
    message: 'Gestión de nómina del restaurante',
    empleados: [],
    total_nomina: 0
  });
});

router.post('/nomina', (req, res) => {
  // TODO: Implementar creación de empleados
  const { nombre, cargo, salario, fecha_ingreso } = req.body;
  
  res.status(201).json({
    message: 'Empleado agregado a la nómina',
    empleado: {
      id: Date.now(),
      nombre,
      cargo,
      salario,
      fecha_ingreso,
      created_at: new Date().toISOString()
    }
  });
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
