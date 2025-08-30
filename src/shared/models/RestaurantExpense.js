const mongoose = require('mongoose');

const restaurantExpenseSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'nomina',
      'mercado',
      'arriendo_local'
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
  // Campos específicos para nómina
  nombre: {
    type: String,
    trim: true,
    required: function() {
      return this.categoria === 'nomina';
    }
  },
  cargo: {
    type: String,
    trim: true,
    required: function() {
      return this.categoria === 'nomina';
    }
  },
  salario: {
    type: Number,
    min: [0, 'El salario debe ser positivo'],
    required: function() {
      return this.categoria === 'nomina';
    }
  },
  fecha_ingreso: {
    type: Date,
    required: function() {
      return this.categoria === 'nomina';
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  bufferCommands: true
});

// Índices para mejorar rendimiento
restaurantExpenseSchema.index({ categoria: 1 });
restaurantExpenseSchema.index({ fecha: -1 });

// Virtual para formato de moneda
restaurantExpenseSchema.virtual('montoFormateado').get(function() {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(this.monto);
});

// Virtual para salario formateado (solo para nómina)
restaurantExpenseSchema.virtual('salarioFormateado').get(function() {
  if (this.categoria === 'nomina' && this.salario) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(this.salario);
  }
  return null;
});

module.exports = mongoose.model('RestaurantExpense', restaurantExpenseSchema);