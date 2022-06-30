/*
Consigna:

Realizar un proyecto de servidor basado en node.js que utilice el módulo express e implemente los siguientes endpoints en el puerto 8080:
    1) Ruta get '/productos' que devuelva un array con todos los productos disponibles en el servidor
    2) Ruta get '/productoRandom' que devuelva un producto elegido al azar entre todos los productos disponibles
    3) Incluir un archivo de texto 'productos.txt' y utilizar la clase Contenedor del desafío anterior para acceder a los datos persistidos del servidor.

Antes de iniciar el servidor, colocar en el archivo 'productos.txt' tres productos como en el ejemplo del desafío anterior.

*/
const fsBase = require('fs');
const fs = fsBase.promises
const express = require('express')
const app = express()
const PORT = 8080
const FILE = "files/productos.txt"

class Contenedor { 
    constructor (nameFile) { 
        this.nameFile = nameFile;
    }

    async getAll() {

        try {
            const data = await fs.readFile(this.nameFile, "utf-8");
            return JSON.parse(data);
        }
        catch (e)
        {
            return "Error: " + e;
        }
    }

    async getById(findId) {

        try {
            const data = await fs.readFile(this.nameFile, "utf-8");
            let arrProductos = JSON.parse(data);
            let producto = arrProductos.find(({id}) => id == findId) || null;
            return producto;
        }
        catch (e)
        {
            return "Error: " + e;
        }
    }
}

const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))

let contenedor = new Contenedor(FILE);


app.get('/productos', (req, res) => {

    contenedor.getAll().then(productos => 
        res.send({ productos })
    );
 })

 app.get('/productoRandom', (req, res) => {

    let aleatorio = Math.ceil(Math.random()*3); 

    contenedor.getById(aleatorio).then(producto => 
        res.send({ producto })
    );
 })




 






