const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const gravity = 0.7;
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const background_pic = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  max_frames: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 150,
    y: 150,
  },
  speed: 10,
  color: "red",
  isenemy: false,
  imageSrc: "./enemy/Idle.png",
  max_frames: 10,
  scale: 3,
  sprites: {
    idle: {
      imageSrc: "./enemy/Idle.png",
      max_frames: 10,
    },
    run: {
      imageSrc: "./enemy/Run.png",
      max_frames: 8,
    },
    jump: {
      imageSrc: "./enemy/Jump.png",
      max_frames: 3,
    },
    fall: {
      imageSrc: "./enemy/Fall.png",
      max_frames: 3,
    },
    attack: {
      imageSrc: "./enemy/Attack3.png",
      max_frames: 8,
    },
    fireball: {
      imageSrc: "./enemy/Attack2.png",
      max_frames: 5,
    },
    takehit: {
      imageSrc: "./enemy/Takehit.png",
      max_frames: 3,
    },
    death: {
      imageSrc: "./enemy/Death.png",
      max_frames: 7,
    },
  },
  attackBox: {
    offset: {
      x: 0,
      y: 0,
    },
    width: 200,
    height: 50,
  },
});

console.log(player);

const enemy = new Fighter({
  position: {
    x: 955,
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
  imageSrc: "./img/kenji/Idle.png",
  max_frames: 4,
  scale: 2.4,
  isenemy: true,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      max_frames: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      max_frames: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      max_frames: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      max_frames: 2,
    },
    attack: {
      imageSrc: "./img/kenji/Attack1.png",
      max_frames: 4,
    },
    fireball: {
      imageSrc: "./img/kenji/Attack2.png",
      max_frames: 4,
    },
    takehit: {
      imageSrc: "./img/kenji/Takehit.png",
      max_frames: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      max_frames: 7,
    },
  },
  attackBox: {
    offset: {
      x: -200,
      y: 0,
    },
    width: 200,
    height: 50,
  },
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

function anime() {
  window.requestAnimationFrame(anime);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background_pic.update();
  shop.update();
  c.fillStyle = 'rgba(255,255,255,0.1)'
  c.fillRect(0,0,canvas.width,canvas.height)
  player.update();
  player.isenemy = false;
  enemy.update();
  enemy.isenemy = true;
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player

  if (keys.a.pressed && player.last_key === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.last_key === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy
  if (keys.ArrowLeft.pressed && enemy.last_key === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.last_key === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
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
    enemy.takeHit();

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
    player.takeHit();
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
    enemy.takeHit();
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
    player.takeHit();
    player.health -= 5;
    document.querySelector("#player").style.width = player.health + "%";
  }
  //End of the game
  if (player.health <= 0 || enemy.health <= 0) {
    result_func({ player, enemy, timer_id });
  }
}
anime();
dec_timer();

window.addEventListener("keydown", (event) => {
  if (!player.dead)
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
    }
  if (!enemy.dead) {
    switch (event.key) {
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
  }
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
