import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

// Obtener todos los productos
router.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from("productos")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Agregar un producto
router.post("/", async (req, res) => {

    const { nombre, precio, stock, categoria_id } = req.body;

    const { data, error } = await supabase
        .from("productos")
        .insert([
            {
                nombre,
                precio,
                stock,
                categoria_id
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Modificar un producto
router.put("/:id", async (req, res) => {

    const { id } = req.params;
    const { nombre, precio, stock, categoria_id } = req.body;

    const { data, error } = await supabase
        .from("productos")
        .update({
            nombre,
            precio,
            stock,
            categoria_id
        })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    const { data, error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

export default router;