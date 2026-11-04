import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

// Obtener todos los detalles de ventas
router.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from("detalle_ventas")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// Agregar un producto a una venta y descontar stock
router.post("/", async (req, res) => {

    const { venta_id, producto_id, cantidad, precio_unitario } = req.body;

    const { data, error } = await supabase.rpc("registrar_detalle_venta", {
        p_venta_id: venta_id,
        p_producto_id: producto_id,
        p_cantidad: cantidad,
        p_precio_unitario: precio_unitario
    });

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

export default router;