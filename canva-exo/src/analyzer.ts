import { createGUI } from './gui'

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!
const audioElement = document.querySelector('audio')!
const fileInput = document.querySelector('input')!

let audioContext: AudioContext
let analyser: AnalyserNode
let frequences: Uint8Array<ArrayBuffer>
const offsetFrequences = 43
const seuilBasses = 190

export type Parameters = {
  steps: number
  flou: number
  glow: number
  couleurCercle: string
  opaciteFond: number
  modeFusion: GlobalCompositeOperation
  couleurParticules: string
}

const parameters: Parameters = {
  steps: 40,
  flou: 4,
  glow: 30,
  couleurCercle: '#ffffff',
  opaciteFond: 100,
  modeFusion: 'source-over',
  couleurParticules: '#ffffff',
}

type Particule = {
  x: number
  y: number
  vx: number
  vy: number
  taille: number
}
let particules: Particule[] = []

createGUI(parameters)

addEventListener('resize', resize)
resize()
tick()

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0]
  if (!file) return
  audioElement.src = URL.createObjectURL(file)
  audioElement.play()
})

audioElement.addEventListener('play', async () => {
  audioContext || createContext()
  await audioContext.resume()
})

function createContext() {
  audioContext = new AudioContext()

  const mediaSourceNode = audioContext.createMediaElementSource(audioElement)
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 2048
  frequences = new Uint8Array(analyser.frequencyBinCount)

  mediaSourceNode.connect(analyser)
  mediaSourceNode.connect(audioContext.destination)
}

function volumeBasses() {
  let total = 0
  for (let i = 2; i < 6; i++) {
    total += frequences[i]
  }
  return total / 5
}

function volumeAigus() {
  let total = 0
  for (let i = 43; i < 173; i++) {
    total += frequences[i]
  }
  return total / 131
}

function createCircle() {
  const steps = parameters.steps
  const centreX = canvas.width / 2
  const centreY = canvas.height / 2

  const rayons: number[] = []
  for (let i = 0; i <= steps; i++) {
    rayons.push(frequences[offsetFrequences + i])
  }

  context.save()
  context.shadowColor = parameters.couleurCercle
  context.shadowBlur = parameters.glow
  context.globalCompositeOperation = parameters.modeFusion
  context.filter = `blur(${parameters.flou}px)`
  context.beginPath()

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI
    const x = centreX + rayons[i] * Math.cos(angle)
    const y = centreY + rayons[i] * Math.sin(angle)
    if (i === 0) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  }

  for (let i = steps - 1; i > 0; i--) {
    const angle = (i / steps) * Math.PI
    const x = centreX + rayons[i] * Math.cos(angle)
    const y = centreY - rayons[i] * Math.sin(angle)
    context.lineTo(x, y)
  }

  context.closePath()
  context.fillStyle = parameters.couleurCercle
  context.fill()
  context.strokeStyle = parameters.couleurCercle
  context.lineWidth = 4
  context.stroke()
  context.restore()
}

function createParticles(nombre: number) {
  for (let i = 0; i < nombre; i++) {
    const angle = Math.random() * Math.PI * 2
    const vitesse = 3 + Math.random() * 5
    particules.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: Math.cos(angle) * vitesse,
      vy: Math.sin(angle) * vitesse,
      taille: 4 + Math.random() * 8,
    })
  }
}

function drawParticles() {
  context.fillStyle = parameters.couleurParticules
  for (const p of particules) {
    p.x += p.vx
    p.y += p.vy
    context.fillRect(p.x - p.taille / 2, p.y - p.taille / 2, p.taille, p.taille)
  }

  particules = particules.filter(
    (p) => p.x > 0 && p.x < canvas.width && p.y > 0 && p.y < canvas.height,
  )
}

function render() {
  context.fillStyle = `rgb(0, 0, 0, ${parameters.opaciteFond}%)`
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (audioContext) {
    analyser.getByteFrequencyData(frequences)
    createCircle()

    if (!audioElement.paused && volumeBasses() > seuilBasses) {
      createParticles(5)
    }
  }

  drawParticles()
}

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function tick() {
  requestAnimationFrame(tick)
  render()
}