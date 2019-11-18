# PokémonScript
A simple battle simulator of Pokémon Go in the web developed in vanilla javascript for Development of Client Web Applications project created by Iván Pérez Fita

## Motivation

Since 2016 we are lucky to be able to play the great mobile game Pokémon Go, game of which I am currently quite active (whatever my little time leaves me). 
From time to time I need to somehow test the abilities of some Pokémon to know if they will help me fight. 
This game can help me test some Pokémon that within the Pokémon Go itself I can not prove by the circumstance that is for example that has not yet caught.
Thanks to the fact that this game accurately replicates the way to calculate the damage that Pokémon Go uses, I can verify that Pokémon will be useful to me in the future or Try options that I have and I did not realize its potential.
Also thanks to the way in which the game is programmed I can simulate an raid of a Pokémon Go mode in which you face a Pokémon with a lot of life and normally you need several players to defeat it and with this tool you can check the effectiveness that each Pokémon would have individually.

## Objetives

The objectives he wanted to reach was the simulation of 1 vs 1, a selection with a large number of Pokémon options to choose from all there are.


Other objectives that I would like to reach if I continue this project in the future would be the implementation of teams of up to 6 Pokémon, the simulation of raids, add all the existing Pokémon.

## Playability

In the index page you see a list of card of all Pokémon to the 4 generation adding Meltan and Melmetan. In this card you can select witch moves you want to use in battle and select who Pokémon you will use or who Pokémon you want deal.
When you choose the 2 Pokémon the page shows a link to the battle page. In the battle page you can see a 2 life bars the enemy and your life bar, a animated gif for the 2 Pokémon, a background, a charge bar and a button with the text Charged Attack.
To attack the enemy pokémon you need click in the background and you will see a atack animation. When you attack clicking the background the Pokémon use his fast move and thanks to that it will be accumulating energy. 
When you have the necessary amount of energy you can use the charged movement by pressing the button with its name. When you use it you will see a different attack animation and do a lot of damage. When the attack is over you will be able to make quick attacks again to recharge energy.
The different charged attacks will ask for a different amount of energy to be able to perform. This amount of energy will vary between 33, 50 and 100. The maximum energy that a Pokémon can have is 100. Rapid attacks will give a specific amount of energy each time it is used varying depending on the attack used.
When the life of one of the Pokémon reaches 0 a message of victory or defeat will be displayed and the user will be redirected to the main page.

## Technical aspects

The game is developed in vanilla javascript. To have all the necessary data, json files are being used with all the necessary information. These json files come directly from the data that Pokémon Go uses to function. In order to read these jsons through javascript, I needed the web to be on a server, so this is uploaded to githubpages.
Because of Javascript asynchrony, some functions that used the Json data were executed before getting the data, so use a promise to wait for the data to be read.

The damage formula is: Damage = Floor(0.5 * (Attack / Defense) * STAB * Type * Power) + 1

The damage is calculated using the attack of the Pokémon that attacks the defense that will receive the attack, the stab that increases the power if the movement is of the same type as the attacking Pokémon, the weakness of types increasing or decreasing the power Depending on what type of weakness you have, for example, the power of a water attack increases if you use it in front of a fire Pokémon and finally use the base power that the movement used has.
In the battle, 2 instances of main objects are used, that of your Pokémon and that of the rival. These instances are formed using the json data.
For attacks by the opponent, an interval is used that will be repeated using the time values ​​of the opponent's rapid attack.
When an attack is being carried out, either fast or charged, the attack function is blocked by means of a variable so that it is necessary to wait for the attack to end in order to perform another.
At the moment that 1 of the Pokémon loses its whole life an event is launched on the field called debilited that ends the battle and sends the user to the main page.
On the main page you can also access the jsons to read the data of all the Pokémon. To avoid performing the for that runs through all the Pokémon the html generated by the for is stored in localstorage.
For the selection of pokémon 2 items are used in localstore that store the number of the dex of the rival pokémon and yours.
For the movements 2 items of localstorage are used that store a json with the data of a map that contains the dex of the Pokémon and the number in the array of the movement. A map is used for repeated attacks and another for attacks loaded in this way if you select that you want to use for example dragon claw with Charizard whenever you keep this map in localstorage when you enter to fight and your Pokémon is Charizard this will have the dragon claw attack . This will remain until you delete the item in localstorage or change the movement on the main page.

## Conclusion

The main objectives they were looking for are fulfilled since I am able to accurately emulate the battles of Pokémon Go. I would like to be able to implement all the functions that I have commented previously and as the code is currently performed, I am able to do it. Regarding the design, the simulator could be improved but I am very satisfied with how the selection page has been showing the Pokémon as selectable cards.

To play the game you must access [here](https://zar21.github.io/PokemonScript/).