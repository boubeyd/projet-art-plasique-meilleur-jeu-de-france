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
const menuMusic = new Audio("assets/menu_music.mp3")
menuMusic.loop = true
menuMusic.volume = 0.5

const musics = [
new Audio("assets/music1.mp3"),
new Audio("assets/music2.mp3"),
new Audio("assets/music3.mp3")
]

musics.forEach(m=>{
m.loop=true
m.volume=0.5
})

function playLevelMusic(){
musics.forEach(m=>m.pause())
musics[level].currentTime=0
musics[level].play()
}

// ==============================
// PLAYER
// ==============================
let player={
x:100,
y:200,
w:32,
h:48,
vx:0,
vy:0,
speed:4,
jump:-12,
onGround:false,
dir:1,
state:"idle"
}

const gravity=0.5
let keys={}

// ==============================
// CAMERA AUTO
// ==============================
let cameraX=0
let cameraSpeed=1.4

// ==============================
// NIVEAU
// ==============================
let level=0

let platforms=[]
let door={x:0,y:300,w:40,h:80}

// ==============================
// GENERATION NIVEAU
// ==============================
function generateLevel(){

platforms=[]

let length = 2500 + level*800
let x=0

// sol
platforms.push({x:0,y:380,w:length,h:20})

for(let i=0;i<40 + level*20;i++){

x += 120 + Math.random()*150

let y = 200 + Math.random()*150

platforms.push({
x:x,
y:y,
w:100,
h:20
})

}

door.x = length-100
door.y = 300

}

// ==============================
// RESET LEVEL
// ==============================
function resetLevel(){

player.x=cameraX+120
player.y=200
player.vy=0

}

// ==============================
// INPUT
// ==============================
document.addEventListener("keydown",e=>{
keys[e.key.toLowerCase()]=true
})

document.addEventListener("keyup",e=>{
keys[e.key.toLowerCase()]=false
})

// ==============================
// UPDATE
// ==============================
function update(){

cameraX += cameraSpeed

player.vx=0

if(keys["q"]){
player.vx=-player.speed
player.dir=-1
}

if(keys["d"]){
player.vx=player.speed
player.dir=1
}

if(keys[" "] && player.onGround){
player.vy=player.jump
player.onGround=false
}

player.vy += gravity

player.x += player.vx
player.y += player.vy

player.onGround=false

platforms.forEach(p=>{

if(
player.x < p.x+p.w &&
player.x+player.w > p.x &&
player.y+player.h <= p.y+10 &&
player.y+player.h+player.vy >= p.y
){

player.y=p.y-player.h
player.vy=0
player.onGround=true

}

})

// état joueur
if(!player.onGround) player.state="jump"
else if(player.vx!=0) player.state="run"
else player.state="idle"

// mort
if(player.y>600){
resetLevel()
}

// porte
if(
player.x < door.x+door.w &&
player.x+player.w > door.x &&
player.y < door.y+door.h &&
player.y+player.h > door.y
){

level++

if(level>2){
level=0
}

cameraX=0

generateLevel()
resetLevel()
playLevelMusic()

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
platforms.forEach(p=>{
ctx.drawImage(platformImg,p.x,p.y,p.w,p.h)
})

// porte
ctx.fillStyle="purple"
ctx.fillRect(door.x,door.y,door.w,door.h)

// joueur
let img=playerIdle

if(player.state=="run") img=playerRun
if(player.state=="jump") img=playerJump

ctx.save()

ctx.scale(player.dir,1)

ctx.drawImage(
img,
player.dir==1?player.x:-player.x-player.w,
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
// START GAME
// ==============================
playBtn.onclick=()=>{

menu.style.display="none"
canvas.style.display="block"

menuMusic.pause()

generateLevel()

playLevelMusic()

loop()

}

// musique menu
playBtn.onclick = () => {

menu.style.display="none"
canvas.style.display="block"

menuMusic.pause()

generateLevel()

playLevelMusic()

menuMusic.muted=false

loop()

}