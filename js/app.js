// Enemy class
var Enemy = function(x, y) {
	this.x = x;
	this.y = y;
	this.speed = Math.floor(Math.random() * (400 - 100)) + 100; // Random speed between 100 and 400
	this.sprite = 'images/enemy-bug.png';
};
// Update the enemy's position
Enemy.prototype = {
	update: function(dt) {
		this.x += this.speed * dt; // Multiply horizontal speed by dt parameter
		if (this.x > 510) this.delete(); // When an enemy reaches the end of the screen
	},
	render: function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	},
	create: function() {
		var rows = [60,144,228];
		var enemy = new Enemy(-100, rows[Math.floor(Math.random() * 3)]);
		allEnemies.push(enemy);
	},
	delete: function() {
		for (var i=0; i<allEnemies.length; i++) {
			if (allEnemies[i] === this) {
				allEnemies.splice(i,1);
				this.create();
			}
		}
	}
};



// Player class
var Player = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = 'images/char-pink-girl.png';
};
// Update the enemy's position
Player.prototype = {
	update: function(dt) {},
	// Draw the player on the screen
	render: function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	},
	updateScore: function(points) {
		score += points;
		document.getElementById('score').innerHTML = score;
	},
	// Update the enemy's position with the arrow keys
	handleInput: function(key) {
		switch(key) {
			case 'space':
				play = !play; // Toggle true/false to pause the game
				if (play && crash) {
					window.location.reload(); // Restart the game reloading the page
				}
				// Show/hide 'press space' message
				message = document.getElementById('message'); // Show the message defined in collision()
				message.style.display = message.style.display != 'none' ? 'none' : '';
				break;
			case 'left':
				if (play && this.x > 0) this.x -= 100;
				break;
			case 'up':
				if (play && this.y <= 60 && !crash) { // Player reaches the water and not in 'collision mode'
					this.y = 396;
					this.updateScore(100); // Add 100 points
				} else {
					if (play) this.y -= 84;
				}
				break;
			case 'right':
				if (play && this.x < 400) this.x += 100;
				break;
			case 'down':
				if (play && this.y < 380) this.y += 84;
				break;
		}
	},
	// Check collisions
	checkCollision: function() {
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
				if (playerLeft > enemyLeft && playerLeft < enemyRight) player.collision();
				if (playerRight > enemyLeft && playerRight < enemyRight) player.collision();
			}
		});
	},
	// Collision detected
	collision: function() {
		play = false;
		message.innerHTML = 'FINAL SCORE: ' + score + '<br><br>PRESS SPACE TO<br>PLAY AGAIN';
		message.style.display = '';
		crash = true;
	},
	// Check for gem collection
	checkGemCollected: function() {
		if (player.x == gem.x && player.y == gem.y + 10) {
			player.updateScore(50); // Add 50 points
			gem.x = -100; // Send the gem out of the canvas
			gemInside = false;
		}
	}
};



// Gem class
var Gem = function(x,y) {
	this.x = x;
	this.y = y;
	this.sprite = 'images/Gem Blue.png';
};
Gem.prototype = {
	update: function(dt) {
		timeInside += dt;
		if (timeInside >= 5) { // Disappear after 5 seconds inside the canvas without been collected
			this.x = -100; // 100 pixels out of the canvas
			gemInside = false;
		}
		var insertGem = Math.floor(Math.random() * (400 - 1)) + 1; // 1/400 probability of generating a gem
		if (insertGem == 1 && !gemInside) {
			gemInside = true;
			this.create();
			timeInside = 0;
		}
	},
	// Draw the gem on the screen
	render: function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	},
	create: function() {
		this.x = (Math.floor(Math.random() * 5)) * 100; // Random column
		var rows = [50,134,218];
		this.y = rows[Math.floor(Math.random() * 3)]; // Random row
		var sprites = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
		this.sprite = sprites[Math.floor(Math.random() * 3)]; // Random color sprite
	}
};



// Create 4 enemies
var allEnemies = [];
for (var x=1; x<=4; x++) {
	var enemy = new Enemy();
	enemy.create();
}

// Create player and gem
var player = new Player(200, 396);
// Start score
var score = 0;
player.updateScore(score);
// Creates gem outside canvas
gem = new Gem(-100, 60);

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
