// Generic object with common functions
var Entity = function(x, y, sprite, speed) {
	this.x = x;
	this.y = y;
	this.sprite = sprite;
	this.speed = speed;
};
Entity.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Enemies
var allEnemies = [];
var enemy = new Entity();
// Update the enemy's position
enemy.update = function(dt) {
	allEnemies.forEach(function(bug) {
		bug.x += bug.speed * dt; // Multiply horizontal speed by dt parameter
		if (bug.x > 510) enemy.delete(bug); // When an enemy reaches the end of the canvas
	});
};
// Create enemy
enemy.create = function() {
	var rows = [60,144,228];
	var speed = Math.floor(Math.random() * (400 - 100)) + 100; // Random speed between 100 and 400
	var enemy = new Entity(-100, rows[Math.floor(Math.random() * 3)], 'images/enemy-bug.png', speed);
	allEnemies.push(enemy);
};
// Delete enemy when outside the canvas
enemy.delete = function(bug) {
	for (var i=0; i<allEnemies.length; i++) {
		if (allEnemies[i] === bug) {
			allEnemies.splice(i,1);
			this.create();
		}
	}
};



// Player
var player = new Entity(200, 396, 'images/char-pink-girl.png');
player.play = false;
player.crash = false;
// Particular functions for player
// Update the enemy's position with the arrow keys
player.handleInput = function(key) {
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
// Check collisions
player.checkCollision = function() {
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
};
// Collision detected
player.collision = function() {
	this.play = false;
	message.innerHTML = 'FINAL SCORE: ' + score + '<br><br>PRESS SPACE TO<br>PLAY AGAIN';
	message.style.display = '';
	this.crash = true;
};
// Check for gem collection
player.checkGemCollected = function() {
	if (player.x == gem.x && player.y == gem.y + 10) {
		player.updateScore(50); // Add 50 points
		gem.x = -100; // Send the gem out of the canvas
		gem.inside = false;
	}
};
// Update score
player.updateScore = function(points) {
	score += points;
	document.getElementById('score').innerHTML = score;
};


// Gem
// Create gem outside the canvas
var gem = new Entity(-100, 60, 'images/Gem Blue.png');
gem.inside = false;
gem.timeInside = 0;
gem.update = function(dt) {
	this.timeInside += dt;
	if (this.timeInside >= 5) { // Disappear after 5 seconds inside the canvas without been collected
		this.x = -100; // 100 pixels out of the canvas
		this.inside = false;
	}
	var insertGem = Math.floor(Math.random() * (400 - 1)) + 1; // 1/400 probability of generating a gem
	if (insertGem == 1 && !gem.inside) {
		this.inside = true;
		this.create();
		this.timeInside = 0;
	}
};
gem.create = function() {
	this.x = (Math.floor(Math.random() * 5)) * 100; // Random column
	var rows = [50,134,218];
	this.y = rows[Math.floor(Math.random() * 3)]; // Random row
	var sprites = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
	this.sprite = sprites[Math.floor(Math.random() * 3)]; // Random color sprite
};



// Create 4 enemies
for (var x=1; x<=4; x++) {
	enemy.create();
}
// Initiate score
var score = 0;
player.updateScore(score);

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
