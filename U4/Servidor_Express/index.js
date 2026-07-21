const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

app.use(morgan ("dev"));

app.get("/", (req, res) => {
  res.send("Hola");
});

//Ejercicio 1. Número par o impar

app.get("/par o impar/:numero", (req, res) => {
    const numero = parseInt(req.params.numero);
    res.send(`El número ${numero} es ${numero % 2 === 0 ? "par" : "impar"}`);
});

// Ejercicio 2. Mayor de edad
app.get("/mayor-edad/:edad", (req, res) => {
    const edad = parseInt(req.params.edad);
    res.send(`La persona es ${edad >= 18 ? "mayor" : "menor"} de edad.`);
});

// Ejercicio 3. Calculadora de operaciones: suma, resta, multiplicación y división

app.get("/calculadora/:operacion/:a/:b", (req, res) => {
    const operacion = req.params.operacion;
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b);
    let resultado;

    switch (operacion) {
        case "suma":
            resultado = a + b;  
            break;
        case "resta":
            resultado = a - b;          
            break;
        case "multiplicacion":
            resultado = a * b;
            break;
        case "division":
            if (b !== 0) {
                resultado = a / b;
            } else {
                return res.send("Error: División por cero no permitida.");
            }
            break;
        default:
            return res.send("Operación no válida. Usa suma, resta, multiplicacion o division.");
    }
    res.send(`Resultado de la ${operacion}: ${resultado}`);

});

// Ejercicio 4. Tabla de multiplicar
app.get("/tabla/:numero", (req, res) => {
    const numero = parseInt(req.params.numero); 
    let tabla = "";
    for (let i = 1; i <= 10; i++) {
        tabla += `${numero} x ${i} = ${numero * i}<br>`;
    }   
    res.send(tabla);
});


// Ejercicio 5. Calificación
app.get("/calificacion/:nota", (req, res) => {
    const nota = parseFloat(req.params.nota);
    let mensaje = "";

    if (nota >= 90) {
        mensaje = "Excelente";
    } else if (nota >= 80) {
        mensaje = "Muy bien";
    } else if (nota >= 70) {
        mensaje = "Aprobado";
    } else {
        mensaje = "Reprobado";
    }

    res.send(`La calificación es: ${nota} - ${mensaje}`);
});



app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});