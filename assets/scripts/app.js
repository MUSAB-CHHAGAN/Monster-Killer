/** @format */

const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 21;
const HEAL_VALUE = 15;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValue() {
  const enterdValue = prompt("max life of monster and player is", "100");

  const parsedValue = +enterdValue;
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "invalid user input" };
  }
  return parsedValue;
}

let chosenMaxLife;
try {
  chosenMaxLife = getMaxLifeValue();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert("enterd something wrong?");
}

let curretMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry;
  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: "MONSTER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: "MONSTER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  }
  battleLog.push(logEntry);
}

function reset() {
  curretMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  //  const strongAttack=dealMonsterDamage(STRONG_ATTACK_VALUE);
  //         curretMonsterHealth-=strongAttack;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    curretMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("bonus life saved you");
  }
  if (curretMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("you won");
    reset();
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "you won",
      curretMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && curretMonsterHealth > 0) {
    alert("you lost");
    reset();
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "monster won",
      curretMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && curretMonsterHealth <= 0) {
    alert("you have a draw");
    reset();
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "you have a draw",
      curretMonsterHealth,
      currentPlayerHealth
    );
  }
}
if (curretMonsterHealth <= 0 || currentPlayerHealth <= 0) {
  reset();
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  const damage = dealMonsterDamage(maxDamage);
  curretMonsterHealth -= damage;
  writeToLog(logEvent, damage, curretMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}
function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (curretMonsterHealth >= chosenMaxLife) {
    alert("you cant heal more than initial heaths");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += HEAL_VALUE;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    curretMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  let i = 0;

  for (const logEntry of battleLog) {
    console.log(`${i}`);
    for (const parameter in logEntry) {
      console.log(`${parameter}===> ${logEntry[parameter]}`);
    }
    lastLoggedEntry = i;

    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
