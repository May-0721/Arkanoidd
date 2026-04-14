const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const $sprite = document.querySelector('#sprite')
const $ladrillos = document.querySelector('#ladrillos')

canvas.width = 448
canvas.height = 400

//variables del juego
let contador=0

//variables del juego
const radioPelota=4

//posicion de la pelota
let x = canvas.width / 2
let y = canvas.height -30

//velocidad de la pelota
let dx = -3
let dy = -3

//variables del palito
const alturaPalo = 10
const anchoPalo = 50
const SENSIBILIDAD_PALETA = 8

let paloX = (canvas.width - anchoPalo) / 2
let paloY = canvas.height - alturaPalo - 10

let presionadoDerecha = false
let presionadoIzquierda = false



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
function dibujarLadrillos(){}

function deteccionColision(){}
function movimientoPelota(){
    //rebotar en pelota en laterales
    if(x + dx > canvas.width - radioPelota || x + dx < radioPelota){
        dx = -dx
    }

    //rebotar pelota arriba

    if(y + dy < radioPelota){
        dy= -dy
    }

    //cuando la pelota toca el palo
    const pelotaEsIgualPalitoX = x > paloX && x < paloX + anchoPalo
    const pelotaTocaPalo = y + dy > paloY

    //rebota pelota abajo

    if (pelotaEsIgualPalitoX && pelotaTocaPalo){
        dy = -dy 
    }else if (y + dy > canvas.height - radioPelota){

        /*console.log('Game Over')
        document.location.reload()*/
    }

    

    x += dx
    y += dy
}

function limpiarCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function iniciarEventos(){
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event){
        const{key} =event
        if(key === 'Right' || key === 'ArrowRight'){
            presionadoDerecha = true
        }else if (key === 'Left' || key === 'ArrowLeft'){
            presionadoIzquierda = true
    }
}

function keyUpHandler(event){
        const{key} =event
        if(key === 'Right' || key === 'ArrowRight'){
            presionadoDerecha = false
        }else if (key === 'Left' || key === 'ArrowLeft'){
            presionadoIzquierda = false
    }
}

}

function movimientoPalo(){
    if(presionadoDerecha && paloX < canvas.width - anchoPalo){
        paloX += SENSIBILIDAD_PALETA
    }else if (presionadoIzquierda && paloX > 0 ){
        paloX -= SENSIBILIDAD_PALETA
    }
}


function dibujar(){
    limpiarCanvas()
    //dibujamos elementos
    dibujarPelota()
    dibujarPalo()
    dibujarLadrillos()

    //colisiones y movimientos
    deteccionColision()
    movimientoPelota()
    movimientoPalo()

    window.requestAnimationFrame(dibujar)



}

dibujar()
iniciarEventos()
