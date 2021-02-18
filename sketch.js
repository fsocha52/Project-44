var START = 1;
var END = 0;
var gameState = START;

var runner;
var jumpingAnimation;
var runningAnimation;

var gameOver = false;

var gameBackground;
var platformBackground;

var walkSound;
var gameMusic;
var gameOverMusic;
var jumpSound;

var gameFont;

var platformsGroup;

var gravity = 1;

var jumpPower = 15;

var runnerSpeed = 15;

var currentBackgroundTilePosition;
var backgroundTiles;

var playerScore = 0;

var currentPlatformLocation;



function preload() {
  
  jumpingAnimation = loadAnimation("jump00.png", "jump01.png", "jump02.png", "jump03.png", "jump04.png", "jump05.png", "jump06.png", "jump07.png", "jump08.png", "jump09.png");
  
  runningAnimation = loadAnimation("run01.png", "run02.png", "run03.png", "run04.png", "run05.png", "run06.png", "run07.png", "run08.png");
  
  
  
  gameBackground = loadImage("desertBackground.png");
  platformBackground = loadImage("desertPlatform.png");
  
  jumpSound = loadSound("jumpSound.mp3");
  gameMusic = loadSound("gameMusic.mp3");
  
  gameFont = loadFont("gameFont.TTF");
  
}



function setup() {
  
  createCanvas(840,390);
  
  runner = createSprite(50,100,25,40);
  runner.depth = 4;  
  runner.addAnimation('jump', jumpingAnimation);
  runner.addAnimation('run', runningAnimation);
  runner.setCollider("rectangle", 0, 0, (runner.width), (runner.height) );
  
  platformsGroup = new Group();
  
  currentBackgroundTilePosition = -width;
  backgroundTiles = new Group();
  
  gameMusic.loop();
  
  newGame();
  
}



function draw() {
  
  background("White");
  
  drawSprites();
  
  if (gameState === START) {
    
    updateScore();
    
    camera.position.x = runner.position.x + 300;
    
    runner.velocity.x = runnerSpeed;
    
    addNewBackgroundTiles();
    removeOldBackgroundTiles();
    fallCheck();
    addNewPlatforms();
    
    
    
    if (runner.y > 390) {
      
      gameState = END;
      
      
        
      }
      
    }
  if (gameState === END) {
    
    gameOverText();
      
      if (keyWentDown("Space")) {
        
        newGame();
  }
    
    
    
    
    
  }
  
  
  
  runner.visible = true;
  runner.collide (platformsGroup, solidGround);  
  
  runner.velocityY = runner.velocityY + 1.2;
  
  
  
  removeOldPlatforms();
  updateSprites(false);
  jumpDetection();
  
  
}



function addNewPlatforms() {
  
  if (platformsGroup.length < 4) {
    
    var currentPlatformLength = 1132;
    var platform = createSprite((currentPlatformLocation * 1.3), random(300,350), 1132, 336);
    
    platform.collide(runner);
    
    currentPlatformLocation += currentPlatformLength;
    platform.addAnimation('default', platformBackground);
    platform.depth = 3;
    platformsGroup.add(platform);
    
  }
  
}



function solidGround() {
  
  runner.velocity.y = 0;
  runner.changeAnimation("run");
  
  if (runner.touching.right) {
    
    runner.velocity.x = 0;
    runner.velocity.y += 30;
  }
}



function jumpDetection() {
  
  if (keyWentDown("Space")) {
    
    runner.changeAnimation("jump");
    runner.animation.rewind();
    runner.velocity.y = -jumpPower;
    
    jumpSound.play();
    
  }
  
}



function addNewBackgroundTiles() {
  
  if (backgroundTiles.length < 3) {
    
    currentBackgroundTilePosition += 839;
    
    var bgLoop = createSprite(currentBackgroundTilePosition, height/2, 840, 390);
    
    bgLoop.addAnimation('bg', gameBackground);
    bgLoop.depth = 1;
    backgroundTiles.add(bgLoop);
  }
}



function removeOldBackgroundTiles() {
  
  for (var i = 0; i < backgroundTiles.length; i++) {
    
      if ((backgroundTiles [i] .position.x) < runner.position.x-width) {
        
        backgroundTiles [i] .remove();
        
    }
    
  }
  
}



function fallCheck() {
  
  if (runner.position.y > height) {
    
    gameState = END;
    
    gameMusic.stop();
    //gameOverMusic.loop();
    
    platformsGroup.destroyEach();
    runner.velocityX = 0;
    
    
  }
  
}



function gameOverText() {
  
  background(0,0,0,10);
  fill('white');
  stroke('black')
  textAlign(CENTER);
  textFont(gameFont);
  text.depth = 7;
  
  strokeWeight(2);
  textSize(90);
  strokeWeight(10);
  text("GAME OVER", camera.position.x, camera.position.y);
  
  textSize(15);
  text("Press `SPACE` to restart", camera.position.x, camera.position.y + 100);
  
  textSize(20);
  text("You ran " + playerScore + ' yards!', camera.position.x, camera.position.y + 50);
  
}



function newGame() {
  
  platformsGroup.removeSprites();
  backgroundTiles.removeSprites();
  gameOver = false;
  updateSprites(true);
  runnerSpeed = 15;
  runner.x = 50;
  runner.y = 50;
  runner.velocity.x = runnerSpeed;
  currentPlatformLocation = -width;
  currentBackgroundTilePosition = -width;  
  playerScore = 0;
  addNewPlatforms();
  
  //gameOverMusic.stop();
  gameMusic.stop();
  gameMusic.loop();
  
  gameState = START;
  
  runner.velocityX = runnerSpeed;
  
}



function updateScore() {
  
  if (frameCount % 60 === 0) {
    
    playerScore++;
    
  }
  
  fill('white');
  strokeWeight(2);
  stroke('black');
  textFont(gameFont);
  textSize(20);
  textAlign(CENTER);
  text(playerScore, camera.position.x + 350, camera.position.y + 160);
  
}



function removeOldPlatforms() {
  
  for (var i = 0; i < platformsGroup.length; i++) {
    
    if ((platformsGroup [i] .position.x) < runner.position.x-width) {
      
      platformsGroup [i] .remove();
      
    }
    
  }
  
}
