import { Playercanvas } from "./game.js";
import { Playerscore } from "./player.js";

const fruitSprites = [
    "public/fruits/boom.png",//0
    "public/fruits/apple.png",//1
    "public/fruits/avocado.png",//2
    "public/fruits/bananas.png",//3
    "public/fruits/mango.png",//4
    "public/fruits/orange.png",//5
    "public/fruits/strawberry.png",//6,
    "public/fruits/boom.png"//7
];
const SlicedSprites = [
    "public/fruits/boom-1.png",
    "public/fruits/apple-1.png",
    "public/fruits/avocado-1.png",
    "public/fruits/bananas-1.png",
    "public/fruits/mango-1.png",
    "public/fruits/orange-1.png",
    "public/fruits/strawberry-1.png", 
    "public/fruits/boom-1.png"
];
const boom = document.getElementById('boom');
    
export const loadedSprites = fruitSprites.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});
export const loadedSliced = SlicedSprites.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

export class Fruit {
    constructor(x, y, initialVelocityX, initialVelocityY,spriteindex,rad) {
        this.x = x;
        this.y = y;
        this.velocityX = initialVelocityX;
        this.velocityY = initialVelocityY;
        this.gravity = 0.2; 
        this.radius = rad;
        this.spriteindex =spriteindex;
        this.sprite =loadedSprites[this.spriteindex];
        this.spriteLeft=loadedSliced[this.spriteindex];
        this.spriteRight;
        this.isSliced = false;
        this.boom = boom;
    }
   

    draw(ctx) {
        if (!this.isSliced) {
            ctx.drawImage(this.sprite, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }else if(this.isSliced){
            ctx.drawImage(this.spriteLeft, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            
        }
    }

    update() {
        this.velocityY += this.gravity; 
        this.x += this.velocityX;
        this.y += this.velocityY; 

   
        if (this.x + this.radius > Playercanvas.width || this.x - this.radius < 0) {
            this.velocityX = -this.velocityX; 
        }

      
        if (this.y - this.radius > Playercanvas.height) {
            this.isSliced = true; 
        }

    }

    slice() {
        if(this.spriteindex==0 || this.spriteindex==7){
            this.isSliced=true
            boom.currentTime = 0;
            boom.play();
            
        }else if(this.spriteindex==7){
            this.isSliced=true
            boom.currentTime = 0;
            boom.play();
            
        }
        else{
            this.isSliced = true;  
            scoreDisplay.textContent = `Score: ${Playerscore}`;

            
        }
        
    }
    reset(){
        this.x=0;
        this.y=0;
    }
}