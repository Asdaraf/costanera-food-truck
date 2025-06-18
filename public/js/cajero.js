// Elementos del DOM
const deleteItemButtons = document.querySelectorAll(".delete-item");

// Función para formatear la fecha
function formatearFecha(fecha) {
  const opciones = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return new Date(fecha).toLocaleString('es-ES', opciones);
}

// Agregar eventos listener a los botones de los pedidos
deleteItemButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      const infoPedidoElements = button.closest(".info-pedido");
      const idPedido = infoPedidoElements.getAttribute('data-id');
      
      if (!idPedido) {
        console.error("No se encontró el ID del pedido");
        return;
      }

      const response = await axios.post("/api/deletePedido", { idPedido: parseInt(idPedido) });
      
      if (response.data.success) {
        infoPedidoElements.remove();
      } else {
        console.error("Error al eliminar el pedido:", response.data.error);
      }
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
    }
  });
});

// Función para actualizar la lista de pedidos
function actualizarPedidos() {
  console.log('Ejecutando actualizarPedidos...');
  axios.get('/api/pedidos')
    .then(response => {
      const pedidos = response.data;
      const pedidosContainer = document.querySelector('.conteiner-pedidos');
      
      if (pedidosContainer) {
        const pedidosList = pedidosContainer.querySelector('ol');
        if (pedidosList) {
          pedidosList.innerHTML = ''; // Limpiar lista actual
          
          pedidos.forEach(pedido => {
            const pedidoElement = document.createElement('li');
            pedidoElement.className = 'info-pedido bg-[#2a2a2a] p-6 rounded-lg border-2 border-[#8B0000] hover:border-[#ff0000] transition-colors shadow-lg hover:shadow-xl relative overflow-hidden';
            pedidoElement.setAttribute('data-id', pedido.id);
            
            const fecha = pedido.fecha || new Date().toISOString();
            
            pedidoElement.innerHTML = `
              <div class="absolute top-0 right-0 w-24 h-24 bg-[#8B0000] opacity-10 transform rotate-45 translate-x-12 -translate-y-12"></div>
              <div class="pedido-header flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                <div class="flex items-center gap-2">
                  <span class="bg-[#2a2a2a] text-gray-300 px-3 py-1 rounded-full text-sm">Mesa ${pedido.mesa}</span>
                </div>
                <p class="fecha text-gray-400 text-sm">${formatearFecha(fecha)}</p>
              </div>
              <div class="mb-4">
                <p class="nombre text-lg font-semibold mb-2">
                  <span class="text-gray-400">Cliente:</span> ${pedido.nombre}
                </p>
                <div class="bg-[#333333] rounded-lg p-4">
                  <p class="text-white font-semibold mb-2">Pedido:</p>
                  <ol class="space-y-2">
                    ${Object.entries(pedido.pedido).map(([key, value]) => 
                      `<li class="item-pedido flex justify-between items-center text-gray-300">
                        <span>${key}</span>
                        <span class="bg-[#2a2a2a] px-2 py-1 rounded">x${value}</span>
                      </li>`
                    ).join('')}
                  </ol>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <p class="monto text-xl font-bold">
                  Total: <span class="text-[#8B0000]">$${pedido.monto}</span>
                </p>
                <button class="delete-item bg-[#8B0000] hover:bg-[#600000] text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <span>Borrar</span>
                </button>
              </div>
            `;
            
            pedidosList.appendChild(pedidoElement);
          });

          // Reasignar eventos a los nuevos botones
          document.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', async () => {
              try {
                const infoPedidoElements = button.closest(".info-pedido");
                const idPedido = infoPedidoElements.getAttribute('data-id');
                
                if (!idPedido) {
                  console.error("No se encontró el ID del pedido");
                  return;
                }

                const response = await axios.post("/api/deletePedido", { idPedido: parseInt(idPedido) });
                
                if (response.data.success) {
                  infoPedidoElements.remove();
                } else {
                  console.error("Error al eliminar el pedido:", response.data.error);
                }
              } catch (error) {
                console.error("Error al eliminar pedido:", error);
              }
            });
          });
        }
      }
    })
    .catch(error => {
      console.error('Error al obtener pedidos:', error);
      console.error('Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status
      });
    });
}

// Actualizar pedidos cada 5 segundos
setInterval(actualizarPedidos, 5000);


// Actualizar pedidos al cargar la página
document.addEventListener('DOMContentLoaded', actualizarPedidos);

/*setTimeout(function() {
  location.reload();
}, 5000);*/
