import { Bot, botscore } from "./bot.js";
import { Player, Playerscore } from "./player.js";
import { body, BotscoreText, scoreDisplay, UI, winnerText } from "./onUI.js";

export const Playercanvas = document.getElementById('gameCanvas');
export const playerCtx =Playercanvas.getContext('2d');

export const botCanvas = document.getElementById('bot-canvas');
export const botCtx =botCanvas.getContext('2d');

Playercanvas.width =(window.innerWidth-100);
Playercanvas.height = (window.innerHeight-50);
botCanvas.width =(window.innerWidth-100);
botCanvas.height = window.innerHeight-50;

//ui Elements
const SinglePlayerBtn = document.getElementById('singlePlayer');
const MultiPlayerBtn = document.getElementById('multiPlayer');
const x1 = document.getElementById('x1');
const x2 = document.getElementById('x2');
const x3 = document.getElementById('x3');
const muteButton = document.getElementById('mute');
export const spectateButton = document.getElementById('spectate-button');
const fullscreenBtn = document.getElementById('fullscreen');

//sounds
const boom = document.getElementById('boom');
const spliced = document.getElementById('spliced');
const missed = document.getElementById('missed');
const start = document.getElementById('start');
const over = document.getElementById('over');

const backgroundImage = new Image();
backgroundImage.src = 'BG.png';

backgroundImage.addEventListener('selectstart', function(event) {
    event.preventDefault(); // Prevent selection in some browsers
});

export const splash = new Image();
splash.src = 'public/splash.png';
splash.opacity=0.5;

export let fxList = [];
let PlayergameInterval;
let BotgameInterval;
let updategame;
let animationFrameId;
let lastMousePosition = { x: 0, y: 0 };
let touchStart;
let touchEnd;
let isTouchStarted=false;

let isMouseDown = true;
let isStarted = false;
export let isSpectating = false;
export let isMultiPlayer = false;
export let botgameisOver = false;
let isMuted = false; 


const bot = new Bot(500, 5); // initializig bot
const player = new Player(spliced);
const ui = new UI();

const maxTrailLength = 20; // Number of trail segments
const trail = [];

    
fullscreenBtn.addEventListener('click', () => { 
    enterFullscreen();
    fullscreenBtn.style.display='none';
})

function update() { //update at each frame
    
    player.updateAndDrawFruits(backgroundImage);
    if(isMultiPlayer){
        bot.updateAndDrawFruits(backgroundImage);
    }
    
    
}


function updateGame() {
    update();
    fxList.forEach((fx, index) => {
        fx.draw(playerCtx);
        if (fx.isFinished()) {
            fxList.splice(index, 1); 
        }
    });
    trail.forEach((t,index)=>{
        t.drawTrail(playerCtx);
        if (t.isFinished()) {
            trail.splice(index, 1); 
        }
    });
    if(isMultiPlayer){
        bot.update();
    }
    
    
    if(isSpectating){
        scoreDisplay.textContent=`Score: ${botscore}`;
        body.style.backgroundColor='#a01b00';
        

    
    }else{
        scoreDisplay.textContent=`Score: ${Playerscore}`;
        body.style.backgroundColor='black';

    }
        
}

//mouse events
/*Playercanvas.addEventListener('mousedown', (event) => {
   isMouseDown = true;
    lastMousePosition = { x: event.clientX, y: event.clientY };
});
Playercanvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});*/
Playercanvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const currentMousePosition = { x: event.clientX, y: event.clientY };
        trail.push(new SlashFX(lastMousePosition.x,lastMousePosition.y,currentMousePosition.x,currentMousePosition.y));
        if(isStarted){player.handleSlice(currentMousePosition.x, currentMousePosition.y,lastMousePosition.x , lastMousePosition.y);}
        lastMousePosition = currentMousePosition;
        
    }
});


Playercanvas.addEventListener('touchstart', (event) => {
    
    touchStart = event.touches[0];
    isTouchStarted=true;

});
Playercanvas.addEventListener('touchmove', (event) => {
    if(isTouchStarted){
        const touchNew = event.touches[0];
        if(isStarted){
            player.handleSlice(touchStart.pageX, touchStart.pageY,touchNew.pageX , touchNew.pageY);
        }
        
    }
});
Playercanvas.addEventListener('touchend', (event) => {
    isTouchStarted=false
});

// starting game
SinglePlayerBtn.addEventListener('click', function(){
    singlePlayerGame();
    
});
MultiPlayerBtn.addEventListener('click', function(){
    multiPlayerGame();
    
});

