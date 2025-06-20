// Importaciones
import express from "express";
import bodyParser from "body-parser";
import * as fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Constantes
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variables globales
let pedido = [];
let cantidadPedido = {};
let contadorPedidos = 0;
let menuSelected;
let titleMenu = "Menús";
let dbPedidos = [];

// Funciones de utilidad
async function readJsonFile(filename) {
  try {
    const data = await fs.promises.readFile(filename, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

async function writeJsonFile(filename, data) {
  try {
    await fs.promises.writeFile(filename, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    throw error;
  }
}

function calcularCantidadPedido(pedido) {
  return pedido.reduce((acc, producto) => {
    if (acc[producto.dishName]) {
      acc[producto.dishName].cantidad++;
      acc[producto.dishName].dishPrice = acc[producto.dishName].cantidad * producto.dishPrice;
    } else {
      acc[producto.dishName] = {
        dishPrice: producto.dishPrice,
        cantidad: 1,
      };
    }
    return acc;
  }, {});
}

// Inicialización
async function initializeApp() {
  try {
    const menu = await readJsonFile("favorite.json");
    menuSelected = menu[0].menús;
    await readJsonFile("pedidos.json").then(data => {
      dbPedidos = data;
    });
  } catch (error) {
    console.error("Error initializing app:", error);
    process.exit(1);
  }
}

// Rutas
app.get("/", async (req, res) => {  
  res.render("index.ejs", {
    menu: menuSelected || [],
    pedido: cantidadPedido,
    title: titleMenu,
  });
});

app.get("/pedidoTotal", (req, res) => {
  res.json(pedido);
});

app.get("/cajero", async (req, res) => {
  res.render("cajero.ejs", {
    pedidos: dbPedidos
  });
});

app.post("/api/deletePedido", async (req, res) => {
  try {
    const idPedido = req.body.idPedido;
    const index = dbPedidos.findIndex(pedido => pedido.id === idPedido);
    
    if (index !== -1) {
      dbPedidos.splice(index, 1);
      await writeJsonFile("pedidos.json", dbPedidos);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Pedido no encontrado" });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/menu", async (req, res) => {
  try {
    const input = req.body.menu;
    const menu = await readJsonFile("favorite.json");
    
    switch(input) {
      case "Menús":
        menuSelected = menu[0].menús;
        break;
      case "Completos":
        menuSelected = menu[0].completos;
        break;
      case "As":
        menuSelected = menu[0].as;
        break;
      case "Churrascos":
        menuSelected = menu[0].churrascos;
        break;
      case "Mechadas":
        menuSelected = menu[0].mechada;
        break;
      case "Hamburguesas":
        menuSelected = menu[0].hamburguesas;
        break;
      case "Pollos":
        menuSelected = menu[0].pollo;
        break;
      case "Empanadas":
        menuSelected = menu[0].empanadas;
        break;
      case "Bebidas":
        menuSelected = menu[0].bebidas;
        break;
      default:
        menuSelected = menu[0].menús;
    }
    
    titleMenu = input;
    res.redirect("/");
  } catch (error) {
    console.error("Error changing menu:", error);
    res.status(500).send("Error al cambiar el menú");
  }
});

app.post("/api/add-to-cart", (req, res) => {
  try {
    const dishInfo = req.body;
    for (let i = 0; i < dishInfo.dishCantidad; i++) {
      pedido.push(dishInfo);
    }
    cantidadPedido = calcularCantidadPedido(pedido);
    res.json({ message: "Plato agregado al carrito" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
});

app.post("/submit-order", async (req, res) => {
  try {
    const { numeroMesa, nombreCliente } = req.body;
    let montoTotal = 0;
    let cantidadPedido2 = {};

    for (const key in cantidadPedido) {
      montoTotal += cantidadPedido[key].dishPrice;
      cantidadPedido2[key] = cantidadPedido[key].cantidad;
    }

    const pedidoNuevo = {
      id: ++contadorPedidos,
      mesa: numeroMesa,
      nombre: nombreCliente,
      pedido: cantidadPedido2,
      monto: montoTotal,
      fecha: new Date().toISOString()
    };

    dbPedidos.push(pedidoNuevo);
    await writeJsonFile("pedidos.json", dbPedidos);

    // Limpiar el carrito
    pedido = [];
    cantidadPedido = {};
    
    // En lugar de redirigir, enviar una respuesta JSON
    res.json({ 
      success: true, 
      message: "Pedido enviado correctamente",
      menu: menuSelected,
      title: titleMenu
    });
  } catch (error) {
    console.error("Error submitting order:", error);
    res.status(500).json({ 
      success: false, 
      error: "Error al procesar el pedido" 
    });
  }
});

app.post("/api/deleteItem", (req, res) => {
  try {
    const itemSelected = req.body.itemSelected;
    
    // Eliminar del array pedido
    const index = pedido.findIndex(item => item.dishName === itemSelected);
    if (index !== -1) {
      pedido.splice(index, 1);
    }
    
    // Actualizar cantidadPedido
    if (cantidadPedido[itemSelected]) {
      cantidadPedido[itemSelected].cantidad--;
      if (cantidadPedido[itemSelected].cantidad === 0) {
        delete cantidadPedido[itemSelected];
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Error al eliminar el ítem" });
  }
});

app.get("/api/pedidos", (req, res) => {
  res.json(dbPedidos);
});

// Iniciar la aplicación
initializeApp().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
