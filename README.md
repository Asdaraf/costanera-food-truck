# Costanera FoodTrack

Sistema de gestión de pedidos para restaurante Costanera, desarrollado con Node.js, Express y EJS.

## Descripción

Costanera FoodTrack es una aplicación web que permite gestionar pedidos de comida de manera eficiente. El sistema incluye:

- Menú interactivo con diferentes categorías de productos
- Sistema de carrito de compras
- Gestión de pedidos por mesa
- Panel de cajero para visualizar y gestionar pedidos
- Interfaz intuitiva y responsive

## Características

- **Menú Categorizado**: Organizado en secciones:
  - Completos
  - As
  - Churrascos
  - Mechada
  - Hamburguesas
  - Pollo
  - Empanadas

- **Sistema de Pedidos**:
  - Selección de cantidad por producto
  - Carrito de compras en tiempo real
  - Asignación de pedidos a mesas
  - Registro de nombre del cliente

- **Panel de Cajero**:
  - Visualización de todos los pedidos
  - Gestión de pedidos (eliminación)
  - Cálculo automático de montos

## Tecnologías Utilizadas

- **Backend**:
  - Node.js
  - Express.js
  - EJS (Embedded JavaScript templating)

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript
  - Axios para peticiones HTTP

- **Almacenamiento**:
  - JSON para datos del menú y pedidos

## Estructura del Proyecto

```
AppRestorant/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── cliente.js
│   └── images/
├── views/
│   ├── index.ejs
│   └── cajero.ejs
├── favorite.json
├── pedidos.json
├── index.js
└── README.md
```

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

## Uso

1. **Interfaz de Pedidos**:
   - Seleccionar la categoría del menú deseada
   - Elegir productos y cantidades
   - Agregar al carrito
   - Ingresar nombre del cliente y número de mesa
   - Enviar pedido

2. **Panel de Cajero**:
   - Acceder a `/cajero`
   - Visualizar pedidos activos
   - Gestionar pedidos según necesidad

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

Link del Proyecto: [https://github.com/tu-usuario/costanera-foodtrack](https://github.com/tu-usuario/costanera-foodtrack) 