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
let typesTable;
let typeEfective;
let enemyInterval;
let debilited = new CustomEvent('debilited');
let myTeam = localStorage.getItem("myTeam");
let enemyTeam = localStorage.getItem("enemyTeam");
let quickMovesMap = new Map(JSON.parse(localStorage.getItem("quickMoves")));
let cinematicMovesMap = new Map(JSON.parse(localStorage.getItem("cinematicMoves")));
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
    readTextFile("data/pokemon.json", function(text){
        resolve(JSON.parse(text));
        /*frontLife.value = (data[5].stats.baseStamina*2);
        frontLife.max = (data[5].stats.baseStamina*2);
        backLife.value = (data[5].stats.baseStamina*2);
        backLife.max = (data[5].stats.baseStamina*2);
        pokemon = data;*/
    });
});

let moves = new Promise((resolve, reject) => {
    readTextFile("data/move.json", (text) => {
        resolve(JSON.parse(text));
    })
});

let types = new Promise((resolve, reject) => {
    readTextFile("data/type.json", (text) => {
        resolve(JSON.parse(text));
    })
});
//usage:
Promise.all([pokemon, moves, types]).then((results) => {
    typesTable = results[2];
    myPokemon = results[0].find((el) => {
        return el.dex == myTeam; //383
    });
    enemyPokemon = results[0].find((el) => {
        return el.dex == enemyTeam; //487
    });
    getMoves(results[1], myPokemon, quickMovesMap.get(myPokemon.dex), cinematicMovesMap.get(myPokemon.dex));
    getMoves(results[1], enemyPokemon, quickMovesMap.get(enemyPokemon.dex), cinematicMovesMap.get(enemyPokemon.dex));
    frontLife.value = (enemyPokemon.stats.baseStamina*2);
    frontLife.max = (enemyPokemon.stats.baseStamina*2);
    backLife.value = (myPokemon.stats.baseStamina*2);
    backLife.max = (myPokemon.stats.baseStamina*2);
    document.getElementById("front-sprite").src = "https://projectpokemon.org/images/normal-sprite/"+ enemyPokemon.name.toLowerCase() +".gif";
    document.getElementById("back-sprite").src = "https://projectpokemon.org/images/normal-back/"+ myPokemon.name.toLowerCase() +".gif";
    enemyInterval = setInterval(() => {
        if (enemyEnergy.value >= (enemyPokemon.cinematicMove.energyDelta*-1) && !charging) {
            backAttack.src = "assets/img/moves/cinematicAtack.png";
            backAttack.classList.remove("hidden");
            enemyCharging = true;
            backLife.value -= Math.floor(0.5 * (enemyPokemon.stats.baseAttack / myPokemon.stats.baseDefense) * (0.7903 / 0.7903) * getStab(enemyPokemon.types, enemyPokemon.cinematicMove.pokemonType) * getEfectiveness(enemyPokemon.cinematicMove.pokemonType, myPokemon.types) * enemyPokemon.cinematicMove.power) + 1;
            if (backLife.value == 0) campo.dispatchEvent(debilited);
            enemyEnergy.value += enemyPokemon.cinematicMove.energyDelta;
            setTimeout(() => {
                enemyCharging = false;
            }, enemyPokemon.cinematicMove.durationMs) 
        }
        else {
            if (!enemyCharging) {
                backAttack.src = "assets/img/moves/quickAtack.png";
                backAttack.classList.remove("hidden");
                setTimeout(() => {
                    backAttack.classList.add("hidden");
                }, 200)
                backLife.value -= Math.floor(0.5 * (enemyPokemon.stats.baseAttack / myPokemon.stats.baseDefense) * (0.7903 / 0.7903) * getStab(enemyPokemon.types, enemyPokemon.quickMove.pokemonType) * getEfectiveness(enemyPokemon.quickMove.pokemonType, myPokemon.types) * enemyPokemon.quickMove.power) + 1;
                if (backLife.value == 0) campo.dispatchEvent(debilited);
                enemyEnergy.value += enemyPokemon.quickMove.energyDelta;
            }
        }
    }, enemyPokemon.quickMove.durationMs);
});


campo.addEventListener("click", () => {
    if (!charging) {
        charging = true;
        frontAttack.src = "assets/img/moves/quickAtack.png";
        frontAttack.classList.remove("hidden");
        frontLife.value -= Math.floor(0.5 * (myPokemon.stats.baseAttack / enemyPokemon.stats.baseDefense) * (0.7903 / 0.7903) * getStab(myPokemon.types, myPokemon.quickMove.pokemonType) * getEfectiveness(myPokemon.quickMove.pokemonType, enemyPokemon.types) * myPokemon.quickMove.power) + 1;
        if (frontLife.value == 0) campo.dispatchEvent(debilited);
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
        frontAttack.src = "assets/img/moves/cinematicAtack.png";
        frontAttack.classList.remove("hidden");
        frontLife.value -= Math.floor(0.5 * (myPokemon.stats.baseAttack / enemyPokemon.stats.baseDefense) * (0.7903 / 0.7903) * getStab(myPokemon.types, myPokemon.cinematicMove.pokemonType) * getEfectiveness(myPokemon.cinematicMove.pokemonType, enemyPokemon.types) * myPokemon.cinematicMove.power) + 1;
        if (frontLife.value == 0) campo.dispatchEvent(debilited);
        energy.value += myPokemon.cinematicMove.energyDelta;
        setTimeout(() => {
            frontAttack.classList.add("hidden");
            charging = false;
        }, myPokemon.cinematicMove.durationMs) 
    }
});

function getMoves(list, pokemon, selectedQuickMove = 0, selectedCinematicMove = 0) {
    //if (quickMovesMap.get(pokemon.dex) != null) {selectedQuickMove = quickMovesMap.get(pokemon.dex)}
    //if (cinematicMovesMap.get(pokemon.dex) != null) {selectedQuickMove = cinematicMovesMap.get(pokemon.dex)}
    //console.log(pokemon.quickMoves);
    //console.log(pokemon.cinematicMoves[selectedCinematicMove]);
    pokemon.quickMove = list.find(function (el) {
        return el.id == pokemon.quickMoves[selectedQuickMove].id
    })
    pokemon.cinematicMove = list.find(function (el) {
        return el.id == pokemon.cinematicMoves[selectedCinematicMove].id
    })
}
//Damage = Floor(0.5 * (Attack / Defense) * STAB * Type * Power) + 1

function getEfectiveness(type, objetiveTypes) {
    let multiplier = 1;
    for (let i = 0; i < objetiveTypes.length; i++) {
        multiplier *= typesTable.find((el) => {
            return el.id == type.id;
        }).damage.find((el) => {
            return el.id == objetiveTypes[i].id;
        }).attackScalar;
    }
    return multiplier;
}

function getStab(pokemonTypes, moveType) {
    if (pokemonTypes.find((el) => {
        return el.id == moveType.id
    })) return 1.2
    return 1;
}

campo.addEventListener("debilited", () => {
    clearInterval(enemyInterval);
    backAttack.classList.add("hidden");
    frontAttack.classList.add("hidden");
    if (frontLife.value == 0) {
        document.getElementById("front-sprite").src = "";
        alert("You win!");
        window.location.pathname = "/PokemonScript";
    }
    else {
        document.getElementById("back-sprite").src = "";
        alert("You lose :(");
        window.location.pathname
        window.location.pathname = "/PokemonScript";
    }
});