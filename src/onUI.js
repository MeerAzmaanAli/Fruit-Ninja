import { botscore } from "./bot.js";
import { isMultiPlayer, spectateButton } from './game.js';
import { Playerscore } from "./player.js";

export const body = document.getElementById('body');
export const gameOverMessage = document.getElementById('gameOverMessage');
export const livesImg = document.getElementById('lives');
export const scoreText = document.getElementById('scoreText');
export const BotscoreText = document.getElementById('BotscoreText');
export const menu = document.getElementById('menu');
export const winnerText = document.getElementById('winner');
export const scoreDisplay = document.getElementById('scoreDisplay');
export const hint = document.getElementById('hint');

export class UI{


    onSinglePlayer(){
        BotscoreText.style.display='none';
        spectateButton.style.display='none';
    }
    onMultiplayer(){

        spectateButton.style.display='flex';
        BotscoreText.style.display='inline';
        winnerText.style.display = 'inline';
        winnerText.style.display = 'none';  

    }
    onGameover(){
        scoreDisplay.textContent = `Score: ${Playerscore}`;
        menu.style.display = 'flex';
        gameOverMessage.style.display = 'block';
        scoreText.textContent=`Score: ${Playerscore}`;
        body.style.backgroundImage='url(BG.png)'
        body.style.backgroundColor='none';
        winnerText.style.display='inline';
        

    }
    onBotGameover(){
        scoreDisplay.textContent = `Score: ${Playerscore}`;
        BotscoreText.textContent=`Opponents Score: ${botscore}`;
    }

    onGameStart(){
        menu.style.display = 'none';
        gameOverMessage.style.display = 'none';
        scoreDisplay.style.display='inline';
        livesImg.style.display='flex';
        body.style.backgroundImage='none';
        body.style.backgroundColor='black';
        scoreDisplay.textContent = `Score: ${Playerscore}`;
        hint.style.display='none';
    }
}