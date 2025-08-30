# Sistema de Contabilidad Virtual - Liliana Villamarin Eventos

Un sistema de contabilidad virtual diseñado específicamente para la gestión financiera de **Liliana Villamarin Eventos**, especializada en eventos sociales y servicios de restaurante.

## 🎯 Descripción del Proyecto

Este sistema permite gestionar y controlar todos los gastos e ingresos relacionados con dos áreas principales del negocio:

### 📅 **Módulo de Eventos**
Gestión de gastos para eventos sociales, incluyendo:
- **Comida**: Recibos y gastos de alimentación
- **Personal**: Meseros y auxiliares de cocina
- **Servicios**: Paquetes, bebidas, música
- **Logística**: Transporte (furgón, gasolina, mantenimiento)
- **Decoración**: Elementos decorativos y lencería
- **Infraestructura**: Arriendo de bodegas

### 🍽️ **Módulo de Restaurante**
Control financiero del restaurante, incluyendo:
- **Nómina**: Gestión de salarios del personal
- **Insumos**: Compras de mercado y productos
- **Arriendo**: Pago de arriendo del local

## 🚀 Características

- ✅ API REST para gestión de gastos
- ✅ Categorización automática de gastos
- ✅ Módulos separados para Eventos y Restaurante
- ✅ Seguridad con autenticación JWT
- ✅ Validación de datos
- ✅ Rate limiting para protección de API
- ✅ Documentación automática de endpoints

## 📋 Requisitos Previos

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (opcional para persistencia de datos)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/liliana-villamarin-eventos-contabilidad.git
   cd liliana-villamarin-eventos-contabilidad
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Ejecutar en producción**
   ```bash
   npm start
   ```

## 📚 Uso de la API

### Endpoints Principales

#### 🎉 Eventos (`/api/eventos`)
```bash
# Listar todos los gastos de eventos
GET /api/eventos/gastos

# Crear nuevo gasto de evento
POST /api/eventos/gastos
{
  "categoria": "comida",
  "descripcion": "Catering evento matrimonio",
  "monto": 500000,
  "fecha": "2023-12-15",
  "evento_id": "evento-001"
}

# Obtener categorías disponibles
GET /api/eventos/categorias
```

#### 🏪 Restaurante (`/api/restaurante`)
```bash
# Listar gastos del restaurante
GET /api/restaurante/gastos

# Crear gasto de restaurante
POST /api/restaurante/gastos
{
  "categoria": "mercado",
  "descripcion": "Compra semanal ingredientes",
  "monto": 200000,
  "fecha": "2023-12-15"
}

# Gestionar nómina
GET /api/restaurante/nomina
POST /api/restaurante/nomina
```

### Health Check
```bash
GET /health
```

## 🏗️ Estructura del Proyecto

```
liliana-villamarin-eventos-contabilidad/
├── src/
│   ├── eventos/           # Módulo de eventos
│   │   └── routes.js
│   ├── restaurante/       # Módulo de restaurante
│   │   └── routes.js
│   ├── shared/           # Utilidades compartidas
│   └── index.js          # Punto de entrada principal
├── docs/                 # Documentación
├── tests/               # Pruebas
├── config/              # Configuraciones
├── package.json
├── .env.example
└── README.md
```

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch
```

## 🔧 Scripts Disponibles

- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `npm test` - Ejecutar pruebas
- `npm run lint` - Linting del código
- `npm run format` - Formatear código con Prettier

## 📈 Categorías de Gastos

### Eventos
1. **Comida** - Recibos de comida para eventos
2. **Meseros** - Pagos a personal de servicio
3. **Paquetes** - Paquetes de servicios
4. **Bebidas** - Bebidas para eventos
5. **Transporte** - Pago furgón, gasolina, mantenimiento
6. **Auxiliares de Cocina** - Personal auxiliar de cocina
7. **Decoración** - Elementos decorativos
8. **Lencería** - Manteles, servilletas, etc.
9. **Música** - Servicios musicales y sonido
10. **Arriendo Bodega** - Arriendo de espacios de almacenamiento

### Restaurante
1. **Nómina** - Salarios y pagos al personal
2. **Mercado** - Compras de insumos y productos
3. **Arriendo Local** - Pago de arriendo del local del restaurante

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

**Liliana Villamarin Eventos**
- Email: info@lilianavillamarineventos.com
- Teléfono: +57-xxx-xxxxxxx

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🚧 Roadmap

- [ ] Implementar base de datos MongoDB
- [ ] Añadir autenticación de usuarios
- [ ] Crear dashboard web
- [ ] Implementar reportes en PDF
- [ ] Añadir notificaciones por email
- [ ] Crear app móvil
- [ ] Integración con pasarelas de pago
- [ ] Sistema de facturación

---

*Desarrollado con ❤️ para Liliana Villamarin Eventos*
