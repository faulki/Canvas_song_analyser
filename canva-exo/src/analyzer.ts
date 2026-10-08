const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!
const audioElement = document.querySelector('audio')!
const fileInput = document.querySelector('input')!

let audioContext: AudioContext
let analyser: AnalyserNode
let frequences: Uint8Array<ArrayBuffer> 
const steps = 60;

type Particule = {
  x: number
  y: number
  vx: number
  vy: number
  taille: number
}
let particules: Particule[] = []

addEventListener('resize', resize)
resize()
tick()

function createCircle() {
  context.beginPath();
  context.filter = "blur(4px)"
  for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI;
      
      let x = (canvas.width / 2) + (frequences[i+43]) * Math.cos(angle);
      let y = (canvas.height / 2) + (frequences[i+43]) * Math.sin(angle);
      
      if (i === 0) {
          context.moveTo(x, y);
      } else {
          context.lineTo(x, y);
      }
  }
  for (let i = steps; i > 0; i--) {
      const angle = (i / steps) * Math.PI;
      
      let x = (canvas.width / 2) + (frequences[i+43]) * Math.cos(angle);
      let y = (canvas.height / 2) + (frequences[i+43]) * Math.sin(angle);
  
      context.lineTo(x, y);
  }
  
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.lineWidth = 4;
  context.stroke();
  context.filter = "none"
  context.closePath()
}

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
  analyser.getByteFrequencyData(frequences)
  let total = 0
  for (let i = 2; i < 6; i++) {
    total += frequences[i]
  }
  return total / 5
}

function volumeAigus() {
  analyser.getByteFrequencyData(frequences)
  let total = 0
  for (let i = 43; i < 173; i++) {
    total += frequences[i]
  }
  return total / 131
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

function render() {
  context.fillStyle = 'rgb(0, 0, 0)'
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (audioContext && !audioElement.paused && volumeBasses() > 203.8) {
    createParticles(5)
  }

  context.fillStyle = '#fff'
  for (const p of particules) {
    p.x += p.vx
    p.y += p.vy
    context.fillRect(p.x - p.taille / 2, p.y - p.taille / 2, p.taille, p.taille)
  }

  if(audioContext){
    createCircle()
  }

//   if(audioContext){
//     context.beginPath();
//     context.arc(canvas.width / 2, canvas.height / 2, volumeAigus(), 0, 2 * Math.PI);
//     context.fillStyle = "white";
//     context.fill();
//     context.lineWidth = 4;
//     context.strokeStyle = "white";
//     context.stroke();
// }
  

  particules = particules.filter(
    (p) => p.x > 0 && p.x < canvas.width && p.y > 0 && p.y < canvas.height,
  )
}

function resize() { 
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function tick() {
  requestAnimationFrame(tick)
  render()
}