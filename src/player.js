
import { Fruit, loadedSprites } from './fruit.js';
import { gameOver, Playercanvas, SlashFX, fxList, playerCtx, pointToLineDistance, splash } from './game.js';

let fruits=[];
export var Playerscore=0;
const x1 = document.getElementById('x1');
const x2 = document.getElementById('x2');
const x3 = document.getElementById('x3');

export class Player {
    constructor( sliceSound) {
        this.spliced = sliceSound;
        this.lives=3;  
    }

    handleSlice(x1, y1, x2, y2) {
        fruits.forEach(fruit => {
            if (!fruit.isSliced) {
                
                const dist = pointToLineDistance(fruit.x, fruit.y, x1, y1, x2, y2);
                if (dist < fruit.radius+5) {
                    fruits.slice();
                    spliced.currentTime = 0;
                    spliced.play();
                    if(fruit.spriteindex==0){
                        gameOver();
                    }else if(fruit.spriteindex==7){
                        gameOver();
                    }else{
                        Playerscore+=10;
                        fruit.isSliced = true;                  
                    }
                    fxList.push(new SlashFX(x1, y1, x2+100, y2,fruit.x,fruit.y));
                    
                    
                }
    
            }
        });
    }

    spawnFruit() {
        const side = Math.floor(Math.random() * 2);
        let x;
        let y;
        let initialVelocityX=0;
        let initialVelocityY=0;
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

            x = Math.random() *Playercanvas.width;
            y =  Playercanvas.height-100; 
            initialVelocityX = Math.floor(Math.random() * (5 + 4 + 1)) - 4;
            initialVelocityY = -(Math.floor(Math.random() * (a - b + 1)) + b);
        } /*else if (side === 1) {
           
            x = 50; 
            y = (Math.random() *  Playercanvas.height)-100;
            initialVelocityX = -(5 + Math.random() * 3);
            initialVelocityY = -(Math.random() * 7);
        } else {
           
            x = Playercanvas.width-50; 
            y = (Math.random() *Playercanvas.height)-100;
            initialVelocityX = -(5 + Math.random() * 3); 
            initialVelocityY = -(Math.random() * 7);
        }*/
        fruits.push(new Fruit(x, y, initialVelocityX, initialVelocityY,spriteindex,rad));
    }

    updateAndDrawFruits(backgroundImage) {
        playerCtx.drawImage(backgroundImage, 0, 0, Playercanvas.width,  Playercanvas.height);
   
       fruits.forEach((fruit, index) => {
            fruit.update();
            fruit.draw(playerCtx);
            if ( fruit.y > Playercanvas.height) {
                fruits.splice(index, 1);
                if( fruit.spriteindex !=0 && fruit.spriteindex !=7 ){
                    if(!fruit.isSliced){
                        this.lives -=0.5;
                        this.HandlePlayerlives();
                    }
                
                }
            
                
            }
        });
        }
        HandlePlayerlives(){
            if( this.lives == 2 ){
                x1.style.backgroundImage='url(public/xx1.png)';
            }else if( this.lives==1){
                x1.style.backgroundImage='url(public/xx1.png)';
                x2.style.backgroundImage='url(public/xx2.png)';
            }else if( this.lives == 0){
                x1.style.backgroundImage='url(public/xx1.png)';
                x2.style.backgroundImage='url(public/xx2.png)';
                x3.style.backgroundImage='url(public/xx3.png)';
                gameOver();
            }
            
        }
        reset(){
            this.lives=3;
            Playerscore=0;
            fruits=[];
        }
        
}