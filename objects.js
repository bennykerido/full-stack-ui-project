const baseLine = 205;
var carH;
var carX;
var carXw;
var GodMod = false;
var devMode = false;


function Background(img){
    this.width = img.width;
    this.height = img.height;
    this.offsetY = 0;
    this.img = img;
    this.travel = 0;
    
    this.render = function(ctx, width, height, state){
        draw(false, ctx, this.img,0,0,0,0,0,this.offsetY-height+1,0,0,0,0,0,0);
        draw(false, ctx, this.img,0,0,0,0,0,this.offsetY,0,0,0,0,0,0);
        if(state == "Playing"){
            this.travel+=0.05;
            this.offsetY += 8;
            this.offsetY %= height;
        }
    };

    this.getScore = function(){
        return Math.floor(this.travel);
    };

    this.restart = function(){
        this.offsetY = 0;
        this.travel = 0;
    };
}

function UserCar(img){
    this.rows = 16;
    this.cols = 9;
    this.frames = 141;
    this.xSprite = 0;
    this.ySprite = 0;
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    this.sx = this.width/this.rows;
    this.sy = this.height/this.cols;
    this.carCenter = (this.sx/8);
    this.baseLine = this.sy/4+30;
    this.width /= 10;
    this.height /= 10;
    this.movement = 1;
    carH = this.sy/4;
    
    this.turnGodMode = function(){
        godMode();
    }

    this.turnDevMode = function(){
        devMode = !devMode;
    };

    this.restart = function(){
        this.movement = 1;
    };

    this.selectScreen = function(ctx, width, height){
        draw(true, ctx, this.img, 
            this.sx*this.xSprite,  
            this.sy*this.ySprite, 
            this.sx, 
            this.sy, 
            (width/2-this.sx/8), 
            (height/2-this.sy/8), 
            this.sx/4, 
            this.sy/4,
            0,0,0,0);
    }

    this.render = function(ctx, width, height){
        draw(true, ctx, this.img, 
            this.sx*this.xSprite,  
            this.sy*this.ySprite, 
            this.sx, 
            this.sy, 
            (width/2-this.carCenter*this.movement), 
            (height)-this.baseLine, 
            this.sx/4, 
            this.sy/4,
            carX,
            carXw,
            height - baseLine + 30,
            height - baseLine+this.sy/4-30,
            "#00ffff");
        if(!GodMod){
            carX =  width/2-this.carCenter*this.movement + 35;
            carXw = carX + this.sx/4 -70;
        }
    }

    this.selection = function(dir){
        if(dir == "left"){
            if(this.xSprite == 0 && this.ySprite == 0){
                this.xSprite = 15;
                this.ySprite = 5;
            } else if(this.ySprite == 0){
                this.xSprite--;
                this.ySprite = 8;
            } else {
                this.ySprite--;
            }
        } else if(dir == "right"){
            if(this.xSprite == 15 && this.ySprite == 5){
                this.xSprite = 0;
                this.ySprite = 0;
            } else if(this.ySprite == 8){
                this.xSprite++;
                this.ySprite = 0;
            } else {
                this.ySprite++;
            }
        }
    }
    this.move = function(dir){
        if(dir == "right"){
            if(this.movement > -2.6){
                this.movement -= 0.10;
                
            }
        } else if(dir == "left"){
            if(this.movement < 4.6){
                this.movement += 0.10;
                
            }
        }
    }
}

