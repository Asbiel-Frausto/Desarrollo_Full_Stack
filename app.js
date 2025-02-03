class Tarea {
    constructor(nombre) {
        this.nombre = nombre;
        this.completada = false;
    }

    // Alterna el estado de completada
    toggleCompletada = () => {
        this.completada = !this.completada;
    };
}

// Clase que se encarga de gestionar las tareas
class GestorDeTareas {
    constructor() {
        this.tareas = this.cargarTareas();
    }

    // Añadir una nueva tarea
    agregarTarea = (nombre) => {
        const nuevaTarea = new Tarea(nombre);
        this.tareas.push(nuevaTarea);
        this.guardarTareas();
        this.mostrarTareas();
    };

    // Eliminar una tarea
    eliminarTarea = (indice) => {
        this.tareas.splice(indice, 1);
        this.guardarTareas();
        this.mostrarTareas();
    };

    // Editar una tarea
    editarTarea = (indice, nuevoNombre) => {
        this.tareas[indice].nombre = nuevoNombre;
        this.guardarTareas();
        this.mostrarTareas();
    };

    // Alternar el estado de una tarea
    alternarEstado = (indice) => {
        this.tareas[indice].toggleCompletada();
        this.guardarTareas();
        this.mostrarTareas();
    };

    // Mostrar las tareas en el DOM
    mostrarTareas = () => {
        const listaTareas = document.getElementById('taskList');
        listaTareas.innerHTML = ''; // Limpiar la lista actual

        this.tareas.forEach((tarea, indice) => {
            const li = document.createElement('li');
            li.className = tarea.completada ? 'completed' : '';

            li.innerHTML = `
                <span>${tarea.nombre}</span>
                <button onclick="gestorDeTareas.alternarEstado(${indice})">
                    ${tarea.completada ? 'Desmarcar' : 'Completar'}
                </button>
                <button onclick="gestorDeTareas.editarTareaPrompt(${indice})">Editar</button>
                <button onclick="gestorDeTareas.eliminarTarea(${indice})">Eliminar</button>
            `;

            listaTareas.appendChild(li);
        });
    };

    // Mostrar un prompt para editar
    editarTareaPrompt = (indice) => {
        const nuevoNombre = prompt('Edita la tarea:', this.tareas[indice].nombre);
        if (nuevoNombre && nuevoNombre.trim()) {
            this.editarTarea(indice, nuevoNombre.trim());
        }
    };

    // Guardar tareas en LocalStorage
    guardarTareas = () => {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    };

    // Cargar tareas desde LocalStorage
    cargarTareas = () => {
        const tareasGuardadas = localStorage.getItem('tareas');
        return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
    };
}

// Instanciar el gestor de tareas
const gestorDeTareas = new GestorDeTareas();
gestorDeTareas.mostrarTareas();

// Manejar el evento del botón "Añadir Tarea"
document.getElementById('addTaskButton').addEventListener('click', () => {
    const taskInput = document.getElementById('taskInput');
    const nombreTarea = taskInput.value.trim();

    if (nombreTarea) {
        gestorDeTareas.agregarTarea(nombreTarea);
        taskInput.value = ''; // Limpiar el campo de entrada
    } else {
        alert('Por favor, escribe una tarea válida.');
    }
});

// Función para registrar un usuario
document.getElementById('registerButton').addEventListener('click', async () => {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Usuario registrado exitosamente');
    } else {
        alert('Error al registrar el usuario: ' + data.message);
    }
});

// Función para iniciar sesión
document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Inicio de sesión exitoso');
        // Almacenar el token en localStorage
        localStorage.setItem('token', data.token);
        // Habilitar el formulario de tareas
        document.getElementById('taskInput').disabled = false;
        document.getElementById('addTaskButton').disabled = false;
    } else {
        alert('Error al iniciar sesión: ' + data.message);
    }
});
