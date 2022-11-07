const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const gravity = 0.7;
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor({ position, velocity, color, offset, speed }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.last_key;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.fireball = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 20,
      height: 20,
      speed,
    };
    this.color = color;
    this.isAttacking;
    this.isfireball;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attak animation
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
    if (this.isfireball) {
      c.fillStyle = "orange";
      c.fillRect(
        this.fireball.position.x,
        this.fireball.position.y,
        this.fireball.width,
        this.fireball.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;

    //fireball
    if (this.isfireball) {
      this.fireball.position.x += this.fireball.speed;
      this.fireball.position.y = this.position.y + 50;
    } else {
      this.fireball.position.x = this.position.x;
      this.fireball.position.y = this.position.y + 50;
    }
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
  fireball_att() {
    console.log("firball done");
    this.isfireball = true;
    setTimeout(() => {
      this.isfireball = false;
    }, 1000);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  speed: 10,
  color: "red",
});

console.log(player);

const enemy = new Sprite({
  position: {
    x: 975,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
  },
  speed: -10,
  color: "blue",
});
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function collision({ p1, p2 }) {
  return (
    p1.attackBox.position.x + p2.attackBox.width >= p2.position.x &&
    p1.attackBox.position.x <= p2.position.x + p2.width &&
    p1.attackBox.position.y + p1.attackBox.height >= p2.position.y &&
    p1.attackBox.position.y <= p2.position.y + p2.height
  );
}
function collision_ball({ p1, p2 }) {
  return (
    p1.fireball.position.x + p2.fireball.width >= p2.position.x &&
    p1.fireball.position.x <= p2.position.x + p2.width &&
    p1.fireball.position.y + p1.fireball.height >= p2.position.y &&
    p1.fireball.position.y <= p2.position.y + p2.height
  );
}

function anime() {
  window.requestAnimationFrame(anime);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player
  if (keys.a.pressed && player.last_key === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.last_key === "d") {
    player.velocity.x = 5;
  }

  //enemy
  if (keys.ArrowLeft.pressed && enemy.last_key === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.last_key === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //sucessfull attack
  if (
    collision({
      p1: player,
      p2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    player.isfireball = false;
    enemy.health -= 5;
    console.log(
      enemy.position.y,
      player.attackBox.position.y + player.attackBox.height
    );
    document.querySelector("#enemy").style.width = enemy.health + "%";
  }
  if (
    collision({
      p1: enemy,
      p2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    enemy.isfireball = false;
    player.health -= 5;
    document.querySelector("#player").style.width = player.health + "%";
  }
  //fireball player
  if (
    collision_ball({
      p1: player,
      p2: enemy,
    }) &&
    player.isfireball
  ) {
    player.isfireball = false;
    enemy.health -= 5;
    document.querySelector("#enemy").style.width = enemy.health + "%";
  }
  if (
    collision_ball({
      p1: enemy,
      p2: player,
    }) &&
    enemy.isfireball
  ) {
    enemy.isfireball = false;
    player.health -= 5;
    document.querySelector("#player").style.width = player.health + "%";
  }
  //End of the game
  if(player.health<=0 || enemy.health<=0){
    result_func({player,enemy,timer_id})
  }





}
anime();
let timer = 60;
let timer_id 

function result_func({player,enemy,timer_id}){
    clearTimeout(timer_id)
    document.querySelector("#result").style.display = "flex";
    if (player.health === enemy.health) {
      document.querySelector("#result").innerHTML = "Tie";
    } else if (player.health >= enemy.health) {
      document.querySelector("#result").innerHTML = "Player Won";
    } else if (player.health <= enemy.health) {
      document.querySelector("#result").innerHTML = "Enemy Won";
    }
}



function dec_timer() {
  if (timer > 0) {
    timer--;
    timer_id = setTimeout(dec_timer, 1000);
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer == 0) {
    result_func({enemy,player})
  }
}
dec_timer();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.last_key = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.last_key = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;
    case "q":
      player.fireball_att();
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.last_key = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.last_key = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
    case "Shift":
      enemy.fireball_att();
  }
  console.log(event.key);
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
