let carrito = []
let productosDisponibles = []
let categoriasDisponibles = []

Promise.all([
    fetch("/productos").then(respuesta => respuesta.json()),
    fetch("/categorias").then(respuesta => respuesta.json())
])
.then(([productos, categorias]) => {

    productosDisponibles = productos
    categoriasDisponibles = categorias

    const lista = document.getElementById("lista-productos")

    productos.forEach(producto => {

        const categoria = categorias.find(c => c.id === producto.categoria_id)
        const nombreImagen = producto.nombre.toLowerCase().replaceAll(" ", "-")
        const imagen = `/imagenes/${nombreImagen}.jpg`

        lista.innerHTML += `
            <article class="producto">
                <img src="${imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="categoria">Categoría: ${categoria ? categoria.nombre : "Sin categoría"}</p>
                <p class="stock">Stock disponible: ${producto.stock}</p>
                <span class="precio">$${producto.precio}</span>
                <button onclick="mostrarDetalles(${producto.id})">Ver detalles</button>
                <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </article>
        `

    })

})

// Buscador
let buscador = document.getElementById("buscador")

buscador.addEventListener("input", function() {

    let texto = buscador.value.toLowerCase()
    let productos = document.querySelectorAll(".producto")

    productos.forEach(producto => {

        if (producto.textContent.toLowerCase().includes(texto)) {
            producto.style.display = ""
        } else {
            producto.style.display = "none"
        }

    })

})

// Mostrar detalles del producto
function mostrarDetalles(id) {

    const producto = productosDisponibles.find(p => p.id === id)
    const categoria = categoriasDisponibles.find(c => c.id === producto.categoria_id)

    const detalles = document.getElementById("contenido-detalles")
    const modal = document.getElementById("detalle-producto")

    detalles.innerHTML = `
        <h2>${producto.nombre}</h2>
        <p>Categoría: ${categoria ? categoria.nombre : "Sin categoría"}</p>
        <p>Precio: $${producto.precio}</p>
        <p>Stock disponible: ${producto.stock}</p>
        <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `

    modal.style.display = "flex"
}

// Cerrar detalles
function cerrarDetalles() {
    document.getElementById("detalle-producto").style.display = "none"
}

function agregarAlCarrito(id) {

    const producto = productosDisponibles.find(p => p.id === id)

    if (producto.stock <= 0) {
        alert("No hay stock disponible")
        return
    }

    carrito.push(producto)

    console.log("Carrito:", carrito)
    mostrarCarrito()

    alert("Producto agregado al carrito")
}

function mostrarCarrito() {

    const lista = document.getElementById("carrito")

    lista.innerHTML = ""

    carrito.forEach(producto => {

        lista.innerHTML += `
            <p>${producto.nombre} - $${producto.precio}</p>
        `

    })

    let total = 0

    carrito.forEach(producto => {
        total += Number(producto.precio)
    })

    document.getElementById("total-carrito").innerText = "Total: $" + total
}

function confirmarCompra() {

    if (carrito.length === 0) {
        alert("El carrito está vacío")
        return
    }

    let total = 0

    carrito.forEach(producto => {
        total += Number(producto.precio)
    })

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

        const idVenta = venta[0].id

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
                }).then(respuesta => respuesta.json())

            })
        ).then(() => {

            alert("¡Compra realizada correctamente!")

            carrito = []
            mostrarCarrito()

        })
    })
}