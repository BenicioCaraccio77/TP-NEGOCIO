import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

// Obtener todas las ventas
router.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from("ventas")
        .select(`
         *,
        detalle_ventas (
        id,
        producto_id,
        cantidad,
        precio_unitario,
        productos (
        nombre
        )
    )
`);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Registrar una venta
router.post("/", async (req, res) => {

    const { total, usuario_id } = req.body;

    const { data, error } = await supabase
        .from("ventas")
        .insert([
            {
                total,
                usuario_id
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Modificar una venta
router.put("/:id", async (req, res) => {

    const { id } = req.params;
    const { total, usuario_id } = req.body;

    const { data, error } = await supabase
        .from("ventas")
        .update({
            total,
            usuario_id
        })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Eliminar una venta
router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    const { data, error } = await supabase
        .from("ventas")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

export default router;