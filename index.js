let cartas = document.querySelector(".cartas");
let cartasHtml = "";
let number;
let quickMoves;
let cinematicMoves;
let secondType;
let battleLink = document.getElementById("battle");
let pokemonHtml = localStorage.getItem("pokemonHtml");
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
if (pokemonHtml != null) {
    cartas.innerHTML = pokemonHtml;
}
else {
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

    Promise.all([pokemon, moves, types]).then((results) => {
        for (let i = 0; i < results[0].length; i++) {
            quickMoves = "";
            cinematicMoves = "";
            secondType = "";
            if (results[0][i].types.length == 2)
                secondType = `<img src='assets/img/${results[0][i].types[1].name.toLowerCase()}.png' class='tipo secundario'>`
            for (let j = 0; j < results[0][i].quickMoves.length; j++)
                quickMoves += `<p onclick="selectQuickMove(${results[0][i].dex}, ${j})">${results[0][i].quickMoves[j].name}</p>`
            for (let j = 0; j < results[0][i].cinematicMoves.length; j++)
                cinematicMoves += `<p onclick="selectCinematicMove(${results[0][i].dex}, ${j})">${results[0][i].cinematicMoves[j].name}</p>`
            cartasHtml += `<div id='${results[0][i].dex}' class='carta ${results[0][i].types[0].name.toLowerCase()}'>
            <div class='imagen'>
                <h1>${results[0][i].name}</h1>
                <img src='assets/img/${results[0][i].types[0].name.toLowerCase()}.png' class='tipo'>
                
                <div class='fotoCarta'>
                <img src='assets/img/Pokemon/${results[0][i].dex}.png'>
                ${secondType}
                </div>
            </div>
        
            <div class='info'>
                <div class='movimientos'>
                    <h4>Movimientos Rapidos</h4>
                    ${quickMoves}
                    <h4>Movimientos Cargados</h4>
                    ${cinematicMoves}
                </div>
                
            </div>
            <button class="add" onclick="addPokemon(${results[0][i].dex})">I want play with this Pokémon</button>
            <button class="addEnemy" onclick="addEnemyPokemon(${results[0][i].dex})">I want battle vs this Pokémon</button>
        </div>`
        }
        cartas.innerHTML = cartasHtml;
        localStorage.setItem("pokemonHtml", cartasHtml);
    });
}
function addPokemon(dex) {
    localStorage.setItem("myTeam", dex)
    checkPlay()
}

function addEnemyPokemon(dex) {
    localStorage.setItem("enemyTeam", dex)
    checkPlay()
}

function selectQuickMove(pokemon, number) {
    let quickMoves = new Map(JSON.parse(localStorage.getItem("quickMoves")))
    if (quickMoves == null) {
        quickMoves = new Map()
    }
    quickMoves.set(pokemon, number);
    localStorage.setItem("quickMoves", JSON.stringify(Array.from(quickMoves)))
}

function selectCinematicMove(pokemon, number) {
    let cinematicMoves = new Map(JSON.parse(localStorage.getItem("cinematicMoves")))
    if (cinematicMoves == null) {
        cinematicMoves = new Map()
    }
    cinematicMoves.set(pokemon, number);
    localStorage.setItem("cinematicMoves", JSON.stringify(Array.from(cinematicMoves)))
}
function checkPlay() {
    if (localStorage.getItem("myTeam") != null && localStorage.getItem("enemyTeam") != null) {
        battleLink.classList.remove("hidden");
    }
}
checkPlay()