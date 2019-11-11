let campo = document.getElementById("campo");
let frontLife = document.getElementById("front-pokemon-life");
let frontAttack = document.getElementById("front-atack");
let backLife = document.getElementById("back-pokemon-life");
let backAttack = document.getElementById("back-atack");
let charging = false;
let enemyCharging = false;
let energy = document.getElementById("energy-bar");
let enemyEnergy = document.getElementById("enemy-energy-bar");
let quickMove;
let cinematicMove;
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

let pokemon = new Promise((resolve, reject) => {
    readTextFile("../backend/pokemon.json", function(text){
        resolve(JSON.parse(text));
        /*frontLife.value = (data[5].stats.baseStamina*2);
        frontLife.max = (data[5].stats.baseStamina*2);
        backLife.value = (data[5].stats.baseStamina*2);
        backLife.max = (data[5].stats.baseStamina*2);
        pokemon = data;*/
    });
});

let moves = new Promise((resolve, reject) => {
    readTextFile("../backend/move.json", (text) => {
        resolve(JSON.parse(text));
    })
});

let types = new Promise((resolve, reject) => {
    readTextFile("../backend/type.json", (text) => {
        resolve(JSON.parse(text));
    })
});
//usage:
Promise.all([pokemon, moves, types]).then((results) => {
    myPokemon = results[0].find((el) => {
        return el.dex == 472; //383
    });
    enemyPokemon = results[0].find((el) => {
        return el.dex == 249; //487
    });
    getMoves(results[1], myPokemon);
    getMoves(results[1], enemyPokemon);
    frontLife.value = (enemyPokemon.stats.baseStamina*2);
    frontLife.max = (enemyPokemon.stats.baseStamina*2);
    backLife.value = (myPokemon.stats.baseStamina*2);
    backLife.max = (myPokemon.stats.baseStamina*2);
    document.getElementById("front-sprite").src = "https://projectpokemon.org/images/normal-sprite/"+ enemyPokemon.name.toLowerCase() +".gif";
    document.getElementById("back-sprite").src = "https://projectpokemon.org/images/normal-back/"+ myPokemon.name.toLowerCase() +".gif";
    setInterval(() => {
        if (enemyEnergy.value >= (enemyPokemon.cinematicMove.energyDelta*-1) && !charging) {
            enemyCharging = true;
            backLife.value -= Math.floor(0.5 * (enemyPokemon.stats.baseAttack / myPokemon.stats.baseDefense) * (0.7903 / 0.7903) * enemyPokemon.cinematicMove.power) + 1;
            enemyEnergy.value += enemyPokemon.cinematicMove.energyDelta;
            setTimeout(() => {
                enemyCharging = false;
            }, enemyPokemon.cinematicMove.durationMs) 
        }
        else {
            if (!enemyCharging) {
                backAttack.classList.remove("hidden");
                backLife.value -= Math.floor(0.5 * (enemyPokemon.stats.baseAttack / myPokemon.stats.baseDefense) * (0.7903 / 0.7903) * enemyPokemon.quickMove.power) + 1;
                enemyEnergy.value += enemyPokemon.quickMove.energyDelta;
                console.log(enemyEnergy);
            }
        }
    }, enemyPokemon.quickMove.durationMs);
});


campo.addEventListener("click", () => {
    if (!charging) {
        charging = true;
        frontAttack.classList.remove("hidden");
        frontLife.value -= Math.floor(0.5 * (myPokemon.stats.baseAttack / enemyPokemon.stats.baseDefense) * (0.7903 / 0.7903) * myPokemon.quickMove.power) + 1;
        energy.value += myPokemon.quickMove.energyDelta;
        setTimeout(() => {
            frontAttack.classList.add("hidden");
            charging = false;
        }, myPokemon.quickMove.durationMs) 
    }
})

document.getElementById("special-atack").addEventListener("click", () => {
    if (energy.value >= (myPokemon.cinematicMove.energyDelta*-1) && !charging) {
        charging = true;
        frontAttack.classList.remove("hidden");
        frontLife.value -= Math.floor(0.5 * (myPokemon.stats.baseAttack / enemyPokemon.stats.baseDefense) * (0.7903 / 0.7903) * myPokemon.cinematicMove.power) + 1;
        //TODO Agregar el stab, Agregar la debilidad de tipos
        energy.value += myPokemon.cinematicMove.energyDelta;
        setTimeout(() => {
            frontAttack.classList.add("hidden");
            charging = false;
        }, myPokemon.cinematicMove.durationMs) 
    }
});

function getMoves(list, pokemon) {
    pokemon.quickMove = list.find(function (el) {
        return el.id == pokemon.quickMoves[0].id
    })
    pokemon.cinematicMove = list.find(function (el) {
        return el.id == pokemon.cinematicMoves[0].id
    })
}
//Damage = Floor(0.5 * (Attack / Defense) * STAB * Type * Power) + 1