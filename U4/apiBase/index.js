const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});

app.get("/mensaje", (req, res) => {
  res.send("Mensaje desde Express");
});

app.get("/pagina", (req, res) => {
    const nombre = "Mar";
    res.send(`
        <style>
            .p1 {
                color: blue;
                background-color: yellow;
            }
        </style>
        <h1> Mi primera página web</h1>
        <p class= "p1">Creada con Express </p>
        <p >Hola, ${nombre}!</p>
    `);
});

app.get("/alumnos", (req, res) => {
    res.json({
        nombre:"Mar",
        carrera:"ISC",
        semestre: 7,
    });
});

app.get("/materias", (req, res) => {
    res.json([
        {
            nombre: "NoSQL",
            hora: "8:00 - 11:00",
        },
        {
            nombre: "Programación Web",
            hora: "14:00 - 17:00",
        }
    ]);
});

app.get("/mensaje/:nombre", (req, res) => {
    res.send(`Hola, ${req.params.nombre}!`);
});

app.get("/suma/:a/:b", (req, res) => { 
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    const suma = a + b;
    res.send(`Resultado: ${suma}`);
});

app.get("multiplicacion/:a/:b", (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    const multiplicacion = a * b;
    res.send(`Resultado: ${multiplicacion}`);
});


app.get("/aleatorio", (req, res) => {
    const numero = Math.floor(Math.random() * 100) + 1;
    res.send(`Número aleatorio: ${numero}`);
});

app.listen(port, () => {
  console.log("Servidor iniciado en http://localhost:" + port);
});