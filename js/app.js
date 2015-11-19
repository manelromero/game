// Enemies our player must avoid
var Enemy = function(x, y) {
	this.x = x;
	this.y = y;
	this.speed = Math.floor(Math.random() * (300 - 160)) + 160;
	this.sprite = 'images/enemy-bug.png';
};
// Update the enemy's position
Enemy.prototype.update = function(dt) {
	// Multiply horizontal speed by dt parameter
	this.x += this.speed * dt;
	// when an enemy reaches the end of the screen
	if (this.x > 510) deleteEnemy(this);
};
// Draw the enemy on the screen
Enemy.prototype.render = function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
var Player = function(x, y) {
	this.x = x;
	this.y = y;
	this.sprite = 'images/char-boy.png';
};
// Update the enemy's position
Player.prototype.update = function(dt) {};
// Draw the player on the screen
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Update the enemy's position with the arrow keys
Player.prototype.handleInput = function(key) {
	var xVar = 0;
	var yVar = 0;
	switch(key) {
	case 'left':
		if(this.x > 0) this.x -= 100;
		break;
	case 'up':
		if(this.y <= 44) {
			this.y = 380;
			updateScore(100);
		} else {
			this.y -= 84;
		}
		//this.y <= 44 ? this.y = 380 : this.y -= 84;
		break;
	case 'right':
		if(this.x < 400) this.x += 100;
		break;
	case 'down':
		if(this.y < 380) this.y += 84;
		break;
	}
}

Player.prototype.checkCollision = function() {
	allEnemies.forEach(function(enemy) {
		if(enemy.x == this.x) {
			console.log('Collision');
		}
	});
}
// Enemies array
var allEnemies = [];
// Create x number of enemies function
function createEnemy(x) {
	for(var i=0; i<x; i++) {
		var row = Math.floor(Math.random() * 3);
		var rows = [60,144,228];
		var enemy = new Enemy(-100, rows[row]);
		allEnemies.push(enemy);
	}
}
// Delete an Enemy object from the array and create another one
function deleteEnemy(enemy) {
	for(var i=0; i<allEnemies.length; i++) {
		if(allEnemies[i] === enemy) {
			allEnemies.splice(i,1);
			createEnemy(1);
    }
  }
}
// Function for updating the score
function updateScore(points) {
	score += points;
	document.getElementById('score').innerHTML = score;
}
// Start score
var score = 0
updateScore(score);
// Finally create player and enemies
createEnemy(4);
var player = new Player(200, 380);
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
		var allowedKeys = {
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down'
		};

		player.handleInput(allowedKeys[e.keyCode]);
});