function RandomCars(img){
    this.rows = 16;
    this.cols = 9;
    this.frames = 141;
    this.xSprite = 0;
    this.ySprite = 0;
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    this.sx = this.width/this.rows;
    this.sy = this.height/this.cols;
    this.width /= 10;
    this.height /= 10;
    this.offsetY = -this.height;
    this.counter = -1;
    this.road = 500/4;
    this.isCounting = false;
    this.drawDone = true;

    this.restart = function(){
        this.counter = -1;
        this.offsetY = -this.height; 
        this.isCounting = false;
        this.drawDone = true;
    };

    this.isDone = function(height){
        return this.offsetY < -this.height || this.offsetY > height;
    }

    this.setDrawDone = function(state){
        this.drawDone = state;
    };

    this.render = function(ctx, height, count, lane, speed){
        if(this.drawDone){
            this.drawDone = false;
            this.counter = count;
            this.isCounting = true;
            this.offsetY = -this.height;
            if(lane < 3){
                this.offsetY = height;
            }
        }
        if(this.counter == 0){
            if(lane < 3){
                if(this.offsetY < -this.height){
                    //this.offsetY = -this.height;
                    this.counter = -1;
                    this.isCounting = false;
                }
                ctx.save();
                ctx.translate(0, this.height);
                ctx.scale(1,-1);
                draw(true, ctx, this.img,
                    this.sx*this.xSprite,  
                    this.sy*this.ySprite, 
                    this.sx, 
                    this.sy, 
                    (this.road*lane), 
                    this.offsetY, 
                    this.sx/4, 
                    this.sy/4,
                    this.road*lane+25,
                    this.road*lane + this.sx/4 - 25,
                    this.offsetY + 30,
                    this.offsetY -30 + this.sy/4);
                ctx.restore();
                if((carX >= this.road * lane + 25 &&
                    carX <= this.road * lane - 25 + this.sx/4) || 
                    (carXw >= this.road * lane + 25  &&
                    carXw <= this.road * lane - 25 + this.sx/4)){
                    if(this.offsetY + 50 - this.sy/4 <= -baseLine && this.offsetY -50 >= -baseLine - this.sy/4 - 50){
                        return true;
                    }
                }      
                this.offsetY -= speed;
                
            } else {
                if(this.offsetY > height){
                    //this.offsetY = -this.height;
                    this.counter = -1;
                    this.isCounting = false;
                }
                draw(true, ctx,this.img,
                    this.sx*this.xSprite,  
                    this.sy*this.ySprite, 
                    this.sx, 
                    this.sy, 
                    (this.road*lane+25), 
                    this.offsetY, 
                    this.sx/4, 
                    this.sy/4,
                    this.road*lane+50,
                    this.road *lane + this.sx/4,
                    this.offsetY + 30 ,
                    this.offsetY -30 + this.sy/4);   
                if((carX >= this.road*lane+50 &&
                    carX <= this.road * lane + this.sx/4) || 
                    (carXw >=  this.road*lane+50  &&
                    carXw <= this.road * lane + this.sx/4)){
                    if( this.offsetY -50 + this.sy/4 >= height - baseLine && this.offsetY + 30 <= height - baseLine + this.sy/4){
                        return true;
                    }
                }
                this.offsetY += speed;
            }
        } else {
            this.counter--;
        }
    };

    this.setSprites = function(x,y){
        this.xSprite = x;
        this.ySprite = y;
    };

    this.getLane = function(){
        return this.lane;
    };

    this.getCounter = function(){
        return this.counter;
    };
}

function Tree(img){
    this.width = img.width;
    this.height = img.height;
    this.img = img;
    this.offsetY = -this.height;
    this.side = true;

    this.restart = function(){
        this.side = true;
        this.offsetY = -this.height;
    };

    this.render = function(ctx, width, height){
        if(this.offsetY > height){
            this.offsetY = -this.height;
            this.side = !this.side;
        }
        if(this.side){
            draw(false, ctx, this.img, 
                0,0,0,0, 
                -this.width/3, 
                this.offsetY,
                0,0,
                -this.width/3,   
                -this.width/3+this.width,
                this.offsetY,
                this.offsetY+this.height);
        } else {
            draw(false, ctx, this.img,
                 0,0,0,0, 
                 width-this.width/1.5, 
                 this.offsetY,
                 0,0,
                 width-this.width/1.5,
                 width-this.width/1.5+this.width,
                 this.offsetY,
                 this.offsetY+this.height);
        }
        this.offsetY += 8;
    };

    this.isSpawned = function(){
        return this.spawned;
    };
}

