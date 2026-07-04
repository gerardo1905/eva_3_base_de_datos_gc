window.onload = function () {
    obtenerDataUsuarios();
    obtenerDataMascotas(); // <--- Nueva llamada al cargar la pagina
};

async function obtenerDataUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        if (respuesta.ok) {
            const usuarios = await respuesta.json();
            console.log("Usuarios cargados:", usuarios);
            
            new DataTable('#tablaUsuarios',{
                data: usuarios,
                columns:[
                    {data: 'nombre'},
                    {data: 'rut'},
                    {data: 'paisOrigen[0].nombre'},
                    {data: 'celular'},
                    {data: 'email'},
                    {data: 'fechaNacimiento'}
                ]
            });
        }
    } catch (error) {
        console.log('Error al cargar los datos de usuarios: ', error);
    }
}

// nueva funcion: CARGAR TABLA DE MASCOTAS
async function obtenerDataMascotas() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerMascotas');
        if (respuesta.ok) {
            const mascotas = await respuesta.json();
            console.log("Mascotas cargadas:", mascotas);
            
            // Inicializamos DataTables para la tabla de mascotas
            new DataTable('#tablaMascotas', {
                data: mascotas,
                columns: [
                    { data: 'nombre' },
                    { data: 'especie' },
                    { data: 'raza' },
                    { data: 'edad' },
                    { data: 'peso' },
                    { data: 'color' },
                    { data: 'sexo' },
                    { data: 'fechaNacimiento' },
                    { data: 'observaciones' },
                    // Accedemos de forma limpia al dueño que trajimos gracias al $lookup de Mongo
                    { data: 'dueno[0].nombre', defaultContent: 'Sin dueño' } 
                ]
            });
        }
    } catch (error) {
        console.log('Error al cargar los datos de mascotas: ', error);
    }
}