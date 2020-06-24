// !ПОЛУЧАЕМ ВСЕ ДИВЫ
const BLOCKS_DIV = document.querySelectorAll('.game div');
// ! ДЛИНА ОДНОГО РЯДА
const COUNT_ROW = Math.sqrt(BLOCKS_DIV.length);
// !ВЫЧЕСЛЯЕМ ИНДЕКС ИГРОКА СНИЗУ
let PLAEYR_INDEX = Math.round(BLOCKS_DIV.length - (COUNT_ROW / 2));
// !СОЗДАЕМ ПОЛЕ ВРАГОВ
const INDEX_ENEMY = [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76];
// !ДОБОВЛЯЕМ УБИТЫХ ВРАГОВ
const KILL_ENEMY = [];
// ! НАШ ШАГ ДЛЯ ВРАГОВ
let STEP = 1;
// ! Счет игры
let SCORE_COUNT = 1;

(function () {
   BLOCKS_DIV[PLAEYR_INDEX].classList.add("player");
   for (let enemy of INDEX_ENEMY) {
      BLOCKS_DIV[enemy].classList.add('enemy');
   }
})();
const movePlayer = (e) => {
   BLOCKS_DIV[PLAEYR_INDEX].classList.remove("player");
   if (e.code === 'ArrowLeft' && PLAEYR_INDEX > BLOCKS_DIV.length - COUNT_ROW) {
      PLAEYR_INDEX--;
   }
   if (e.code === 'ArrowRight' && PLAEYR_INDEX < BLOCKS_DIV.length - 1) {
      PLAEYR_INDEX++;
   }
   BLOCKS_DIV[PLAEYR_INDEX].classList.add("player");
}
document.addEventListener('keydown', movePlayer);

function delegirovan(){
   let wrapp = document.querySelectorAll('.wrapper');
   for (let i = 0; i < wrapp.length; i++) {
      movePlayerArrow(wrapp[i]);
   }
}
delegirovan();
function movePlayerArrow(Domelem) {
   Domelem.addEventListener('click', function(e){
      BLOCKS_DIV[PLAEYR_INDEX].classList.remove("player");
      if (e.target.className == 'fas fa-arrow-alt-circle-left'){
         if(PLAEYR_INDEX > BLOCKS_DIV.length - COUNT_ROW){
            PLAEYR_INDEX--;
         }
      }
      if (e.target.className == 'fas fa-arrow-alt-circle-right'){
         if (PLAEYR_INDEX < BLOCKS_DIV.length - 1){
            PLAEYR_INDEX++;
         }
      }
      BLOCKS_DIV[PLAEYR_INDEX].classList.add("player");
   });
}

const moveEnemies = () => {
   const leftBlocksEnemies = INDEX_ENEMY[0] % COUNT_ROW === 0;
   const RigthBlocksEnemies = INDEX_ENEMY[INDEX_ENEMY.length - 1] % COUNT_ROW === COUNT_ROW - 1;
   if ((leftBlocksEnemies && STEP === -1) || (RigthBlocksEnemies && STEP === 1)) {
      STEP = COUNT_ROW;
   } else if (STEP === COUNT_ROW) {
      STEP = leftBlocksEnemies ? 1 : -1;
   }
   INDEX_ENEMY.forEach(item => {
      BLOCKS_DIV[item].classList.remove('enemy');
   });
   for (let i = 0; i < INDEX_ENEMY.length; i++) {
      INDEX_ENEMY[i] += STEP;
   }
   INDEX_ENEMY.forEach((item, index) => {
      if (!KILL_ENEMY.includes(index)) {
         BLOCKS_DIV[item].classList.add('enemy');
      }
   });
   if (BLOCKS_DIV[PLAEYR_INDEX].classList.contains('enemy')) {
      GameResalt();
      EndGame();
      return;
   }
   for (let i = 0; i < INDEX_ENEMY.length; i++) {
      if (INDEX_ENEMY[i] > BLOCKS_DIV.length - COUNT_ROW) {
         GameResalt();
         EndGame();
         return;
      }
   }
   if (KILL_ENEMY.length === INDEX_ENEMY.length) {
      GameResalt();
      EndGame();
      return;
   }
   setTimeout(moveEnemies, 400);
};
moveEnemies();

const Fire = (e) => {
   if (e.which === 1 && e.target.classList.contains('enemy')) {
      let bulletIndex = PLAEYR_INDEX;
      const Flybullet = () => {
         BLOCKS_DIV[bulletIndex].classList.remove('bullet');
         bulletIndex -= COUNT_ROW;
         BLOCKS_DIV[bulletIndex].classList.add('bullet');
         if (bulletIndex < COUNT_ROW) {
            setTimeout(() => {
               BLOCKS_DIV[bulletIndex].classList.remove('bullet');
            }, 50);
            return;
         }

         if (BLOCKS_DIV[bulletIndex].classList.contains('enemy')) {
            BLOCKS_DIV[bulletIndex].classList.remove('bullet');
            BLOCKS_DIV[bulletIndex].classList.remove('enemy');
            const indexKILL_ENEMY = INDEX_ENEMY.indexOf(bulletIndex);
            KILL_ENEMY.push(indexKILL_ENEMY);
            Score(SCORE_COUNT++);
            return;
         }
         setTimeout(Flybullet, 50);
      }
      Flybullet();
   }
}
document.addEventListener('click', Fire);

function EndGame() {
   document.removeEventListener('click', Fire);
   document.removeEventListener('keydown', movePlayer);
}
function Score(SCORE_COUNT) {
   let score = document.querySelector('.Score__text');
   score.textContent = `killed enemies :  ${SCORE_COUNT}`;
}

function GameResalt() {
   const wrapp = document.querySelector('.wrapper');
   const Popap = document.createElement('div');
   const Modal = document.createElement('div');
   const Text = document.createElement('p');
   const Play_btn = document.createElement('button');
   const Exit_btn = document.createElement('button');
   Popap.className = 'Popap';
   Modal.className = 'Popap__Modal';
   Play_btn.className = 'Play__btn';
   Exit_btn.className = 'Exit__btn';
   Text.className = 'Popap__Text';
   Play_btn.textContent = 'play';
   Exit_btn.textContent = 'EXIT';
   wrapp.append(Popap);
   Popap.append(Modal);
   Modal.append(Text);
   Text.append(Play_btn, Exit_btn);
   if (KILL_ENEMY.length === INDEX_ENEMY.length) {
      Text.textContent = `You WIN.`;
      Modal.classList.add('active');
      Text.append(Play_btn, Exit_btn);
   } else {
      Text.textContent = `You lose.`;
      Text.append(Play_btn, Exit_btn);
   }
   Play_btn.addEventListener('click', () => {
      location.reload();
   });
   Exit_btn.addEventListener('click', () => {
      window.close();
   });
}
