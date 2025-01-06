const participantes = {};
const jugadores = ['Santi', 'Vega', 'Nico', 'Mati', 'Ernes', 'Colo', 'Tobi', 'Fede', 'Jero'];

function cambiarFormulario() {
    const tipoPartida = document.getElementById('tipoPartida').value;
    const formularioPartida = document.getElementById('formularioPartida');
    formularioPartida.innerHTML = '';

    if (tipoPartida === '2v2') {
        formularioPartida.innerHTML = `
            <div class="jugador-row">
                <h3>Equipo 1</h3>
                ${crearSelectJugadores('jugador1')}
                ${crearSelectJugadores('jugador2')}
            </div>
            <div class="jugador-row">
                <h3>Equipo 2</h3>
                ${crearSelectJugadores('jugador3')}
                ${crearSelectJugadores('jugador4')}
            </div>
            <div class="jugador-row">
                <h3>Puntuación</h3>
                <input type="number" id="puntosEquipo1" placeholder="Puntos Equipo 1">
                <input type="number" id="puntosEquipo2" placeholder="Puntos Equipo 2">
            </div>
        `;
    } else if (tipoPartida === '3v3') {
        formularioPartida.innerHTML = `
            <div class="jugador-row">
                <h3>Equipo 1</h3>
                ${crearSelectJugadores('jugador1')}
                ${crearSelectJugadores('jugador2')}
                ${crearSelectJugadores('jugador3')}
            </div>
            <div class="jugador-row">
                <h3>Equipo 2</h3>
                ${crearSelectJugadores('jugador4')}
                ${crearSelectJugadores('jugador5')}
                ${crearSelectJugadores('jugador6')}
            </div>
            <div class="jugador-row">
                <h3>Puntuación</h3>
                <input type="number" id="puntosEquipo1" placeholder="Puntos Equipo 1">
                <input type="number" id="puntosEquipo2" placeholder="Puntos Equipo 2">
            </div>
        `;
    }
}

function crearSelectJugadores(id) {
    let select = `<select id="${id}">`;
    jugadores.forEach(jugador => {
        select += `<option value="${jugador}">${jugador}</option>`;
    });
    select += `</select>`;
    return select;
}

function registrarPartida() {
    const tipoPartida = document.getElementById('tipoPartida').value;

    const jugadoresEquipo1 = [];
    const jugadoresEquipo2 = [];
    const puntosEquipo1 = parseInt(document.getElementById('puntosEquipo1').value);
    const puntosEquipo2 = parseInt(document.getElementById('puntosEquipo2').value);

    if (tipoPartida === '2v2') {
        for (let i = 1; i <= 2; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            jugadoresEquipo1.push(jugador);
        }
        for (let i = 3; i <= 4; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            jugadoresEquipo2.push(jugador);
        }
    } else if (tipoPartida === '3v3') {
        for (let i = 1; i <= 3; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            jugadoresEquipo1.push(jugador);
        }
        for (let i = 4; i <= 6; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            jugadoresEquipo2.push(jugador);
        }
    }

    if (isNaN(puntosEquipo1) || isNaN(puntosEquipo2)) {
        alert('Por favor, ingresa los puntos de ambos equipos.');
        return;
    }

    jugadoresEquipo1.forEach(jugador => {
        actualizarParticipante(jugador, puntosEquipo1, puntosEquipo1 > puntosEquipo2);
    });
    jugadoresEquipo2.forEach(jugador => {
        actualizarParticipante(jugador, puntosEquipo2, puntosEquipo2 > puntosEquipo1);
    });

    actualizarTabla();
    limpiarCampos();
}

function actualizarParticipante(jugador, puntos, esGanador) {
    if (!participantes[jugador]) {
        participantes[jugador] = { puntos: 0, partidas: 0, ganadas: 0, perdidas: 0 };
    }

    participantes[jugador].puntos += puntos;
    participantes[jugador].partidas += 1;
    if (esGanador) {
        participantes[jugador].ganadas += 1;
    } else {
        participantes[jugador].perdidas += 1;
    }
}

function actualizarTabla() {
    const tbody = document.querySelector('#tablaGeneral tbody');
    tbody.innerHTML = '';

    Object.keys(participantes).forEach(jugador => {
        const { puntos, partidas, ganadas, perdidas } = participantes[jugador];
        const promedio = (puntos / partidas).toFixed(2);

        const fila = `<tr>
            <td>${jugador}</td>
            <td>${puntos}</td>
            <td>${partidas}</td>
            <td>${promedio}</td>
            <td>${ganadas}</td>
            <td>${perdidas}</td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

function limpiarCampos() {
    const tipoPartida = document.getElementById('tipoPartida').value;
    const numJugadores = tipoPartida === '2v2' ? 4 : 6;

    for (let i = 1; i <= numJugadores; i++) {
        document.getElementById(`jugador${i}`).value = '';
    }
    document.getElementById('puntosEquipo1').value = '';
    document.getElementById('puntosEquipo2').value = '';
}

function agregarJugador() {
    const nuevoJugador = document.getElementById('nuevoJugador').value.trim();
    if (nuevoJugador && !jugadores.includes(nuevoJugador)) {
        jugadores.push(nuevoJugador);
        actualizarSelectJugadores();
        document.getElementById('nuevoJugador').value = '';
    } else {
        alert('Por favor, ingresa un nombre válido que no esté registrado.');
    }
}

function eliminarJugador() {
    const jugadorSeleccionado = document.getElementById('jugadoresRegistrados').value;
    const index = jugadores.indexOf(jugadorSeleccionado);
    if (index !== -1) {
        jugadores.splice(index, 1);
        actualizarSelectJugadores();
    }
}

function actualizarSelectJugadores() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = '';
        jugadores.forEach(jugador => {
            const option = document.createElement('option');
            option.value = jugador;
            option.textContent = jugador;
            if (jugador === selectedValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });

    const jugadoresRegistrados = document.getElementById('jugadoresRegistrados');
    jugadoresRegistrados.innerHTML = '';
    jugadores.forEach(jugador => {
        const option = document.createElement('option');
        option.value = jugador;
        option.textContent = jugador;
        jugadoresRegistrados.appendChild(option);
    });
}

// Inicializar el formulario y la lista de jugadores
cambiarFormulario();
actualizarSelectJugadores();