import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

// Obtener todas las categorías
router.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from("categorias")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Agregar una categoría
router.post("/", async (req, res) => {

    const { nombre } = req.body;

    const { data, error } = await supabase
        .from("categorias")
        .insert([
            {
                nombre
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Modificar una categoría
router.put("/:id", async (req, res) => {

    const { id } = req.params;
    const { nombre } = req.body;

    const { data, error } = await supabase
        .from("categorias")
        .update({
            nombre
        })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Eliminar una categoría
router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    const { data, error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

export default router;