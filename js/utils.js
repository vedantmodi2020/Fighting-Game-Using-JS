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

let timer = 60;
let timer_id 

function result_func({player,enemy,timer_id}){
    clearTimeout(timer_id)
    document.querySelector("#result").style.display = "flex";
    if (player.health === enemy.health) {
      document.querySelector("#result").innerHTML = "<h1>Tie</h1>";
    } else if (player.health >= enemy.health) {
      document.querySelector("#result").innerHTML = "<h1>Player 1 Won</h1>";
    } else if (player.health <= enemy.health) {
      document.querySelector("#result").innerHTML = "<h1>Player 2 Won</h1>";
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