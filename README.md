# Mi-Uni 🎓

Sistema de gestión académica universitaria para el seguimiento y planificación de carreras, materias y planes de estudio.

## Demo

https://v0-react-web-page-six.vercel.app/

## 📋 Descripción

**Mi-Uni** es una aplicación web diseñada para ayudar a estudiantes universitarios a gestionar su carrera académica de forma eficiente. Permite llevar un seguimiento de las materias cursadas, consultar planes de estudio, visualizar la oferta académica y planificar el progreso de múltiples carreras universitarias.

La plataforma ofrece una interfaz intuitiva y moderna que facilita la organización académica, permitiendo a los estudiantes tomar decisiones informadas sobre su trayectoria universitaria.

## ✨ Funcionalidades Principales

### 🎯 Gestión de Carreras
- **Mis Carreras**: Visualización y gestión de todas las carreras en las que el estudiante está inscrito
- **Agregar Carreras**: Posibilidad de registrar múltiples carreras universitarias
- **Detalle de Carreras**: Información completa sobre cada carrera con sus materias y correlativas

### 📚 Gestión de Materias
- **Materias en Curso**: Seguimiento de materias actualmente cursadas
- **Agregar/Editar Materias**: Gestión completa de materias en curso con sus detalles
- **Gestión de Notas**: Edición y seguimiento de calificaciones
- **Eliminación de Materias**: Posibilidad de remover materias del registro

### 📖 Planes de Estudio
- **Consulta de Planes**: Visualización completa de planes de estudio disponibles
- **Filtros Avanzados**: Sistema de filtrado para encontrar planes específicos
- **Detalle de Materias**: Información detallada de cada materia incluyendo correlativas

### 🗓️ Año Académico
- **Gestión de Año Académico**: Establecer y modificar el año académico actual
- **Selector de Carrera**: Cambiar entre diferentes carreras del usuario
- **Selector de Materias**: Elegir materias disponibles según la carrera

## 🛠️ Tecnologías Utilizadas

### Frontend
- **[Next.js 15.2.4](https://nextjs.org/)**: Framework de React para producción
- **[React 19](https://react.dev/)**: Biblioteca para interfaces de usuario
- **[TypeScript](https://www.typescriptlang.org/)**: Superset tipado de JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS utility-first
- **[Shadcn/ui](https://ui.shadcn.com/)**: Componentes de UI reutilizables

### Componentes UI (Radix UI)
- **@radix-ui/react-dialog**: Modales y diálogos
- **@radix-ui/react-dropdown-menu**: Menús desplegables
- **@radix-ui/react-select**: Selectores personalizados
- **@radix-ui/react-tabs**: Sistema de pestañas
- **@radix-ui/react-toast**: Notificaciones
- **@radix-ui/react-avatar**: Avatares de usuario
- Y muchos más componentes de Radix UI

### Gestión de Estado y Formularios
- **[React Hook Form](https://react-hook-form.com/)**: Manejo de formularios
- **[Zod](https://zod.dev/)**: Validación de esquemas
- **@hookform/resolvers**: Integración de Zod con React Hook Form
- **Context API**: Gestión de estado global (AuthContext, PlanesEstudioFiltrosContext)

### Backend y Base de Datos
- **[Firebase](https://firebase.google.com/)**: Autenticación y servicios backend
- **[PostgreSQL](https://www.postgresql.org/)** (pg): Base de datos relacional
- **API Routes de Next.js**: Endpoints del lado del servidor

### Utilidades y Herramientas
- **[Lucide React](https://lucide.dev/)**: Iconos
- **[date-fns](https://date-fns.org/)**: Manipulación de fechas
- **[Sonner](https://sonner.emilkowal.ski/)**: Sistema de notificaciones toast
- **[Recharts](https://recharts.org/)**: Gráficos y visualizaciones
- **clsx & tailwind-merge**: Utilidades para clases CSS

### Desarrollo
- **[Biome](https://biomejs.dev/)**: Linter y formateador
- **[pnpm](https://pnpm.io/)**: Gestor de paquetes eficiente
- **tsx**: Ejecución de TypeScript
- **dotenv**: Variables de entorno

## 📁 Estructura del Proyecto

```
mi-uni/
├── adapters/           # Adaptadores para transformación de datos
├── app/                # Páginas y rutas de Next.js
│   ├── api/           # API Routes (backend endpoints)
│   ├── login/         # Página de inicio de sesión
│   ├── register/      # Página de registro
│   ├── materias/      # Gestión de materias
│   ├── planes-estudio/ # Consulta de planes
│   └── ...
├── components/         # Componentes React reutilizables
│   ├── ui/            # Componentes base de UI
│   ├── materias-en-curso/
│   ├── planes-estudio/
│   └── ...
├── contexts/           # Contextos de React (estado global)
├── data/              # Fuentes de datos y servicios
├── hooks/             # Custom React hooks
├── lib/               # Utilidades y configuraciones
│   ├── database/      # Configuración de base de datos
│   └── firebase/      # Configuración de Firebase
├── models/            # Modelos TypeScript e interfaces
├── public/            # Archivos estáticos
├── scripts/           # Scripts de utilidad
│   └── sql/          # Scripts SQL
├── styles/            # Estilos globales
└── utils/             # Funciones de utilidad
```

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18+ 
- pnpm 10.13.1+
- PostgreSQL
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/victor-POL/mi-uni.git
cd mi-uni
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local con las siguientes variables:
# Firebase
# PostgreSQL

```

4. **Configurar la base de datos**
```bash
# Ejecutar scripts SQL en /scripts/sql/
```

5. **Ejecutar en modo desarrollo**
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📜 Scripts Disponibles

```bash
pnpm dev          # Inicia el servidor de desarrollo
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia el servidor de producción
pnpm lint         # Ejecuta el linter de Next.js
pnpm type-check   # Verifica tipos de TypeScript
pnpm biome-format # Formatea el código con Biome
pnpm biome-lint   # Ejecuta el linter de Biome
```

## 🔒 Seguridad

- Autenticación mediante Firebase Authentication
- Rutas protegidas con `ProtectedRoute` component
- Validación de formularios con Zod
- Variables de entorno para datos sensibles
- Gestión segura de sesiones

## 👤 Autor

**Victor POL**

- GitHub: [@victor-POL](https://github.com/victor-POL)

---

**Desarrollado con ❤️ para facilitar la vida universitaria**
