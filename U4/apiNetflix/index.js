const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const port = 3000;
const dns = require('dns');

app.use(morgan("dev"));

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

mongoose.connect("mongodb+srv://grupo:grupo@servidorprueba.ygegryf.mongodb.net/netflix")
.then(() => {
    console.log("Conectado correctamente a MongoDB");
})
.catch((error) => {
    console.error("Error al conectar con MongoDB", error);
});

app.listen(port, () => {
  console.log("Servidor iniciado en http://localhost:" + port);
});

const peliculaSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        genero: { type: String, required: true, trim: true },
        año: { type: Number, required: true },
        duracion: { type: Number, required: true, min: 1 },
        idioma: { type: String, required: true, trim: true },
        calificacion: { type: Number, required: true, min: 0, max: 10 },
        nc: { type: String, required: true, trim: true }
    },
    {
        timestamps: true
    }
);

const serieSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        genero: { type: String, required: true, trim: true },
        año: { type: Number, required: true },
        temporadas: { type: Number, required: true, min: 1 },
        episodios: { type: Number, required: true, min: 1 },
        idioma: { type: String, required: true, trim: true },
        calificacion: { type: Number, required: true, min: 0, max: 10 },
        nc: { type: String, required: true, trim: true }
    },
    {
        timestamps: true
    }
);

const Pelicula = mongoose.model('Pelicula', peliculaSchema);
const Serie = mongoose.model('Serie', serieSchema);

app.get('/peliculas', async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.status(200).json(peliculas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las películas', error: error.message });
    }
});

app.post('/peliculas', async (req, res) => {
    try {
        const nuevaPelicula = new Pelicula(req.body);
        const peliculaGuardada = await nuevaPelicula.save();
        res.status(201).json(peliculaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la película', error: error.message });
    }
});

app.put('/peliculas/:id', async (req, res) => {
    try {
        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!peliculaActualizada) {
            return res.status(404).json({ mensaje: 'Película no encontrada' });
        }
        res.status(200).json(peliculaActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la película', error: error.message });
    }
});

app.delete('/peliculas/:id', async (req, res) => {
    try {
        const peliculaEliminada = await Pelicula.findByIdAndDelete(req.params.id);
        if (!peliculaEliminada) {
            return res.status(404).json({ mensaje: 'Película no encontrada' });
        }
        res.status(200).json({ mensaje: 'Película eliminada correctamente', pelicula: peliculaEliminada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la película', error: error.message });
    }
});

app.get('/series', async (req, res) => {
    try {
        const series = await Serie.find();
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las series', error: error.message });
    }
});

app.post('/series', async (req, res) => {
    try {
        const nuevaSerie = new Serie(req.body);
        const serieGuardada = await nuevaSerie.save();
        res.status(201).json(serieGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la serie', error: error.message });
    }
});

app.put('/series/:id', async (req, res) => {
    try {
        const serieActualizada = await Serie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!serieActualizada) {
            return res.status(404).json({ mensaje: 'Serie no encontrada' });
        }
        res.status(200).json(serieActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la serie', error: error.message });
    }
});

app.delete('/series/:id', async (req, res) => {
    try {
        const serieEliminada = await Serie.findByIdAndDelete(req.params.id);
        if (!serieEliminada) {
            return res.status(404).json({ mensaje: 'Serie no encontrada' });
        }
        res.status(200).json({ mensaje: 'Serie eliminada correctamente', serie: serieEliminada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la serie', error: error.message });
    }
});