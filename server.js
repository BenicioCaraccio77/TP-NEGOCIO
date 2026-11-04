import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./config/supabase.js";
import productosRoutes from "./routes/productos.js";
import categoriasRoutes from "./routes/categorias.js";
import usuariosRoutes from "./routes/usuarios.js";
import ventasRoutes from "./routes/ventas.js";
import detalleVentasRoutes from "./routes/detalleVentas.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cors());
app.use(express.json());
app.use(express.static("views"));

app.use("/productos", productosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/ventas", ventasRoutes);
app.use("/detalle-ventas", detalleVentasRoutes);

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/tienda.html");
});

app.get("/catalogo", async (req, res) => {
    const { data, error } = await supabase
        .from("productos")
        .select("*");

    if (error) {
        return res.status(500).send("Error al obtener los productos");
    }

    res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});
