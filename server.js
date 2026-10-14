express = require ("express")

app= express ()
app.set ("view engine", "ejs")

app.get ("/", (req,res)=> {
    res.render ("index")
}) 

app.get ("/productos", (req, res) => {
    prods = [
        {nombre: "Galletitas", categoria:"Alimento", precio: 1399, stock:10},
        {nombre: "Jabón Liquido", categoria:"Higiene", precio: 2100, stock:12},
        {nombre: "Dulce De Leche", categoria: "Alimento", precio: 2700, stock:11}
    ]
    res.render ("catalogo", {prods})
})

app.listen (3000, () => {
    console.log ("Servidor funcionando en http://localhost:3000")
})