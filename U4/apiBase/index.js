const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const port = 3000;

app.use(morgan("dev"));

mongoose.connect("mongodb://127.0.0.1:27017/escuela2").then(() => {
    console.log("Conectado correctamente a MongoDB");
}).catch((error)=>{
    console.error("Error al conectar a MongoDB:", error);
});

const alumnoSchema = new mongoose.Schema(
    {
        nombre: {type: String, required: true, trim: true},
        carrera: {type: String, required: true, trim: true},
        semestre: {type: Number, required: true, min: 1},
    },
    {
        timestamps: true
    }
);

const Alumno = mongoose.model("Alumno", alumnoSchema);


let alumnos = [
    {
        id: 1,
        nombre: "Mar",
        carrera: "ISC",
        semestre: 7,
    },
    {
        id: 2,
        nombre: "Juan",
        carrera: "IM",
        semestre: 6,
    }
]

app. get("/alumnos", async(req, res) => {
    try{
        const alumnos = await Alumno.find();
        res.json(alumnos);
    }catch(error){
        res.status(500).json({
            mensaje: "Error al obtener los alumnos",
            error: error
        })
    }
});

app.get("/alumnos/:id", async(req, res) => {
    try{
        const id = (req.params.id);
        const alumno = await Alumno.findById(id );
        if(!alumno){
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            })
        }
        res.json(alumno);
    }catch(error){
        res.status(500).json({
            mensaje: "Error al obtener alumno",
            error: error
        });
    };  
});

app.post("/alumnos", async(req, res) =>{
    try{
        const {nombre, carrera, semestre } = req.body;
        if(!nombre || !carrera || !semestre){
            return res.status(400).json({
                mensaje: "Faltan datos del alumno"
            });
        }
        const nuevoAlumno = new Alumno({
            nombre,carrera,semestre
        });

        const alumnoGuardado = await nuevoAlumno.save();

        res.json({
            mensaje: "Alumno registrado correctamente", 
            alumno: alumnoGuardado
        });
    }catch(error){
        res.status(500).json({
            mensaje: "Error al guardar alumno",
            error: error
        });
    };

});

app.put("/alumnos/:id", async(req, res) => {
    try{
        const id = (req.params.id);
        const { nombre, carrera, semestre} = req.body;

        if(!nombre || !carrera || !semestre){
            return res.status(400).json({
                mensaje: "Faltan datos del alumno"
            });
        }
       
        const alumnoActualizado = await Alumno.findByIdAndUpdate(
            id, 
            {nombre, carrera, semestre}, 
            {new: true, runValidators:true}
        );

        if(!alumnoActualizado){
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        };

        res.json({
            mensaje: "Alumno actualizado correctamente",
            alumno: alumnoActualizado
        })
    }catch(error){
        res.status(500).json({
            mensaje: "Error al actualizar alumno",
            error: error
        });
    }

});

app.delete("/alumnos/:id", async(req, res)=> {
    try{
        const id = (req.params.id);
        const alumnoEliminado = await Alumno.findByIdAndDelete(
            id
        );

        if(!alumnoEliminado){
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        };

        res.json({
            mensaje: "Alumno eliminado correctamente",
            alumno: alumnoEliminado
        });
    }catch(error){
        res.status(500).json({
            mensaje: "Error al eliminar alumno",
            error: error
        });
    }
});


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

app.get("/multiplicacion/:a/:b", (req, res) => {
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