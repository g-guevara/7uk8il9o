require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("MongoDB conectado"))
.catch(err => console.error("Error conectando a MongoDB", err));

const EventoSchema = new mongoose.Schema({
    Tipo: String,
    Evento: String,
    Fecha: String,
    Inicio: String,
    Fin: String,
    Sala: String,
    Edificio: String,
    Campus: String,
    fechaActualizacion: String,
  });
  
  const Evento = mongoose.model("Evento", EventoSchema, "eventos");
  
  app.get("/eventos", async (req, res) => {
    try {
      const eventos = await Evento.find();
      res.json(eventos);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener los datos" });
    }
  });
  

module.exports = app; // Para que Vercel lo maneje

