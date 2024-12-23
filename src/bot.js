
import { Fruit, loadedSprites } from './fruit.js';
import { botCanvas, botCtx, botgameOver, fxList, isSpectating, SlashFX, splash } from './game.js';


let fruits = [];
export var botscore=0;
export class Bot {
    constructor(reactionTime, accuracy) {

        this.reactionTime = reactionTime;
        this.accuracy = accuracy;
        this.currentTarget = null;
        this.lives=3;
        this.fxList = fxList;
    }

    update() {
        if (this.currentTarget && this.currentTarget.isSliced) {
            this.currentTarget = null; 
        }

        if (!this.currentTarget) {
            this.findTarget(fruits);
        }

        if (this.currentTarget) {
            this.attemptSlice();
        }
    }

    findTarget() {
        const unslicedFruits = fruits.filter(fruit => !fruit.isSliced);
        if (unslicedFruits.length > 0) {
            this.currentTarget = unslicedFruits[Math.floor(Math.random() * unslicedFruits.length)];
        }
    }

    attemptSlice() {
        setTimeout(() => {
            if ((Math.random()*100) < this.accuracy && this.currentTarget && !this.currentTarget.isSliced) {
                const i = Math.floor(Math.random() * 20)
                if(i>19){
                    if(this.currentTarget.spriteindex==0 || this.currentTarget.spriteindex==7){
                        this.currentTarget.slice();
                        botgameOver();
                    }
                }else{
                    if(this.currentTarget.spriteindex!=0 && this.currentTarget.spriteindex!=7 ){
                        this.currentTarget.slice();
                        botscore+=10;
                        this.currentTarget.isSliced=true;
                        BotscoreText.textContent=`Score: ${botscore}`;
                        if(isSpectating){
                            this.fxList.push(new SlashFX(this.currentTarget.x, this.currentTarget.y,this.currentTarget.x+100,this.currentTarget.y+100));
                        }    
                    }
                }
                
                
            }
            this.currentTarget = null;
        }, this.reactionTime);
    }
    spawnFruit() {
        
        const side = Math.floor(Math.random() * 2);
        let x, y, initialVelocityX, initialVelocityY,sprite;
        let spriteindex= Math.floor(Math.random() * loadedSprites.length);
        let rad;
        let a;
        let b;
        
        if(window.innerWidth>950){
            rad=60;
            a=12;
            b=11;
        }else{
            rad=40;
            a=8;
            b=7;
        }
    
        if (side === 0) {
    
            x = Math.random() * botCanvas.width;
            y = botCanvas.height-100; 
            initialVelocityX = Math.floor(Math.random() * (5 + 4 + 1)) - 4
            initialVelocityY =  -(Math.floor(Math.random() * (a - b + 1)) + b);
        } /*else if (side === 1) {
    
            x = 50; 
            y = (Math.random() * botCanvas.height)-100;
            initialVelocityX = (5 + Math.random() * 3);
            initialVelocityY = -(Math.random() * 7);
        } else {
            x =botCanvas.width-50; 
            y = (Math.random() * botCanvas.height)-100;
            initialVelocityX = (5 + Math.random() * 3); 
            initialVelocityY = -(Math.random() * 7);
        }*/
        fruits.push(new Fruit(x, y, initialVelocityX, initialVelocityY,spriteindex,rad));
        
    }
    updateAndDrawFruits(backgroundImage) {
        botCtx.drawImage(backgroundImage, 0, 0,botCanvas.width, botCanvas.height);
   
       fruits.forEach((fruit, index) => {
            fruit.update();
            fruit.draw(botCtx);
            if (fruit.y > botCanvas.height) {
               fruits.splice(index, 1);
                if(fruit.spriteindex !=0 && fruit.spriteindex !=7 ){
                    if(!fruit.isSliced){
                        this.lives -=0.5;
                        this.HandleBotlives();
                    }
                
                }
            
                
            }
        });
        }
         HandleBotlives(){
            if(this.lives == 0){
              botgameOver();
           }
           

        }
        reset(){
            this.lives=3;
            botscore=0;
            fruits=[];
        }
       
}