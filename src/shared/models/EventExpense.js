const mongoose = require('mongoose');

const eventExpenseSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
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
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  monto: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
    min: [0, 'El monto debe ser positivo']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now
  },
  evento_id: {
    type: String,
    required: [true, 'El ID del evento es obligatorio'],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  bufferCommands: true
});

// Índices para mejorar rendimiento
eventExpenseSchema.index({ categoria: 1 });
eventExpenseSchema.index({ fecha: -1 });
eventExpenseSchema.index({ evento_id: 1 });

// Virtual para formato de moneda
eventExpenseSchema.virtual('montoFormateado').get(function() {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(this.monto);
});

module.exports = mongoose.model('EventExpense', eventExpenseSchema);