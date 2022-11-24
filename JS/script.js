//alert("Please play on large display devices, Thanking you :)");
var w = window.innerWidth;
var h = window.innerHeight;
console.log(w, h); // 1212 X 687
if(w<1212 || h<687){
    alert("This game is not adapted for display smaller than 1212px * 687px. Sorry for inconvenience :(");
}

// Targetting all the required elements
const playGround= document.querySelector(".playground"); // white canvas
const startBtn = document.querySelector("#start"); // start button
const automate= document.querySelector("#automate"); // automate button
const reset= document.querySelector("#reset"); // reset button
const dino = document.querySelector(".dino"); // dino 
const cactus = document.querySelector(".cactus") // cactus
const track = document.querySelector(".track"); // track
const cloud = document.querySelector(".cloud"); // cloud
const gameOverImg = document.querySelector(".gameOver"); // gameOver image
const instruction= document.querySelector(".instruction"); // instrution text
const Score= document.querySelector(".score"); // score class


let flag_strt=false; // wheather game has started or not !
let flag_auto_main=false; // wheather autoPlay is ON or OFF
let score=0;

// Function to initiate jump animation for dino
function dinoJump() {
    if (dino.classList.contains("jump")===false) { // iF dino currently has no jump class, then only jump!
        dino.classList.add("jump");
        var audioFileJump= new Audio("assets/audio/jump.mp3");
        audioFileJump.play();
        setTimeout(function () {
            dino.classList.remove("jump");
        }, 300);
    }
}

// Random number generator for cactus 1,2,3
function randomNum() {
    let a = Math.random();
    a *= 3;
    a += 1;
    a = Math.floor(a);
    return a;
}

// function to call dinoJump on keydown
document.addEventListener("keydown", function (e) {
    if(e.code==="Space"){
        dinoJump();
        if(flag_strt===true && flag_auto_main===false){ // If game has started && autoPlay is off
            score+=5;
            Score.textContent="Score: "+score;
            if(score%50==0){ // If score is multiple of 50 --> Play sound!
                var audioFileMilestone= new Audio("assets/audio/milestone.mp3");
                audioFileMilestone.play();
            }
        }
        if(flag_auto_main===true){ // If palyer press "Space" while autoPlay is on, autoPlay will turned off !
            flag_auto_main=false;
            automate.style.backgroundColor="red";
        }
    }
});


automate.addEventListener("mouseover", function () {
    flag_auto_main=true;
        
    automate.style.backgroundColor="green";
});
automate.addEventListener("mouseout", function () {
    flag_auto_main=false;
        
    automate.style.backgroundColor="red";
});

reset.addEventListener("click", function(){
    location.reload(); // reload 
});

let exitStatus=0;

startBtn.addEventListener("click", function () {

    instruction.classList.add("isVisible"); // instruction not Visible
    flag_strt=true;
    startBtn.style.backgroundColor="green";

    // first move the reuired element back in their default positions
    cactus.style.left = "1150px";
    cloud.style.left = "1110px";
    dino.classList.add("jump"); // when game just starts --> Jump dino once (replicate actual game)
    setTimeout(function () {
        dino.classList.remove("jump");
    }, 300);
    
    track.classList.add("trackMove");
    cloud.classList.add("cloudMove");
    cactus.classList.add("cactusMove");


    let collisionCondition; // isCollision indicator [true denotes collision]
    let count=0; // updating count to achieve running (leg) state of dino

    const check= setInterval(function () { //check collision status after every 50ms, & update random cactus cls

        count++;

        let dinoRun= 'assets/image/DinoRun'+count%2+'.png'; // to replicate running state of dino !
        dino.style.backgroundImage = "url('"+dinoRun+"')";

        // targetting & getting y-co-ordinate of dino & -x co-ordinate of current cactus
        let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top")); console.log(dinoTop);
        let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

        if(cactusLeft>=100 && cactusLeft<=150){ // cactus is in the vicinity of dino --> so automate dino jump

            if(flag_auto_main===true){
                dinoJump();
            }
        }
        
        // Manual Jumping
        collisionCondition = (cactusLeft >= 0 && cactusLeft <= 40) && (dinoTop > 250);
        if (collisionCondition === true) { //collision==true
            
            dino.style.animationPlayState = "paused";
            cactus.style.animationPlayState = "paused";
            track.style.animationPlayState = "paused";
            cloud.style.animationPlayState = "paused";
            playGround.classList.add("gameEnd");
            dino.style.backgroundImage = "url('assets/image/DinoDead.png')";
            var gameOverDino= new Audio("assets/audio/gameOver.wav");
            gameOverDino.play();
            gameOverImg.classList.remove("isVisible");
            reset.classList.remove("isVisible");
            flag_strt=false; exitStatus=1;
            clearInterval(check);
        }
        
        if (cactusLeft<-50 && cactusLeft>-300) { // ensuring cactus class should change when cactus is outside of playing canvas
            cactus.classList.remove(cactus.classList[1]); //remove existing cactus class
            cactus.classList.remove(cactus.classList[1]); //remove existing cactusMove class
            cactus.classList.add("cactus" + randomNum());
            cactus.classList.add("cactusMove");
                
            if(exitStatus==1){  clearInterval(check);  }
        }
        if(exitStatus==1){  clearInterval(check);  }

    }, 50);
    
});

