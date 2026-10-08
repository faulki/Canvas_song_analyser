import { createGUI } from "./gui"

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!

const parameters = {
  pointerDamping: 0.01
}

export type Parameters = typeof parameters

let frameRequest: number | undefined
let time: number
let delta: number
let elapsed: number = 0
let pointerX : number = 0
let pointerY : number = 0
let easedpointerX : number = 0
let easedpointerY : number = 0

addEventListener('resize', resize)
addEventListener('pointermove', onPointerMove, { passive : true })

createGUI(parameters)
resize()
play()

function onPointerMove(event: PointerEvent) {
  pointerX = event.clientX
  pointerY = event.clientY
}

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function render() {
  const currentTime = Date.now()
  delta = currentTime - time
  time = currentTime
  elapsed += delta

  easedpointerX += (pointerX - easedpointerX) * Math.min(1, delta * parameters.pointerDamping)
  easedpointerY += (pointerY - easedpointerY) * Math.min(1, delta * parameters.pointerDamping)

  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#000'
  // context.fillRect(elapsed % canvas.width, 0, 100, 100)
  context.fillRect(easedpointerX - 50, easedpointerY - 50, 100, 100)
}

function tick() {
  frameRequest = requestAnimationFrame(tick)
  render()
}

function play() {
  if(!frameRequest) {
    time = Date.now()
    tick()
  }
}

function pause() {
  frameRequest && cancelAnimationFrame(frameRequest)
  frameRequest = undefined
}

tick()

function draw() {
  context!.fillRect(window.innerWidth/2 - 50, window.innerHeight/2 - 50, 50, 50);
}

draw()