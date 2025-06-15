// Elementos del DOM
const cartItems = document.getElementById("cart-items"); // Toma el elemento "ul" con el id "cart-items"
const addToCartButtons = document.querySelectorAll("button:not(.delete-item)"); // Toma el query de todos los botones con la clase "add-to-cart"
const deleteItemButtons = document.querySelectorAll(".delete-item");

// Variables
let listItems = [];
let contadorItems = {};

// Función para obtener el pedido total al backend
async function getPedidoTotal() {
  try {
    const response = await axios.get("/pedidoTotal");
    const pedidoTotal = response.data;
    return pedidoTotal;
  } catch (error) {
    console.error(error);
  }
}

// Obtener el pedido total del backend
getPedidoTotal()
  .then((result) => {
    console.log(result);
    result.forEach((item) => {
      listItems.push(item);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Función para calcular la cantidad de cada producto en el pedido
function calcularCantidadPedido(pedido) {
  let contadorItems = {};
  pedido.forEach((producto) => {
    if (contadorItems[producto.dishName]) {
      contadorItems[producto.dishName].cantidad++;
    } else {
      contadorItems[producto.dishName] = {
        dishPrice: producto.dishPrice,
        cantidad: 1,
      };
    }
  });
  return contadorItems;
}

// Agregar event listener a los botones "Agregar al carrito"
addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Obtenemos informacion del producto seleccionado
    const menuItem = button.closest("li");
    const dishName = menuItem.querySelector("span").textContent;
    const dishPrice = parseInt(
      menuItem.querySelector("span:nth-child(2)").textContent.slice(1)
    );
    const dishCantidad = parseInt(menuItem.querySelector("input[type='number']").value);

    // Agregamos el producto al pedido
    for (let index = 0; index < dishCantidad; index++) {
      listItems.push({ dishName, dishPrice });
    }

    // Calcular la cantidad de cada productos en el pedido
    contadorItems = calcularCantidadPedido(listItems);

    // Agregar el producto al carrito (visualmente)
    for (const key in contadorItems) {
      console.log(key);
      if (key === dishName && !document.getElementById(`${key}`)) {
        console.log("hola");
        const cartItem = document.createElement("li");
        cartItem.className = "flex flex-row items-center justify-between bg-[#333333] p-3 rounded mb-4 border border-[#8B0000]";

        const innerDiv = document.createElement("div");
        innerDiv.className = "flex flex-row items-center justify-between w-full";
        cartItem.appendChild(innerDiv);

        const cartItemName = document.createElement("h3");
        cartItemName.setAttribute("id", `${key}`);
        cartItemName.className = "font-semibold text-white text-sm md:text-base";
        cartItemName.textContent = `${key} x ${contadorItems[key].cantidad}`;
        innerDiv.appendChild(cartItemName);

        const rightDiv = document.createElement("div");
        rightDiv.className = "flex items-center gap-4";
        innerDiv.appendChild(rightDiv);

        const cartItemPrice = document.createElement("p");
        cartItemPrice.setAttribute("id", `${key}-price`);
        cartItemPrice.className = "text-white text-sm md:text-base";
        const priceTotal = contadorItems[key].dishPrice * contadorItems[key].cantidad;
        cartItemPrice.textContent = `$${priceTotal}`;
        rightDiv.appendChild(cartItemPrice);

        const cartItemButtonDelete = document.createElement("button");
        cartItemButtonDelete.className = "delete-item p-2 bg-[#8B0000] rounded-full transition-colors";
        rightDiv.appendChild(cartItemButtonDelete);

        const imageButtonDelete = document.createElement("img");
        imageButtonDelete.setAttribute("src", "/images/borrar.png");
        imageButtonDelete.className = "w-5 h-5 md:w-6 md:h-6 mx-auto block";
        cartItemButtonDelete.appendChild(imageButtonDelete);

        cartItems.appendChild(cartItem);

        // Agregar evento de click al boton de eliminar
        cartItemButtonDelete.addEventListener("click", () => {
          const buttonElements = cartItemButtonDelete.closest("li");
          console.log(buttonElements);
          const elementSelected = buttonElements.querySelector("h3").id;
          console.log(elementSelected);

          contadorItems[elementSelected].cantidad--;

          if (contadorItems[elementSelected].cantidad === 0) {
            buttonElements.remove();
          } else {
            const cartItemName = document.getElementById(`${elementSelected}`);
            cartItemName.textContent = `${elementSelected} x ${contadorItems[elementSelected].cantidad}`;

            const cartItemPrice = document.getElementById(
              `${elementSelected}-price`
            );
            const priceTotal =
              contadorItems[elementSelected].dishPrice *
              contadorItems[elementSelected].cantidad;
            cartItemPrice.textContent = `$${priceTotal}`;
          }

          for (let i = 0; i <= listItems.length; i++) {
            if (listItems[i].dishName === elementSelected) {
              listItems.splice(i, 1);
              break;
            }
          }

          axios
            .post("/api/deleteItem", { itemSelected: elementSelected })
            .then((data) => {
              console.log("Plato agregado al carrito en el backend:", data);
            })
            .catch((error) => {
              console.error("Error al agregar al carrito:", error);
            });
        });
      } else if (contadorItems[key].cantidad > 1) {
        // const cartItem = document.createElement("li");
        // const cartItemName = cartItem.appendChild(document.createElement("h3"))
        // const cartItemPrice = cartItem.appendChild(document.createElement("p"));
        const cartItemName = document.getElementById(`${key}`);
        cartItemName.textContent = `${key} x ${contadorItems[key].cantidad}`;

        const cartItemPrice = document.getElementById(`${key}-price`);
        const priceTotal =
          contadorItems[key].dishPrice * contadorItems[key].cantidad;
        cartItemPrice.textContent = `$${priceTotal}`;
        //cartItems.appendChild(cartItem);
      }
    }

    // const cartItem = document.createElement("li");
    // const cartItemName = cartItem.appendChild(document.createElement("h3"))
    // const cartItemPrice = cartItem.appendChild(document.createElement("p"));
    // cartItemName.textContent = `${dishName} x ${contadorItems[key]}`;
    // cartItemPrice.textContent = `$${dishPrice}`;
    // cartItems.appendChild(cartItem);

    // Enviar información del plato al backend
    axios
      .post("/api/add-to-cart", {
        dishName: dishName,
        dishPrice: dishPrice,
        dishCantidad: dishCantidad,
      })
      .then((data) => {
        console.log("Plato agregado al carrito en el backend:", data);
      })
      .catch((error) => {
        console.error("Error al agregar al carrito:", error);
      });
  });
});

