window.onload = function () {
    cargarUsuarios();
};

async function cargarUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        if (respuesta.ok) {
            const usuarios = await respuesta.json();
            const select = document.getElementById('selectUsuario');

            usuarios.forEach(user => {
                const option = document.createElement('option');
                option.value = user._id; // Guardamos el ID único de MongoDB como valor
                option.textContent = `${user.nombre} (RUT: ${user.rut})`; // Mostramos nombre y RUT
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.log('Error al cargar la data de usuarios para el selector:', error);
    }
}

function validarFormularioMascota() {
    const usuario = document.getElementById('selectUsuario');
    const nombre = document.getElementById('inputNombre');
    const especie = document.getElementById('inputEspecie');
    const raza = document.getElementById('inputRaza');
    const edad = document.getElementById('inputEdad');
    const peso = document.getElementById('inputPeso');
    const color = document.getElementById('inputColor');
    const sexo = document.getElementById('selectSexo');
    const fechaNac = document.getElementById('inputNacimiento');

    let formularioValido = true;

    // Valodamos uno a uno los campos obligatorios utilizando la funcion reutilizable
    if (!validarInput(usuario)) { formularioValido = false; }
    if (!validarInput(nombre)) { formularioValido = false; }
    if (!validarInput(especie)) { formularioValido = false; }
    if (!validarInput(raza)) { formularioValido = false; }
    if (!validarInput(edad)) { formularioValido = false; }
    if (!validarInput(peso)) { formularioValido = false; }
    if (!validarInput(color)) { formularioValido = false; }
    if (!validarInput(sexo)) { formularioValido = false; }
    if (!validarInput(fechaNac)) { formularioValido = false; }

    if (formularioValido === true) {
        alert('Datos de la mascota ingresados correctamente, guardando...');

        const formulario = document.getElementById('formularioMascota');
        const inputsForm = new FormData(formulario);
        
        // Convertimos los campos del formulario en un objeto plano para mandarlo como JSON
        const datosMascota = Object.fromEntries(inputsForm.entries());

        const enviarDatos = async () => {
            try {
                const respuesta = await fetch('http://localhost:3000/guardarMascota', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosMascota)
                });

                if (respuesta.ok) {
                    // Redirecciona a la pagina de datos para ver los resultados
                    window.location.href = './datos.html';
                } else {
                    console.log(await respuesta.json());
                }
            } catch (error) {
                console.log('Error al guardar la mascota:', error);
            }
        };
        enviarDatos();
    }
}

function validarInput(elemento) {
    if (elemento.value === '') {
        elemento.classList.add('alerta', 'is-invalid');
        elemento.classList.remove('correcto', 'is-valid');
        return false;
    } else {
        elemento.classList.remove('alerta', 'is-invalid');
        elemento.classList.add('correcto', 'is-valid');
        return true;
    }
}