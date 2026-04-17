// canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const $sprite = document.querySelector('#sprite')
const $ladrillos = document.querySelector('#ladrillos')

canvas.width = 448
canvas.height = 400

// 🎮 estado del juego
let jugando = false
let vidas = 3
let nivel = 1
let contador = 0

// pelota
const radioPelota = 4
let x = canvas.width / 2
let y = canvas.height - 30
let dx = -4
let dy = -4

// paleta
const alturaPalo = 10
const anchoPalo = 50
const SENSIBILIDAD_PALETA = 8

let paloX = (canvas.width - anchoPalo) / 2
let paloY = canvas.height - alturaPalo - 10

let presionadoDerecha = false
let presionadoIzquierda = false

// ladrillos
const conteoFilaLadrillos = 6
const conteoColumnaLadrillos = 13
const anchoLadrillo = 30
const alturaLadrillo = 14
const paddingLadrillos = 2
const ladrilloOffsetTop = 80
const ladrilloOffsetLeft = 16

const ESTATUS_LADRILLO = { ACTIVO: 1, DESTRUIDO: 0 }

const ladrillos = []

function crearLadrillos() {
    for (let c = 0; c < conteoColumnaLadrillos; c++){
        ladrillos[c] = []
        for (let r = 0; r < conteoFilaLadrillos; r++){
            const x = c * (anchoLadrillo + paddingLadrillos) + ladrilloOffsetLeft
            const y = r * (alturaLadrillo + paddingLadrillos) + ladrilloOffsetTop

            const random = Math.floor(Math.random() * 8)

            ladrillos[c][r] = {
                x, y,
                status: ESTATUS_LADRILLO.ACTIVO,
                color: random
            }
        }
    }
}

// 🎨 dibujo
function dibujarPelota(){
    ctx.beginPath()
    ctx.arc(x , y, radioPelota, 0, Math.PI * 2)
    ctx.fillStyle = '#FFF'
    ctx.fill()
    ctx.closePath()
}

function dibujarPalo(){
    ctx.drawImage($sprite, 29, 174, anchoPalo, alturaPalo, paloX, paloY, anchoPalo, alturaPalo)
}

function dibujarLadrillos(){
    for (let c = 0; c < conteoColumnaLadrillos; c++){
        for (let r = 0; r < conteoFilaLadrillos; r++){
            const b = ladrillos[c][r]
            if (b.status === ESTATUS_LADRILLO.DESTRUIDO) continue

            const clipX = b.color * 32

            ctx.drawImage($ladrillos, clipX, 0, 32, 5, b.x, b.y, anchoLadrillo, alturaLadrillo)
        }
    }
}

function dibujarVidas(){
    ctx.fillStyle = "#FFF"
    ctx.font = "16px Arial"
    ctx.fillText("Vidas: " + vidas, 10, 20)
}

// 💥 colisiones
function deteccionColision(){
    for (let c = 0; c < conteoColumnaLadrillos; c++){
        for (let r = 0; r < conteoFilaLadrillos; r++){
            const b = ladrillos[c][r]
            if (b.status === ESTATUS_LADRILLO.DESTRUIDO) continue

            if (
                x > b.x &&
                x < b.x + anchoLadrillo &&
                y > b.y &&
                y < b.y + alturaLadrillo
            ){
                dy = -dy
                b.status = ESTATUS_LADRILLO.DESTRUIDO
                contador++
            }
        }
    }
}

// movimiento
function movimientoPelota(){
    if(x + dx > canvas.width - radioPelota || x + dx < radioPelota){
        dx = -dx
    }

    if(y + dy < radioPelota){
        dy = -dy
    }

    const golpeaPalo = x > paloX && x < paloX + anchoPalo && y + dy > paloY

    if (golpeaPalo){
        dy = -dy
    } 
    else if (y + dy > canvas.height - radioPelota){
        vidas--

        if (vidas <= 0){
            mostrarGameOver()
        } else {
            x = canvas.width / 2
            y = canvas.height - 30
            dx = -4
            dy = -4
        }
    }

    x += dx
    y += dy
}

function movimientoPalo(){
    if(presionadoDerecha && paloX < canvas.width - anchoPalo){
        paloX += SENSIBILIDAD_PALETA
    } else if (presionadoIzquierda && paloX > 0){
        paloX -= SENSIBILIDAD_PALETA
    }
}

// 🧠 niveles
function siguienteNivel(){
    nivel++
    contador = 0

    for (let c = 0; c < conteoColumnaLadrillos; c++){
        for (let r = 0; r < conteoFilaLadrillos; r++){

            if(nivel === 2){
                ladrillos[c][r].status = (r % 2 === 0)
                    ? ESTATUS_LADRILLO.ACTIVO
                    : ESTATUS_LADRILLO.DESTRUIDO
            } else {
                ladrillos[c][r].status = ESTATUS_LADRILLO.ACTIVO
            }
        }
    }
}

// 🎮 loop
function dibujar(){
    ctx.clearRect(0,0,canvas.width,canvas.height)

    if (jugando){
        dibujarPelota()
        dibujarPalo()
        dibujarLadrillos()
        dibujarVidas()

        deteccionColision()
        movimientoPelota()
        movimientoPalo()

        if (contador === conteoFilaLadrillos * conteoColumnaLadrillos){
            siguienteNivel()
        }
    }

    requestAnimationFrame(dibujar)
}

// 🎮 control
function iniciarJuego(){
    document.getElementById("menu").style.display = "none"
    document.getElementById("gameOver").style.display = "none"

    vidas = 3
    nivel = 1
    contador = 0

    x = canvas.width / 2
    y = canvas.height - 30

    crearLadrillos()

    jugando = true
}

function mostrarGameOver(){
    jugando = false
    document.getElementById("gameOver").style.display = "block"
}

function volverMenu(){
    document.getElementById("gameOver").style.display = "none"
    document.getElementById("menu").style.display = "block"
}

// controles
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') presionadoDerecha = true
    if (e.key === 'ArrowLeft') presionadoIzquierda = true
})

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowRight') presionadoDerecha = false
    if (e.key === 'ArrowLeft') presionadoIzquierda = false
})

// iniciar loop SIEMPRE
dibujar()


