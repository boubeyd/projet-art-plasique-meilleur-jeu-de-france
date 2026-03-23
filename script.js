// ==============================
// CANVAS
// ==============================
const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

// ==============================
// MENU
// ==============================
const menu = document.getElementById("menu")
const playBtn = document.getElementById("playBtn")

// ==============================
// IMAGES
// ==============================
const playerIdle = new Image()
playerIdle.src = "assets/player_idle.png"

const playerRun = new Image()
playerRun.src = "assets/player_run.png"

const playerJump = new Image()
playerJump.src = "assets/player_jump.png"

const platformImg = new Image()
platformImg.src = "assets/platform.png"

const bgImg = new Image()
bgImg.src = "assets/bg.png"

// ==============================
// MUSIQUES
// ==============================
const musics = [
  new Audio("assets/music1.mp3"),
  new Audio("assets/music2.mp3"),
  new Audio("assets/music3.mp3")
]

musics.forEach(m => {
  m.loop = true
  m.volume = 0.5
})

function playMusic(level){
  musics.forEach(m=>m.pause())
  musics[level].currentTime = 0
  musics[level].play()
}

// ==============================
// PLAYER
// ==============================
let player = {
  x: 100,
  y: 200,
  w: 32,
  h: 48,
  vx: 0,
  vy: 0,
  speed: 4,
  jump: -12,
  onGround:false,
  dir:1,
  state:"idle"
}

const gravity = 0.5
let keys = {}


// ==============================
// CAMERA AUTO SCROLL
// ==============================
let cameraX = 0
let cameraSpeed = 1.2


// ==============================
// NIVEAUX
// ==============================
let level = 0

const levels = [

{
door:{x:2200,y:300,w:40,h:80},
platforms:[
{x:0,y:380,w:2500,h:20},

{x:200,y:320,w:120,h:20},
{x:400,y:280,w:120,h:20},
{x:600,y:240,w:120,h:20},
{x:800,y:280,w:120,h:20},
{x:1000,y:250,w:120,h:20},
{x:1200,y:210,w:120,h:20},
{x:1400,y:280,w:120,h:20},
{x:1600,y:240,w:120,h:20},
{x:1800,y:210,w:120,h:20},
{x:2000,y:260,w:120,h:20}
]
},

{
door:{x:2600,y:300,w:40,h:80},
platforms:[
{x:0,y:380,w:3000,h:20},

{x:250,y:300,w:100,h:20},
{x:450,y:260,w:100,h:20},
{x:650,y:220,w:100,h:20},
{x:850,y:260,w:100,h:20},
{x:1050,y:220,w:100,h:20},
{x:1250,y:260,w:100,h:20},
{x:1450,y:220,w:100,h:20},
{x:1650,y:260,w:100,h:20},
{x:1850,y:220,w:100,h:20},
{x:2050,y:260,w:100,h:20},
{x:2250,y:220,w:100,h:20}
]
},

{
door:{x:3000,y:300,w:40,h:80},
platforms:[
{x:0,y:380,w:3400,h:20},

{x:200,y:300,w:90,h:20},
{x:400,y:250,w:90,h:20},
{x:600,y:200,w:90,h:20},
{x:800,y:250,w:90,h:20},
{x:1000,y:200,w:90,h:20},
{x:1200,y:250,w:90,h:20},
{x:1400,y:200,w:90,h:20},
{x:1600,y:250,w:90,h:20},
{x:1800,y:200,w:90,h:20},
{x:2000,y:250,w:90,h:20},
{x:2200,y:200,w:90,h:20},
{x:2400,y:250,w:90,h:20},
{x:2600,y:200,w:90,h:20},
{x:2800,y:250,w:90,h:20}
]
}

]


// ==============================
// RESET LEVEL
// ==============================
function resetLevel(){

player.x = cameraX + 120
player.y = 200
player.vy = 0

}


// ==============================
// INPUTS
// ==============================
document.addEventListener("keydown",e=>{
keys[e.key.toLowerCase()] = true
})

document.addEventListener("keyup",e=>{
keys[e.key.toLowerCase()] = false
})


// ==============================
// UPDATE
// ==============================
function update(){

cameraX += cameraSpeed

player.vx = 0

if(keys["q"]){
player.vx = -player.speed
player.dir = -1
}

if(keys["d"]){
player.vx = player.speed
player.dir = 1
}

if(keys[" "] && player.onGround){
player.vy = player.jump
player.onGround=false
}

player.vy += gravity
player.x += player.vx
player.y += player.vy


// collision plateformes
player.onGround=false

levels[level].platforms.forEach(p=>{

if(
player.x < p.x + p.w &&
player.x + player.w > p.x &&
player.y + player.h <= p.y + 10 &&
player.y + player.h + player.vy >= p.y
){

player.y = p.y - player.h
player.vy = 0
player.onGround=true

}

})


// état joueur
if(!player.onGround) player.state="jump"
else if(player.vx!=0) player.state="run"
else player.state="idle"


// mort si tombe
if(player.y > 600){
resetLevel()
}


// porte niveau suivant
let door = levels[level].door

if(
player.x < door.x + door.w &&
player.x + player.w > door.x &&
player.y < door.y + door.h &&
player.y + player.h > door.y
){

level++

if(level >= levels.length){
level = 0
}

cameraX = 0
resetLevel()
playMusic(level)

}

}


// ==============================
// DRAW
// ==============================
function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.save()
ctx.translate(-cameraX,0)


// background
ctx.drawImage(bgImg,cameraX,0,canvas.width,canvas.height)


// plateformes
levels[level].platforms.forEach(p=>{
ctx.drawImage(platformImg,p.x,p.y,p.w,p.h)
})


// porte
let door = levels[level].door
ctx.fillStyle="purple"
ctx.fillRect(door.x,door.y,door.w,door.h)


// joueur
let img = playerIdle
if(player.state=="run") img = playerRun
if(player.state=="jump") img = playerJump

ctx.save()

ctx.scale(player.dir,1)

ctx.drawImage(
img,
player.dir==1 ? player.x : -player.x-player.w,
player.y,
player.w,
player.h
)

ctx.restore()

ctx.restore()


// texte niveau
ctx.fillStyle="white"
ctx.font="30px monospace"
ctx.fillText("NIVEAU "+(level+1),20,40)

}


// ==============================
// LOOP
// ==============================
function loop(){

update()
draw()
requestAnimationFrame(loop)

}


// ==============================
// START
// ==============================
playBtn.onclick = ()=>{

menu.style.display="none"
canvas.style.display="block"

playMusic(level)

loop()

}