function Island(img){
    this.width = img.width;
    this.height = img.height;
    this.offsetY = -this.height;
    this.img = img;

    this.restart = function(){
        this.offsetY = -this.height; 
    };


    this.render = function(ctx, width, height){
        if(this.offsetY > height){
            this.offsetY = -this.height;
        }
        draw(false, ctx, this.img,
            0,0,0,0,
            width/2-this.width/2, 
            this.offsetY,
            0,0,
            width/2-this.width/2,
            width/2+this.width/2,
            this.offsetY+50,
            this.offsetY+this.height-50);
        if((carX >= width/2-this.width/2 && carX <= width/2+this.width/2) || (carXw >= width/2-this.width/2 && carXw <= width/2+this.width/2) ){
            if(this.offsetY + this.height - 50 >= height - baseLine && this.offsetY+50 <= height - baseLine + carH){
                return true;
            }
        }
        this.offsetY += 8;
    
    };

    this.getOffset = function(){
        return this.offsetY;
    };
}

function TrafficLights(img){
    this.img = img;
    this.width = img.width;
    this.height = img.height;

    this.render = function(ctx, width, height, phase){
        ctx.drawImage(this.img,
                    width/2-this.width/2,
                    height/2-this.height/2);
        var start = height/2-this.height/2;
        var verticalOffset = this.height/6;
        if(phase == 0){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(width/2,start+verticalOffset*1,68,0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
        }
        if(phase <= 1){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(width/2,start+verticalOffset*3,68,0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
        } 
        if(phase <= 2){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(width/2,start+verticalOffset*5,68,0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
        } 
    };
}

function Sewage(img){
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    this.road = 230;
    this.offsetY = -this.height;
    this.counter = -1;
    this.isCounting = false;

    this.restart = function(){
        this.counter = -1;
        this.offsetY = -this.height; 
        this.isCounting = false;
    };


    this.render = function(ctx, width, height, lane, count){
        if(this.counter == -1){
            this.counter = count;
            this.isCounting = true;
        }
        if(this.counter == 0){
            if(this.offsetY >= height){
                this.offsetY = -this.height;
                this.isCounting = false;
                this.counter = -1;
            }
            if(lane == 2){
                draw(false, ctx, this.img,
                    0,0,0,0, 
                    this.road*lane+30, 
                    this.offsetY,
                    0,0,
                    this.road*lane+35,
                    this.road*lane+15+this.width,
                    this.offsetY,
                    this.offsetY+this.height-20);
                if((carX >= this.road*lane+35 && carX <= this.road*lane+this.width+15) ||
                (carXw >= this.road*lane+35 && carXw <= this.road*lane+this.width+15) ||
                (carX < this.road*lane+35 && carXw > this.road*lane+this.width+15)){
                    if(this.offsetY+this.height-20 >= height-baseLine+25 && this.offsetY <= height - baseLine + carH){
                        return true;
                    }
                }
            } else { 
                draw(false, ctx, this.img,
                    0,0,0,0, 
                    this.road*lane, 
                    this.offsetY,
                    0,0,
                    this.road*lane+5,
                    this.road*lane+this.width-15,
                    this.offsetY+5,
                    this.offsetY+this.height-20);
                if((carX >= this.road*lane+5 && carX <= this.road*lane+this.width-15) ||
                (carXw >= this.road*lane+5 && carXw <= this.road*lane+this.width-15) ||
                (carX < this.road*lane+5 && carXw > this.road*lane+this.width-15)){
                    if(this.offsetY+this.height-20 >= height-baseLine+25 && this.offsetY+5 <= height - baseLine + carH){
                        return true;
                    }
                }
            }
            this.offsetY += 8;
        } else {
            this.counter--;
        }
    };

    this.getIsCounting = function(){
        return this.isCounting;
    };
}

function draw(long, ctx, img, sx, sy, swidth, sheight, x, y, width, height, bbx, bbxw, bby, bbyw, color){
    if(long){
        ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    } else {
        ctx.drawImage(img, x,y);
    }
    if(devMode){
        ctx.beginPath();
        ctx.moveTo( bbx, bby);
        ctx.lineTo( bbxw, bby);
        ctx.lineTo( bbxw, bbyw);
        ctx.lineTo( bbx, bbyw);
        ctx.closePath();
        ctx.lineWidth = 3;
        if(!color){
        ctx.strokeStyle = "#7FFF00";
        } else {
            ctx.strokeStyle = color; 
        }
        ctx.stroke();
    }
}


function godMode(){
    if(!GodMod){
        carX = 0;
        carXw = 0;
    }
    GodMod = !GodMod;
}
