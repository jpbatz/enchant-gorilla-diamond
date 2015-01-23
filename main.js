// code.9leap.net default template
// based on enchant.js v0.7.1
var stgWidth = 320;
var stgHeight = 320;
var health = 5;
var moveSpeed = 4;

enchant();

// 02 Player Class
Player = Class.create(Sprite, {
    
    initialize: function() {
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.png'];
        this.x = stgWidth/2;
        this.y = stgHeight/2;
        this.frame = 44;
        this.health = 4;
        
        // 03 Bind Keys
        // game.keybind(65, 'left');
        // game.keybind(68, 'right');
        // game.keybind(87, 'up');
        // game.keybind(83, 'down');
        
        // 04 Mouse Variables
        this.tx = this.x;  // mouse click location
        this.ty = this.y;
    },
    
    onenterframe: function() { // run for each frame
        
        // 03 Player Controls
        if(game.input.left && !game.input.right) {
            this.tx = this.x -= moveSpeed;
        } else if(game.input.right && !game.input.left) {
            this.tx = this.x += moveSpeed;
        }
        if(game.input.up && !game.input.down) {
            this.ty = this.y -= moveSpeed;
        } else if(game.input.down && !game.input.up) {
            this.ty = this.y += moveSpeed;
        }
        
        // 04 Mouse Update
        this.x += (this.tx - this.x)/4;  // approach click locations by
        this.y += (this.ty - this.y)/4;  // 1/4th until reached

    }
});
    
// 05 Gem Class
Gem = Class.create(Sprite, {
    
   initialize: function() {
        Sprite.call(this, 16, 16);
        this.image = game.assets['diamond-sheet.png'];
        this.x = Math.random() * (stgWidth - 16);
        this.y = Math.random() * (stgHeight - 16);
        if(this.y < 50) {  // keep out of the black area
            this.y = 50;
        }
        this.frame = 0;
   },
   
   onenterframe: function() {
        if(this.age % 2 === 0) {
           if(this.frame == 5) {
               this.frame = 0;
           } else {
               this.frame++;
           }
        }
        // rotating using scaleX
        this.scaleX = Math.sin(this.age * 0.1);  // works for vertically symmetrical shapes

        // Collision Check
        if(this.intersect(player)) {
            game.rootScene.removeChild(this);
            game.assets['sounds/bling.wav'].play();
            gem = new Gem();
            game.rootScene.addChild(gem);
            game.score += 100;
        }
   },

   onexitframe: function() {
    console.log("Exiting");
   }

});

// 08 Bomb Class
Bomb = Class.create(Sprite, {
    
    initialize: function() {
      Sprite.call(this, 16, 16);
      this.image = game.assets['icon0.png'];
      this.x = Math.random() * (stgWidth - 16);
      this.y = Math.random() * (stgHeight - 16);  // account for the bottom
      if(this.y < 50) {
          this.y = 50;
      }
      this.frame = 24;
    },
    
    onenterframe: function() {
        if(this.age === 60) {
            game.rootScene.removeChild(this);
        }
        
        if(this.intersect(player)) {
            game.assets['sounds/balloon.wav'].play();
            player.health--;
            game.rootScene.removeChild(this);
            console.log("ouch!");
        }
        
        if(this.age % 10 === 0) {
            if(this.frame === 25) {
                this.frame = 24;
            } else {
                this.frame++;
            }
        }
    }
});

// var initialized = false;

// Begin game code
window.onload = function(){

    game = new Core(stgWidth, stgHeight);
    //game.fps = 15;

    // Preload images
    game.preload('icon0.png', 'diamond-sheet.png', 'bg.png', 'sounds/pingas.wav', 'sounds/bling.wav', 'sounds/balloon.wav', 'sounds/crickets.wav');
    

    game.onload = function(){
        // if(!initialized) {
        //     initialized = true;
        // } else {
        //     return;
        // }

        // 01 Add Background
        bg = new Sprite(stgWidth, stgHeight);
        bg.image = game.assets['bg.png'];
        game.rootScene.addChild(bg);
        game.assets['sounds/pingas.wav'].play();
              
        
        //02 Add Player
        player = new Player();
        game.rootScene.addChild(player);
        
        // 05 Add Gem
        gem = new Gem();
        game.rootScene.addChild(gem);
        
        // 06 Create Label
        game.score = 0;
        scoreLabel = new Label("Score: ");
        
        scoreLabel.addEventListener('enterframe', function() {
            this.text = "Score: " + game.score;
        });
        
        // scoreLabel.x = stgWidth/2;
        scoreLabel.color = "white";
        
        game.rootScene.addChild(scoreLabel);
        
        // 08 Health Label
        healthLabel = new Label("Health: ");
        healthLabel.addEventListener('enterframe', function() {
           this.text = "Health: " + player.health;
           if(player.health <= 2) {
               this.color = "red";
           }
        });
        
        healthLabel.color = "white";
        healthLabel.x = 6 * stgWidth/8;
        game.rootScene.addChild(healthLabel);
        
        // 04 Touch Listener
        game.rootScene.addEventListener('touchend', function(e) {
            player.tx = e.x - 16;  // set to click location
            player.ty = e.y - 16;  // sprite is 16x16
        });
        
        // Game Condition Check
        game.rootScene.addEventListener('enterframe', function() {

            // 08 Game Over
            if(player.health <= 0) {
                game.end();
                // game.assets['sounds/ting.wav'].play();
                game.assets['sounds/crickets.wav'].play();

            }
            
            // 08 Make Bomb Generator
            if(player.age % 30 === 0) {
                bomb = new Bomb();
                game.rootScene.addChild(bomb);
            }
            
        });
    };
    game.start();
};