
WebFont.load({
    google: {
        families: ['Montserrat:300,400,500,700','Kanit:400,Italic']
    }
});

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var keyState = {};
var interVal;
var fPlace = 0, sPlace =0 , tPlace = 0;
var fName = "", sName = "", tName = "";
var State = "NewGame";
var key = new Image(); 
var nameBox = document.getElementById('name');
var person;
var phase = 1;
var logo = new Image();
var colorIndex = 0;
var obsticale = Math.floor(Math.random()*30+10);
var score = 0;

var colSound = new Audio();
colSound.src = "https://full-stack-ui-project.vercel.app/Audio/crash.mp3";

var countingBeeps = new Audio();
countingBeeps.src = "https://full-stack-ui-project.vercel.app/Audio/counting.mp3";

var bgSong = new Audio();
bgSong.src = "https://full-stack-ui-project.vercel.app/Audio/bg-song.mp3";
var isMusicOn = false;
var volume = 0.2;


var bg;
var bgImg = new Image();

var userCar;
var userCarImg = new Image();

var randomCars;
var cars = new Image();

var tree;
var treeImg = new Image();

var island;
var islandImg = new Image();

var lights;
var lightsImg = new Image();

var sewage;
var sewImg = new Image();

bgImg.src = "https://full-stack-ui-project.vercel.app/Images/Road1.png";
bgImg.onload = function(){
    bg = new Background(bgImg);
    userCarImg.src = "https://full-stack-ui-project.vercel.app/Images/playerCars.png";
    userCarImg.onload = function(){
        userCar = new UserCar(userCarImg); 
        cars.src = "https://full-stack-ui-project.vercel.app/Images/playerCars.png";
        cars.onload = function(){
            randomCars = [new RandomCars(cars), new RandomCars(cars),  new RandomCars(cars),  new RandomCars(cars)];
            treeImg.src = "https://full-stack-ui-project.vercel.app/Images/Tree.png";
            treeImg.onload = function(){
                tree = new Tree(treeImg);
                islandImg.src = "https://full-stack-ui-project.vercel.app/Images/Seperator.png";
                islandImg.onload = function(){
                    island = new Island(islandImg);
                    lightsImg.src = "https://full-stack-ui-project.vercel.app/Images/trafficLight.png";
                    lightsImg.onload = function(){
                        lights = new TrafficLights(lightsImg);
                        sewImg.src = "https://full-stack-ui-project.vercel.app/Images/sewage.png";
                        sewImg.onload = function(){
                            sewage = new Sewage(sewImg);
                            key.src = "https://full-stack-ui-project.vercel.app/Images/key.png";
                            key.onload = function(){
                                logo.src = "https://full-stack-ui-project.vercel.app/Images/logoR2I.png";
                                logo.onload = function(){
                                    startGame();
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
var count = [0,0,0,0];
var speed = [0,0,0,0];
var spawned = [false,false,false,false];
var collsion = [false, false, false, false, false, false];
var sewageLane = Math.floor(Math.random()*2)+1;
function startGame(){
    ///////////////////////////Start Screen///////////////////////////
    if(State == "NewGame"){
            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.filter = "blur(5px)";
            bg.render(ctx, canvas.width, canvas.height, State);
            ctx.filter = "none";
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.drawImage(logo, canvas.width/2-logo.width/2/2-10, 30, logo.width/2, logo.height/2);
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "30px Montserrat";
        if(phase == 1){
            ctx.fillText("Choose Your Car", canvas.width/2, canvas.height/2-100);
            userCar.selectScreen(ctx,canvas.width,canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "24px Montserrat";
            ctx.drawImage(key,                  // Right Arrow Key
                            canvas.width/2+60, 
                            canvas.height/2-20, 
                            60,60); 
            
            ctx.drawImage(key,                  // Left Arrow Key 
                            canvas.width/2-120, 
                            canvas.height/2-20, 
                            60,60);      
            
            ctx.drawImage(key,                  // Enter Key 
                            canvas.width/2-60, 
                            canvas.height/2+90,
                            120,
                            60);
            ctx.fillText(">", canvas.width/2+90, canvas.height/2+17);     
            ctx.fillText("<", canvas.width/2-90, canvas.height/2+17);  
            ctx.fillText("Enter", canvas.width/2, canvas.height/2+128);
            ///////////////////////////End of Start Screen///////////////////////////
        }else{
            ctx.fillText("Enter your name", canvas.width/2, canvas.height/2-100);
            ctx.fillStyle = "black";
            ctx.font = "24px Montserrat";
        }
        ctx.fillStyle = "white";
        ctx.font = "30px Montserrat";
        ///////////////////////////Game Loop///////////////////////////
    } else {
        if(keyState[37]){
            userCar.move("left");
        } else if(keyState[39]){
            userCar.move("right");
        }
        ctx.clearRect(0,0,canvas.width, canvas.height);
        if(State == "Pause" || State == "Collision"){ // If State changed to Pause adding blur to the background
            ctx.filter = "blur(5px)";
        }
        bg.render(ctx, canvas.width, canvas.height, State);
        score += 0.05;
        if(State == "Playing"){
            if(!sewage.getIsCounting()){
                if(sewageLane == 1){
                    sewageLane = 2;
                } else {
                    sewageLane = 1;
                }
                var sewageCount =  Math.floor(Math.random()*150)+250;
                collsion[5] = sewage.render(ctx, canvas.width, canvas.height, sewageLane, sewageCount);
            } else {
                collsion[5] = sewage.render(ctx, canvas.width, canvas.height, sewageLane, sewageCount);
            }
            if(score > obsticale){
               collsion[4] = island.render(ctx, canvas.width, canvas.height);
                if(island.getOffset() > canvas.height){
                    obsticale *= 3;
                    if(obsticale > 150){
                        score = 0;
                        obsticale = Math.floor(Math.random()*30+10);
                    }
                }
            }
            for(var i = 0; i < randomCars.length; i++){
                if(randomCars[i].getCounter() == -1){ 
                    if(randomCars[i].isDone(canvas.height)){
                        randomCars[i].setDrawDone(true);
                        spawned[i] = false;
                    }     
                    randomCars[i].setSprites(Math.floor(Math.random()*15), Math.floor(Math.random()*9));
                    count[i] = Math.floor(Math.random()*100)+1;
                    if(i > 1){
                        speed[i] = Math.floor(Math.random()*3)+4;
                    } else {
                        speed[i] = Math.floor(Math.random()*5)+10;
                    }
                    spawned[i] = true;
                    collsion[i] = randomCars[i].render(ctx, canvas.height, count[i], i+1, speed[i]);
                } else {
                    if(spawned[i]){
                        collsion[i] =  randomCars[i].render(ctx, canvas.height, count[i], i+1, speed[i]);
                    }
                }
                if(collsion[i] == true || collsion[4] == true || collsion[5] == true){
                    State = "Collision";
                    bgSong.muted = true;
                    crashed();
                }
            }
            userCar.render(ctx, canvas.width, canvas.height);
            tree.render(ctx, canvas.width, canvas.height);
            ctx.filter = "none";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "24px Montserrat";
            ctx.drawImage(key, 30, 20, 60, 60);
            ctx.fillText("P", 62,57);
            ctx.fillText("Pause", 60, 100);   
            ctx.font = "Italic 30px Kanit";
            ctx.fontWeight = "400"
            ctx.fillText(Math.floor(bg.getScore()),  canvas.width-60, canvas.height-75);
            ctx.font = "Italic 24px Kanit";
            ctx.fillText("Score", canvas.width-60, canvas.height-50); 
            ctx.font = "30px Montserrat";
            if(State == "Pause"){
                clearInterval(interVal);
                pause(true);
            }
        }
        ///////////////////////////End of Game Loop///////////////////////////
        ///////////////////////////Counting Loop///////////////////////////
        else if (State == "Counting") {
            if(colorIndex <= 3){
                lights.render(ctx, canvas.width, canvas.height, colorIndex);
                colorIndex++;
            } else {
                State = "Playing";
                clearInterval(interVal);
                playMusic();
                interVal = setInterval(startGame, 16.666);
            }
        }
        ///////////////////////////End of Counting Loop///////////////////////////
        /////////////////////////////Collision Screen/////////////////////////////
        else if(State == "Collision"){
            clearInterval(interVal);
            var placeStr = "";
            var place = scoreboard(bg.getScore());
            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.filter = "blur(5px)";
            bg.render(ctx, canvas.width, canvas.height);
            ctx.filter = "none";
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(logo, canvas.width/2-logo.width/2/2-10, canvas.height-logo.height/2-30, logo.width/2, logo.height/2);
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "30px Montserrat";
            ctx.fillText("Oh no!", canvas.width/2, canvas.height/2-85);
            ctx.fillText("You've crashed!", canvas.width/2, canvas.height/2-55);
            ctx.font = "50px Montserrat";
            if(place == 1){
                placeStr = "1st";
            } else if(place == 2){
                placeStr = "2nd";
            }else if(place == 3){
                placeStr = "3rd";
            }
            if(place != 0){
                ctx.fillText(placeStr+" Place!",canvas.width/2,canvas.height/2+160);
            }
            ctx.fillText("Score: "+bg.getScore(), canvas.width/2, canvas.height/2);
            ctx.font = "24px Montserrat";
            //ctx.fillStyle = "black";
            //ctx.textAlign = "center";
            //ctx.font = "30px Montserrat";
            ctx.drawImage(key, canvas.width/2-110, canvas.height/2+7, 126, 60);
            ctx.fillText("Press   SPACE   to start again", canvas.width/2, canvas.height/2+45);
            ctx.font = "24px Montserrat";
            ctx.fillText("PLACE", canvas.width/2-150, canvas.height/2-320);
            ctx.fillText("NAME", canvas.width/2, canvas.height/2-320);
            ctx.fillText("SCORE", canvas.width/2+150, canvas.height/2-320);
            ctx.fillText("1st", canvas.width/2-150, canvas.height/2-290);
            ctx.fillText(fName, canvas.width/2, canvas.height/2-290);
            ctx.fillText(fPlace, canvas.width/2+150, canvas.height/2-290);
            if(sPlace != 0){
                ctx.fillText("2nd", canvas.width/2-150, canvas.height/2-260);
                ctx.fillText(sName, canvas.width/2, canvas.height/2-260);
                ctx.fillText(sPlace, canvas.width/2+150, canvas.height/2-260);
            }
            if(tPlace != 0){
                ctx.fillText("3rd", canvas.width/2-150, canvas.height/2-230);
                ctx.fillText(tName, canvas.width/2, canvas.height/2-230);
                ctx.fillText(tPlace, canvas.width/2+150, canvas.height/2-230);
            }
        /////////////////////////End of Collision Screen/////////////////////////
        }
    }
}


document.addEventListener('keyup', function(event){
    var keyCode = event.keyCode; // 37 -> Left | 39 -> Right
    keyState[event.keyCode || event.which] = false;
    if(State == "NewGame"){
        if(keyCode == 37){
            userCar.selection("left");
            startGame();
        } else if(keyCode == 39){
            userCar.selection("right");
            startGame();
        } else if(keyCode == 13 && phase == 2){
            if(nameBox.value){
                person = nameBox.value;
                nameBox.value="";
                nameBox.style.visibility = "hidden";
                State = "Counting";
                startGame();
                countingBeeps.play();
                countingBeeps.volume = 0.1;
                interVal = setInterval(startGame, 1000);
            }
        } else if(keyCode == 13 && phase == 1){
            phase = 2;
            nameBox.style.visibility = "visible";
            nameBox.focus();
            startGame();
        }
    }
});

document.addEventListener('keydown', function(event){
    var keyCode = event.keyCode; // 37 -> Left | 39 -> Right
    if(State == "Playing" || State == "Pause"){
        keyState[event.keyCode || event.which] = true;
        if(keyCode == 80){//80 - P
            if(State == "Playing"){
                State = "Pause";
                clearInterval(interVal);
                pause();
            } else if(State == "Pause"){
                State = "Playing";
                interVal = setInterval(startGame, 16.666);
            }
        } else if(keyCode == 77){  // M to mute music
            if(isMusicOn){
                bgSong.muted = true;
            } else {
                bgSong.muted = false;
            }
            isMusicOn = !isMusicOn;
        } else if(keyCode == 71) { // G for GodMod
            userCar.turnGodMode();
        } else if(keyCode == 68) { // D for Developer Mode
            userCar.turnDevMode();
        }
    } else if(State == "Collision"){
        if(keyCode == 32){  // SPACE to start again
            playAgain();
        }
    }
});

function pause(){
    startGame();
    ctx.filter = "none";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(logo, canvas.width/2-logo.width/2/2-10, 30, logo.width/2, logo.height/2);
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.font = "24px Montserrat";
    ctx.fillText("Controls", canvas.width/4, canvas.height/16+canvas.height/6*1.5);
    ctx.fillText("_________", canvas.width/4, canvas.height/16+canvas.height/6*1.5+5);
    ctx.drawImage(key, 253, 299, 60, 60);
    ctx.fillText("Press   M   to Mute/Unmute", canvas.width/4, canvas.height/16+canvas.height/3);
    ctx.drawImage(key, 253, 352, 60, 60);
    ctx.fillText("Press   G   to God Mode", canvas.width/4, canvas.height/16*2+canvas.height/3);
    ctx.drawImage(key, 253, 405, 60, 60);
    ctx.fillText("Press   D   to Developer Mode", canvas.width/4, canvas.height/16*3+canvas.height/3);
    ctx.drawImage(key, 253, 511, 60, 60);
    ctx.fillText("Press   P   to Exit", canvas.width/4, canvas.height/16*5+canvas.height/3);
}


function crashed(){
    colSound.play();
    colSound.volume = volume;
}

function playMusic(){
    bgSong.currentTime = 0;
    bgSong.muted = false;
    bgSong.play();
    bgSong.volume = volume;
    bgSong.loop = true;
    isMusicOn = true;
}

function scoreboard(score){
    if(score > fPlace){
        tPlace = sPlace;
        sPlace = fPlace;
        fPlace = score;
        /*person = prompt("You're 1st Place! enter your name:");
        if(!person){
            person = "";
        }*/
        person = person.substr(0, 14);
        tName = sName;
        sName = fName;
        fName = person;
        return 1;
    } else if(score > sPlace){
        tPlace = sPlace;
        sPlace = score;
        /*person = prompt("You're 2nd Place! enter your name:");
        if(!person){
            person = "";
        }*/
        person = person.substr(0, 14);
        tName = sName;
        sName = person;
        return 2;
    } else if(score > tPlace){
        tPlace = score;
        /*person = prompt("You're 3rd Place! enter your name:");
        if(!person){
            person = "";
        }*/
        person = person.substr(0, 14);
        tName = person;
        return 3;
    } else {
        return 0;
    }
}

function playAgain(){
    clearInterval(interVal);
    keyState[37] = false;
    keyState[39] = false;
    phase = 1;
    bg.restart();
    sewage.restart();
    userCar.restart();
    tree.restart();
    island.restart();
    for(var i = 0; i < randomCars.length; i++){
        randomCars[i].restart();
    }
    isMusicOn = false;
    State = "NewGame";
    count = [0,0,0,0];
    lane = [0,0,0,0];
    speed = [0,0,0,0];
    laneUsage = [0,0,0,0];
    spawned = [false,false,false,false];
    collsion = [false, false, false, false, false, false];
    sewageLane = Math.floor(Math.random()*2)+1;
    colorIndex = 0;
    obsticale = Math.floor(Math.random()*30+10);
    score = 0;
    startGame();
}
