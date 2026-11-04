import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from("usuarios")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

export default router;