function singlePlayerGame() {
    isMultiPlayer=false;
    if (!isStarted) {
        setCanvas();
        start.currentTime = 0;
        start.play();
        isMultiPlayer=false;
        clearInterval(PlayergameInterval);
        clearInterval(BotgameInterval);
        ui.onGameStart();
        ui.onSinglePlayer();
        enterFullscreen();
        resetLives();
        player.reset();
        bot.reset();
        Playercanvas.style.display = 'inline';
        Playercanvas.style.cursor='none';
        PlayergameInterval = setInterval(player.spawnFruit, Random(400,600));//spawing in every 1.5sec
        BotgameInterval = setInterval(bot.spawnFruit, Random(400,600));//spawing in every 1.5sec
        isSpectating=false;
        updategame = setInterval(updateGame,16);
        fullscreenBtn.style.display='none';
        isStarted=true;
}
}
function multiPlayerGame() {
    isMultiPlayer=true;
    if (!isStarted) {
        setCanvas();
        start.currentTime = 0;
        start.play();
        clearInterval(PlayergameInterval);
        clearInterval(BotgameInterval)
        enterFullscreen();
        ui.onGameStart();
        ui.onMultiplayer();
        player.reset();
        bot.reset();
        resetLives();
        Playercanvas.style.display = 'inline';
        botCanvas.style.display = 'none';
        Playercanvas.style.cursor='none';
        PlayergameInterval = setInterval(player.spawnFruit, Random(400,600));//spawing in every 1.5sec
        BotgameInterval = setInterval(bot.spawnFruit,  Random(400,600));
        isSpectating=false;
        updategame = setInterval(updateGame,16);
        fullscreenBtn.style.display='none';
        isStarted = true;
}
}

export function gameOver(){ // if players game is over
    over.currentTime = 0;
    over.play();
    clearInterval(PlayergameInterval);
    clearInterval(BotgameInterval);
    clearInterval(updategame);
    cancelAnimationFrame(animationFrameId); 
    isStarted = false;
    ui.onGameover();
    playerCtx.clearRect(0, 0, Playercanvas.width, Playercanvas.height);
    Playercanvas.style.cursor='auto';
    if(isMultiPlayer){
        BotscoreText.textContent=` opponents Score: ${botscore}`;
        if(Playerscore>botscore){

        winnerText.textContent='You win';
        }else if(Playerscore<botscore)
        {
        winnerText.textContent='Opponent wins';
        }else{
            winnerText.textContent='Its a tie';
        }
    }else{
        BotscoreText.textContent=" ";
        winnerText.textContent=" ";

    }
    isMultiPlayer=false;
    isStarted = false;
    
}
export function botgameOver(){ // if bots game is over
    clearInterval(BotgameInterval);
    ui.onBotGameover();
    botCtx.clearRect(0, 0, botCanvas.width, botCanvas.height);
    botgameisOver = true;

    
}

function resetLives(){
    x1.style.backgroundImage='url(public/x1.png)';
    x2.style.backgroundImage='url(public/x2.png)';
    x3.style.backgroundImage='url(public/x3.png)';
}

export class SlashFX { // Drawing fx
    
    constructor(x1, y1, x2, y2,fx,fy) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.fx =fx;
        this.fy=fy
        this.opacity = 1.0; 
        this.fadeSpeed = 0.1;
        this.lineWidth = 10; 
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = 'rgba(40,16,9,0.7)'; 
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.restore();

        
        this.opacity -= this.fadeSpeed/1000;
        this.lineWidth -= 0.5;
         //drawing splash
         ctx.drawImage(splash, this.fx, this.fy,100,100 );

    }
    drawTrail(){
        playerCtx.save();
        playerCtx.globalAlpha = this.opacity;
        playerCtx.strokeStyle = 'rgba(40,16,9,0.7)'; 
        playerCtx.lineWidth = this.lineWidth;
        playerCtx.lineCap = 'round';
        playerCtx.beginPath();
        playerCtx.moveTo(this.x1, this.y1);
        playerCtx.lineTo(this.x2, this.y2);
        playerCtx.stroke();
        playerCtx.restore();

        
        this.opacity -= this.fadeSpeed/1000;
        this.lineWidth -= 0.5;
    }

    isFinished() {
        return this.opacity <= 0 || this.lineWidth <= 0;
    }
}
export function pointToLineDistance(px, py, x1, y1, x2, y2) { // drag functionality
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

spectateButton.addEventListener('click', () => { // spactate button
    isSpectating = !isSpectating;
    if (isSpectating) {
        Playercanvas.style.display = 'none';
        botCanvas.style.display = 'inline';
        spectateButton.textContent = 'Return to Game';
    } else {
        Playercanvas.style.display = 'inline';
        botCanvas.style.display = 'none';
        spectateButton.textContent = 'Spectate';
    }
});
muteButton.addEventListener('click', toggleMute);

function toggleMute() {
    isMuted = !isMuted;  // Toggle the mute state

    if (isMuted) {
        // Mute all sounds
        spliced.volume = 0;
        boom.volume=0;
        missed.volume=0;
        start.volume=0;
        over.volume=0;
        muteButton.style.backgroundImage='url(public/mute.png';
    } else {
        // Unmute all sounds
        spliced.volume = 1;
        boom.volume=1;
        missed.volume=1;
        start.volume=1;
        over.volume=1;  // Set volume back to normal
        muteButton.style.backgroundImage='url(public/unmute.png';

    }}
    function enterFullscreen() {
        let elem = document.documentElement; // This targets the entire document (web page)
    
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }
    function setCanvas(){
    Playercanvas.width =(window.innerWidth-50);
    Playercanvas.height = (window.innerHeight-50);
    botCanvas.width =(window.innerWidth-50);
    botCanvas.height = window.innerHeight-50;
    }   
    function Random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function drawTrail(x, y) {
        Touchtrail.push({ x, y });
        if (trail.length > maxTrailLength) {
            trail.shift();
        }
        playerCtx.beginPath();
        
    }
        
    
    
    