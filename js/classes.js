class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    max_frames = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.max_frames = max_frames;
    this.frames_current = 0;
    this.framesElapsed = 0;
    this.frameHold = 5;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      (this.frames_current * this.image.width) / this.max_frames,
      0,
      this.image.width / this.max_frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.max_frames) * this.scale,
      this.image.height * this.scale
    );
  }

  draw_fireball() {
    if (this.isenemy) {
      this.image1 = new Image();
      this.image1.src = "./reverse.png";
      c.drawImage(
        this.image1,
        this.fireball.position.x,
        this.fireball.position.y-10,
        this.image1.width*2,
        this.image1.height*2
      );
    } else {
      this.image1 = new Image();
      this.image1.src = "./fireball/FB001.png";
      c.drawImage(
        this.image1,
        this.fireball.position.x,
        this.fireball.position.y-10,
        this.image1.width*2,
        this.image1.height*2
      );
    }
  }

  animateframes() {
    this.framesElapsed++;
    if (this.framesElapsed % this.frameHold === 0) {
      if (this.frames_current < this.max_frames - 1) {
        this.frames_current++;
      } else {
        this.frames_current = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateframes();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color,
    speed,
    imageSrc,
    scale = 1,
    max_frames = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {
        width: undefined,
        height: undefined,
      },
    },
  }) {
    super({
      position,
      imageSrc,
      scale,
      max_frames,
      offset,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.last_key;
    this.frames_current = 0;
    this.framesElapsed = 0;
    this.frameHold = 5;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.fireball = {
      position: {
        x: this.position.x + 10,
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
    this.isenemy;
    this.health = 100;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }
  attack() {
    this.switchSprite("attack");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
  fireball_att() {
    this.switchSprite("fireball");
    this.isfireball = true;
    setTimeout(() => {
      this.isfireball = false;
    }, 1000);
  }

  takeHit() {
    this.health -= 5;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takehit");
    }
  }

  update() {
    this.draw();
    if (!this.dead) {
      this.animateframes();
    }
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    // c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;

    //fireball
    if (this.isfireball) {
      this.fireball.position.x += this.fireball.speed;
      this.fireball.position.y = this.position.y + 70;
      this.draw_fireball();
      this.animateframes();
    } else {
      this.fireball.position.x = this.position.x;
      this.fireball.position.y = this.position.y + 70;
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {

      if (this.frames_current === this.sprites.death.max_frames -1) {this.dead=true}
      return;
    }
    if (
      this.image === this.sprites.attack.image &&
      this.frames_current < this.sprites.attack.max_frames - 1
    ) {
      return;
    }
    if (
      this.image === this.sprites.takehit.image &&
      this.frames_current < this.sprites.takehit.max_frames - 1
    ) {
      return;
    }
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.max_frames = this.sprites.idle.max_frames;
          this.frames_current = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.max_frames = this.sprites.run.max_frames;
          this.frames_current = 0;
        }
        break;
      case "jump":
        if (this.jump !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.max_frames = this.sprites.jump.max_frames;
          this.frames_current = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.max_frames = this.sprites.fall.max_frames;
          this.frames_current = 0;
        }
        break;
      case "attack":
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.max_frames = this.sprites.attack.max_frames;
          this.frames_current = 0;
          console.log(this.position.y + this.height, this.position.y);
        }
        break;
      case "takehit":
        if (this.image !== this.sprites.takehit.image) {
          this.image = this.sprites.takehit.image;
          this.max_frames = this.sprites.takehit.max_frames;
          this.frames_current = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.max_frames = this.sprites.death.max_frames;
          this.frames_current = 0;
        }
        break;
      case "fireball":
        if (this.image !== this.sprites.fireball.image) {
          this.image = player.sprites.fireball.image;
          this.max_frames = player.sprites.fireball.max_frames;
          this.frames_current = 0;
        }
        break;
    }
  }
}
