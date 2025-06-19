document.addEventListener('DOMContentLoaded', () => {
  const agregarBtn = document.getElementById('agregarBtn');
  const nuevaTarea = document.getElementById('nuevaTarea');
  const listaTareas = document.getElementById('listaTareas');
  const formulario = document.getElementById('formulario');

  // Guardar tareas
  function guardarTareas() {
    const tareas = [];
    listaTareas.querySelectorAll('li').forEach(li => {
      tareas.push({
        texto: li.childNodes[0].nodeValue.trim(),
        completada: li.classList.contains('completada')
      });
    });
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }

  // Ordenar tareas: incompletas primero
  function ordenarTareas() {
    const tareas = Array.from(listaTareas.querySelectorAll('li'));
    tareas.sort((a, b) => {
      const aCompletada = a.classList.contains('completada');
      const bCompletada = b.classList.contains('completada');
      return aCompletada - bCompletada;
    });
    tareas.forEach(t => listaTareas.appendChild(t));
  }

  // Crear tarea
  function crearTarea(texto, completada = false) {
    const li = document.createElement('li');
    li.textContent = texto;
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    // Permitir edición con doble clic
li.addEventListener('dblclick', () => {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = texto;
  input.style.flex = '1';
  input.style.fontSize = '16px';

  li.innerHTML = ''; // limpiamos para poner el input
  li.appendChild(input);
  input.focus();

  // Guardar al presionar Enter o perder foco
  input.addEventListener('blur', guardarEdicion);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') guardarEdicion();
  });

  function guardarEdicion() {
    const nuevoTexto = input.value.trim();
    if (nuevoTexto !== '') {
      li.textContent = nuevoTexto;

      // Reagregar botón eliminar
      li.appendChild(btnEliminar);

      guardarTareas();
      actualizarContador();
    } else {
      li.remove(); // si lo deja vacío, eliminar
      guardarTareas();
      actualizarContador();
    }
  }
});

    if (completada) li.classList.add('completada');

    li.addEventListener('click', () => {
      li.classList.toggle('completada');
      guardarTareas();
      ordenarTareas();
      actualizarContador();
       // Sonido al marcar como completada
  if (li.classList.contains('completada')) {
    document.getElementById('sonidoCompletar').play();
  }
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '❌';
    btnEliminar.style.marginLeft = '10px';
    btnEliminar.style.cursor = 'pointer';
    btnEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      li.remove();
      guardarTareas();
      actualizarContador();
    });

    li.appendChild(btnEliminar);
    listaTareas.appendChild(li);
  }

  // Cargar tareas
  function cargarTareas() {
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.forEach(t => crearTarea(t.texto, t.completada));
    ordenarTareas();
  }

  // Contador
  function actualizarContador() {
    const total = listaTareas.querySelectorAll('li').length;
    const completadas = listaTareas.querySelectorAll('li.completada').length;
    const pendientes = total - completadas;

    const contador = document.getElementById('contador');
    contador.textContent = `${total} tareas | ${completadas} completada${completadas !== 1 ? 's' : ''}, ${pendientes} pendiente${pendientes !== 1 ? 's' : ''}`;
  }

  // Evento del formulario
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = nuevaTarea.value.trim();
    if (texto !== '') {
      crearTarea(texto);
      nuevaTarea.value = '';
      guardarTareas();
      ordenarTareas();
      actualizarContador();
    }
  });

  // Inicial
  cargarTareas();
  actualizarContador();
});


