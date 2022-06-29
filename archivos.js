const fsBase = require('fs');
const fs = fsBase.promises

// 1) Clase
class Contenedor { 
    constructor (nameFile) { 
        this.nameFile = nameFile;
    }

//2) save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
    async save (contenido) {

        let nuevoId = 1;   
        try {
            // si el archivo existe, lo recorro y recuper el ultimo ID asignado ---> si no existe, asigno ID = 1
            // guardo el registro
            let stat = await fs.stat(this.nameFile);

            if (stat.size > 0) {

                const lineas = await fs.readFile(this.nameFile, "utf-8");
                const arr = lineas.split();

                // guardo el contenido actual del archivo en un arreglo
                let arrTotal = JSON.parse(arr);

                // recupero el ultimo registro
                let arr1 =  arrTotal[arrTotal.length-1];

                // obtengo el ultimo id
                nuevoId = parseInt(arr1.id)

                //le sumo 1    
                nuevoId++;    

                // agrego nuevo objeto al array que contiene los registros del archivo
                arrTotal = [...arrTotal,{"title": contenido[0].title, "price": contenido[0].price , "thumbnail": contenido[0].thumbnail, "id": nuevoId }]

                await fs.writeFile(this.nameFile, JSON.stringify(arrTotal, null, 2) , 'utf-8');
            }
        }
        catch (e)
        {
            // si el archivo NO existe, se crea con id igual a 1
            let new_array = contenido.map(function(items) { return {...items, id:nuevoId}; })
            await fs.writeFile(this.nameFile, JSON.stringify(new_array, null, 2) , 'utf-8');
        }
        finally {
            return nuevoId;
        }   
    }
    
//3) getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
    async getById(findId) {

        try 
        {
            await this.sleep(2);
            const lineas = await fs.readFile(this.nameFile, "utf-8");
            const arr = lineas.split();
            let arrTotal = JSON.parse(arr);

            let producto = arrTotal.find(({id}) => id == findId) || null;

            return producto;
        }
        catch (e)
        {
            return "Error: " + e;
        }
    }

// 4) getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
    async getAll() {

        try 
        {
            await this.sleep(2);
            const lineas = await fs.readFile(this.nameFile, "utf-8");
            return lineas;
        }
        catch (e)
        {
            return "Error: " + e;
        }
    }

// 5) deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
    async deleteById(findId) {

        try 
        {
            await this.sleep(4);
            const lineas = await fs.readFile(this.nameFile, "utf-8");
            const arr = lineas.split();
            let arrTotal = JSON.parse(arr);

            const index = arrTotal.findIndex(obj => { 
                return obj.id == findId;
            });

            if (index > -1) {
                arrTotal.splice(index, 1); 
                
                await fs.writeFile(this.nameFile, JSON.stringify(arrTotal, null, 2) , 'utf-8');

                return "Eliminado!";
            }
            return "No existe el Id"
        }
        catch (e)
        {
            return "Error: " + e;
        }
    }

// 6) deleteAll(): void - Elimina todos los objetos presentes en el archivo.
    async deleteAll() {

        try {
            await this.sleep(5);
            await fs.unlink(this.nameFile);
            await fs.writeFile(this.nameFile, "" , 'utf-8');
            return "Eliminado!";
        }
        catch (e)
        {
            return "Error: " + e;
        }
    }

    sleep(seconds) {
        return new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, seconds * 1000);
          });
    }
}

// ***************************************************

let contenedor = new Contenedor('files/productos.txt')

let contenido = [];

contenido.push({
    title: 'Globo Terráqueo',                                                                                                                          
    price: 345.67,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png'
});

// 2) save
contenedor.save(contenido).then(datos => console.log("Save ID: ", datos));

// 3) getById
contenedor.getById(1).then(resultado => console.log("Get By Id: ", resultado));

// 4) getAll
contenedor.getAll().then(todos => console.log("Get All: ", todos));

// 5) deleteById(findId) 
contenedor.deleteById(1).then(eliminado => console.log("Resultado: ", eliminado));

// 6) deleteAll
contenedor.deleteAll().then(deleteTodos => console.log("Resultado: ", deleteTodos));