// Manejar el envío del pedido
document.getElementById("submit-order").addEventListener("click", async (e) => {
  e.preventDefault();
  
  const nombreCliente = document.getElementById("nombreCliente").value;
  const numeroMesa = document.getElementById("numeroMesa").value;

  if (!nombreCliente || !numeroMesa) {
    alert("Por favor, complete todos los campos");
    return;
  }

  try {
    const response = await axios.post("/submit-order", {
      nombreCliente,
      numeroMesa
    });

    if (response.data.success) {
      // Limpiar el carrito visualmente
      const cartItems = document.getElementById("cart-items");
      cartItems.innerHTML = "";
      
      // Limpiar los campos del formulario
      document.getElementById("nombreCliente").value = "";
      document.getElementById("numeroMesa").value = "";

      // Mostrar mensaje de éxito
      alert("Pedido enviado correctamente");

      // Restablecer las variables
      listItems = [];
      contadorItems = {};
    } else {
      alert("Error al enviar el pedido");
    }
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    alert("Error al enviar el pedido. Por favor, intente nuevamente.");
  }
});

deleteItemButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonElements = button.closest("li");
    console.log(buttonElements);
    const elementSelected = buttonElements.querySelector("h3").id;
    console.log(elementSelected);

    contadorItems = calcularCantidadPedido(listItems);
    console.log(contadorItems);

    contadorItems[elementSelected].cantidad--;

    if (contadorItems[elementSelected].cantidad === 0) {
      buttonElements.remove();
    } else {
      const cartItemName = document.getElementById(`${elementSelected}`);
      cartItemName.textContent = `${elementSelected} x ${contadorItems[elementSelected].cantidad}`;

      const cartItemPrice = document.getElementById(`${elementSelected}-price`);
      const priceTotal =
        contadorItems[elementSelected].dishPrice *
        contadorItems[elementSelected].cantidad;
      cartItemPrice.textContent = `$${priceTotal}`;
    }

    for (let i = 0; i <= listItems.length; i++) {
      if (listItems[i].dishName === elementSelected) {
        listItems.splice(i, 1);
        break;
      }
    }

    axios
      .post("/api/deleteItem", { itemSelected: elementSelected })
      .then((data) => {
        console.log("Plato agregado al carrito en el backend:", data);
      })
      .catch((error) => {
        console.error("Error al agregar al carrito:", error);
      });
  });
});
