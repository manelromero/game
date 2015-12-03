// Entity superclass
var Entity = function(x, y, sprite, speed) {
	this.x = x;
	this.y = y;
	this.sprite = sprite;
	this.speed = speed;
};
Entity.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var canvasLimit = 510; // Variable to define when an enemy gets out of the canvas
// Enemy class
var Enemy = function(x, y, sprite, speed) {
	Entity.call(this, x, y, sprite, speed);
	Enemy.prototype.update = function(dt) {
		this.x += this.speed * dt; // Multiply horizontal speed by dt parameter
		if (this.x > canvasLimit) this.delete(); // When an enemy reaches the end of the canvas
	};
	Enemy.prototype.create = function() {
		var rows = [60, 144, 228];
		var speed = Math.floor(Math.random() * (400 - 100)) + 100; // Random speed between 100 and 400
		var enemy = new Enemy(-100, rows[Math.floor(Math.random() * 3)], 'images/enemy-bug.png', speed);
		allEnemies.push(enemy);
	};
	Enemy.prototype.delete = function() {
		for (var i = 0; i < allEnemies.length; i++) {
			if (allEnemies[i] === this) {
				allEnemies.splice(i, 1);
				this.create();
			}
		}
	};
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;



// Player class
var Player = function(x, y, sprite) {
	Entity.call(this, x, y, sprite);
	this.play = false;
	this.crash = false;
	Player.prototype.handleInput = function(key) {
		switch(key) {
			case 'space':
				this.play = !this.play; // Toggle true/false to pause the game
				if (this.play && this.crash) {
					window.location.reload(); // Restart the game reloading the page
				}
				// Show/hide 'press space' message
				var message = document.getElementById('message'); // Show the message defined in collision()
				message.style.display = message.style.display != 'none' ? 'none' : '';
				break;
			case 'left':
				if (this.play && this.x > 0) this.x -= 100;
				break;
			case 'up':
				if (this.play && this.y <= 60 && !this.crash) { // Player reaches the water and not in 'collision mode'
					this.y = 396;
					this.updateScore(100); // Add 100 points
				} else {
					if (this.play) this.y -= 84;
				}
				break;
			case 'right':
				if (this.play && this.x < 400) this.x += 100;
				break;
			case 'down':
				if (this.play && this.y < 380) this.y += 84;
				break;
		}
	};
	Player.prototype.checkCollision = function() {
		// Get the x and y positions for player
		var playerLeft = this.x;
		var playerRight = playerLeft + 80; // 80 is the sprite's player width
		var ypos = this.y;
		// One by one check with enemies position
		allEnemies.forEach(function(enemy) {
			var enemyLeft = enemy.x;
			var enemyRight = enemyLeft + 80; // 80 is the sprite's enemy width
			// First check if they are in the same row
			if (ypos == enemy.y) {
				// Then check if player is the the enemy column
				if (playerLeft > enemyLeft && playerLeft < enemyRight) this.collision();
				if (playerRight > enemyLeft && playerRight < enemyRight) this.collision();
			}
		}, this);
	};
	// When a collision is detected
	Player.prototype.collision = function() {
		this.play = false;
		message.innerHTML = 'FINAL SCORE: ' + score + '<br><br>PRESS SPACE TO<br>PLAY AGAIN';
		message.style.display = '';
		this.crash = true;
	};
	// Check for gem collection
	Player.prototype.checkGemCollected = function() {
		if (this.x == gem.x && this.y == gem.y + 10) {
			this.updateScore(50); // Add 50 points
			gem.x = -100; // Send the gem out of the canvas
			gem.inside = false;
		}
	};
	// Update score
	Player.prototype.updateScore = function(points) {
		score += points;
		document.getElementById('score').innerHTML = score;
	};
};
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;



// Gem class
var Gem = function(x, y, sprite) {
	Entity.call(this, x, y, sprite);
	this.inside = false;
	this.timeInside = 0;
	Gem.prototype.update = function(dt) {
		this.timeInside += dt;
		if (this.timeInside >= 5) { // Disappear after 5 seconds inside the canvas without been collected
			this.x = -100; // 100 pixels out of the canvas
			this.inside = false;
		}
		var insertGem = Math.floor(Math.random() * (400 - 1)) + 1; // 1/400 probability of generating a gem
		if (insertGem == 1 && !this.inside) {
			this.inside = true;
			this.create();
			this.timeInside = 0;
		}
	};
	Gem.prototype.create = function() {
		this.x = (Math.floor(Math.random() * 5)) * 100; // Random column
		var rows = [50, 134, 218];
		this.y = rows[Math.floor(Math.random() * 3)]; // Random row
		var sprites = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
		this.sprite = sprites[Math.floor(Math.random() * 3)]; // Random color sprite
	};
};
Gem.prototype = Object.create(Entity.prototype);
Gem.prototype.constructor = Gem;


// Create player
var player = new Player(200, 396, 'images/char-pink-girl.png');
// Initiate score
var score = 0;
player.updateScore(score);
// Create 4 enemies
var allEnemies = [];
for (var x = 1; x <= 4; x++) {
	var enemy = new Enemy();
	enemy.create();
}
// Create gem outside the canvas
var gem = new Gem(-100, 60, 'images/Gem Blue.png');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		32: 'space', // Just added this line to control space key
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
