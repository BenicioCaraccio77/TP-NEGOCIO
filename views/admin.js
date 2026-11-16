let categoriasDisponibles = []
let productoEditando = null

// Cargar categorías
function cargarCategorias() {

    fetch("/categorias")
        .then(respuesta => respuesta.json())
        .then(categorias => {

            categoriasDisponibles = categorias

            const select = document.getElementById("categoria")

            select.innerHTML = '<option value="">Seleccionar categoría</option>'

            categorias.forEach(categoria => {
                select.innerHTML += `
                    <option value="${categoria.id}">${categoria.nombre}</option>
                `
            })

        })
}

// Cargar productos
function cargarProductos() {

    fetch("/productos")
        .then(respuesta => respuesta.json())
        .then(productos => {

            const lista = document.getElementById("lista-productos")
            lista.innerHTML = ""

            productos.forEach(producto => {

                const categoria = categoriasDisponibles.find(c => c.id === producto.categoria_id)

                lista.innerHTML += `
                    <tr>
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>${categoria ? categoria.nombre : "Sin categoría"}</td>
                        <td>$${producto.precio}</td>
                        <td>${producto.stock}</td>
                        <td>
                            <button onclick="editarProducto(${producto.id})">Editar</button>
                            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        </td>
                    </tr>
                `

            })

        })
}

// Mostrar formulario para nuevo producto
function nuevoProducto() {

    productoEditando = null

    document.getElementById("titulo-formulario").innerText = "Nuevo producto"

    document.getElementById("nombre").value = ""
    document.getElementById("categoria").value = ""
    document.getElementById("precio").value = ""
    document.getElementById("stock").value = ""

    document.getElementById("formulario-producto").style.display = "block"
}

// Editar producto
function editarProducto(id) {

    fetch("/productos")
        .then(respuesta => respuesta.json())
        .then(productos => {

            const producto = productos.find(p => p.id === id)

            productoEditando = id

            document.getElementById("titulo-formulario").innerText = "Editar producto"
            document.getElementById("nombre").value = producto.nombre
            document.getElementById("categoria").value = producto.categoria_id
            document.getElementById("precio").value = producto.precio
            document.getElementById("stock").value = producto.stock

            document.getElementById("formulario-producto").style.display = "block"

        })
}

// Guardar producto
function guardarProducto() {

    const nombre = document.getElementById("nombre").value.trim()
    const categoria_id = document.getElementById("categoria").value
    const precio = document.getElementById("precio").value
    const stock = document.getElementById("stock").value

    if (nombre === "" || categoria_id === "" || precio === "" || stock === "") {
        alert("Completá todos los campos")
        return
    }

    if (isNaN(Number(precio)) || Number(precio) < 0 || isNaN(Number(stock)) || Number(stock) < 0) {
        alert("Ingresá valores válidos")
        return
    }

    const producto = {
        nombre: nombre,
        categoria_id: Number(categoria_id),
        precio: Number(precio),
        stock: Number(stock)
    }

    let url = "/productos/agregarp"
    let metodo = "POST"

    if (productoEditando !== null) {
        url = "/productos/" + productoEditando
        metodo = "PUT"
    }

    fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    })
    .then(respuesta => {

        if (!respuesta.ok) {
            throw new Error("No se pudo guardar el producto")
        }

        return respuesta.json()

    })
    .then(() => {

        alert("Producto guardado correctamente")

        cancelarFormulario()
        cargarProductos()

    })
    .catch(error => {
        alert(error.message)
    })
}

// Cancelar formulario
function cancelarFormulario() {

    document.getElementById("formulario-producto").style.display = "none"
    productoEditando = null

}

// Eliminar producto
function eliminarProducto(id) {

    const confirmar = confirm("Seguro que querés eliminar este producto?")

    if (confirmar) {

        fetch(`/productos/${id}`, {
            method: "DELETE"
        })
        .then(respuesta => {

            if (!respuesta.ok) {
                throw new Error("No se pudo eliminar el producto")
            }

            return respuesta.json()

        })
        .then(() => {
            alert("Producto eliminado correctamente")
            cargarProductos()
        })
        .catch(error => {
            alert(error.message)
        })

    }
}

// Iniciar
cargarCategorias()

setTimeout(() => { cargarProductos() }, 300)