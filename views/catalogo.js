let carrito = [];
let productosDisponibles = [];

fetch("/catalogo")
    .then(respuesta => respuesta.json())
    .then(productos => {
        productosDisponibles = productos;
        const lista = document.getElementById("lista-productos");

        productos.forEach(producto => {

            lista.innerHTML += `
                <article class="producto">
                    <h3>${producto.nombre}</h3>
                    <p>Stock disponible: ${producto.stock}</p>
                    <span class="precio">$${producto.precio}</span>
                    <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                </article>
            `;

        });

    });


function comprarProducto(id, precio) {


    fetch("/ventas", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
         },
            body: JSON.stringify({
            total: 0,
            usuario_id: 2
        })
    })
        .then(respuesta => respuesta.json())
        .then(venta => {

        console.log("Venta creada:", venta);

        const idVenta = venta[0].id;
        console.log("ID de la venta:", idVenta);

        fetch("/detalle-ventas", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        venta_id: idVenta,
        producto_id: id,
        cantidad: 1,
        precio_unitario: precio
     })
    })
    .then(respuesta => respuesta.json())
    .then(detalle => {
    console.log("Producto agregado a la venta:", detalle);

    alert("Compra realizada correctamente");
});

    });

}

function agregarAlCarrito(id) {

    const producto = productosDisponibles.find(p => p.id === id);

    carrito.push(producto);

    console.log("Carrito:", carrito);
    mostrarCarrito();

    alert("Producto agregado al carrito");
}

function mostrarCarrito() {

    const lista = document.getElementById("carrito");

    lista.innerHTML = "";

    carrito.forEach(producto => {

        lista.innerHTML += `
            <p>${producto.nombre} - $${producto.precio}</p>
        `;

    });

    let total = 0;

    carrito.forEach(producto => {
        total += producto.precio;
    });

    document.getElementById("total-carrito").innerText = "Total: $" + total;
}
function confirmarCompra() {

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);

    fetch("/ventas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            total: total,
            usuario_id: 2
        })
    })
    .then(respuesta => respuesta.json())
    .then(venta => {

        const idVenta = venta[0].id;

        Promise.all(
            carrito.map(producto => {

                return fetch("/detalle-ventas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        venta_id: idVenta,
                        producto_id: producto.id,
                        cantidad: 1,
                        precio_unitario: producto.precio
                    })
                }).then(respuesta => respuesta.json());

            })
        ).then(() => {

            alert("¡Compra realizada correctamente!");

            carrito = [];
            mostrarCarrito();

        });

    });

}