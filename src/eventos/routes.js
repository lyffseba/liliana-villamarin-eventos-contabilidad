const express = require('express');
const router = express.Router();

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
router.get('/gastos', (req, res) => {
  // TODO: Implementar lógica para obtener gastos
  res.json({
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
    ]
  });
});

router.post('/gastos', (req, res) => {
  // TODO: Implementar validación y creación de gastos
  const { categoria, descripcion, monto, fecha, evento_id } = req.body;
  
  res.status(201).json({
    message: 'Gasto creado exitosamente',
    gasto: {
      id: Date.now(), // Temporal ID
      categoria,
      descripcion,
      monto,
      fecha,
      evento_id,
      created_at: new Date().toISOString()
    }
  });
});

router.get('/gastos/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implementar búsqueda por ID
  res.json({
    message: `Gasto ${id}`,
    gasto: null
  });
});

router.put('/gastos/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implementar actualización
  res.json({
    message: `Gasto ${id} actualizado`
  });
});

router.delete('/gastos/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implementar eliminación
  res.json({
    message: `Gasto ${id} eliminado`
  });
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
