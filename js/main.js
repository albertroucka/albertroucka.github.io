const elementBody = document.getElementById("custom-body");
const elementMap = document.getElementById("custom-map-container");
const elementPin = document.getElementById("custom-btn-container");
const elementCorrect = document.getElementById("custom-btn-container2");
const elementDescription = document.getElementById("map-desctiption");
const divTextAnswer = document.getElementById("custom-text-input");
const elementTextAnswer = document.getElementById("location-input-text");
const elementConfirm = document.getElementById("map-location-submit");

const type = document.getElementById("js-start").getAttribute("gameType");
const difficulty = document.getElementById("js-start").getAttribute("gameDifficulty");
const nickname = document.getElementById("js-start").getAttribute("playerNickname");

const players = []; var currentLocation; var state; var round; var score; var usedLocations = [];

class Location {
    constructor(name, type, coordinateX, coordinateY, description) {
      this.name = name;
      this.type = type;
      this.coordinateX = coordinateX;
      this.coordinateY = coordinateY;
      this.description = description;
    }
}

class Player {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}

/*function getAllLocations()
{
    return [
        new Location("Strakonice", "Město", 49.26950, 13.90641, "Strakonice jsou město na soutoku Otavy a Volyňky. Žije zde 22 583 obyvatel. Na rozdíl od mnoha měst v Čechách a na Moravě nebyly Strakonice založeny jako královské město, ale vznikaly postupným slučováním čtyř menších osad: Strakonic, Bezděkova, Žabokrt a Lomu, které se spojily v poddanské město Strakonice."), 
        new Location("Kralupy nad Vltavou", "Město", 50.24169, 14.31016, "Bude doplněno."), 
        new Location("Hrad Kost", "Hrad", 50.49020, 15.13520, "Zachovalý pevný gotický hrad, jehož založení se datuje do 2. poloviny 14. století. Po třicetileté válce unikl osudu jiných hradů určených k likvidaci, od poloviny 18. století však pustnul. Hrad patří k těm, jejichž výrazná silueta se nezapomíná, na Kosti především díky typické čtyřhranné věži."), 
        new Location("Dolní Morava", "Obec", 50.12242, 16.79969, "Dolní Morava je malá obec s 421 obyvateli. Obec je známým horským lyžařským střediskem. Část obce náleží do Národní přírodní rezervace Králický Sněžník, a právě ten je dominantou zdejšího kraje. Od roku 2022 se také v její blízkosti nachází nejdelší vistutý most pro pěší na světe."), 
        new Location("Havířov", "Město", 49.78049, 18.43073, "Bude doplněno."), 
        new Location("Lednice", "Obec",48.80002, 16.80350, "Lednice je obec se 2255 obyvateli, která je ze severu obtékána řekou Zámeckou Dyjí. Zdejší lichtenštejnský zámek s rozsáhlým parkem patří mezi nejvyhledávanější turistické destinace v celém Česku, spolu s Valticemi je centrem Lednicko-valtického areálu."),
        new Location("Propast Macocha", "", 49.37324, 16.72982, "Propast hluboká 138 metrů vznikla zřícením stropu velké jeskyně. Její horní část je dlouhá 174 metrů a široká 76 metrů. Jako první sestoupil do propasti mnich Lazar Schopper v roce 1723. Na okraji propasti najdete dva vyhlídkové můstky. Na dně se nachází významná botanická lokalita."),
        new Location("Luhačovice", "Město", 49.09982, 17.75747, "Lázeňské město leží v malebném údolí chráněné krajinné oblasti Bílé Karpaty. Unikátní léčivé prameny činí z Luhačovic špičkové léčebné lázně v celoevropském měřítku. Specializují se na lázeňskou léčbu onemocnění dýchacích cest. Nejznámějším léčivým pramenem je Vincentka."),
        new Location("Sněžka", "Hora", 50.73597, 15.73966, "Sněžka se nachází ve východní části Krkonoš na Hraničním hřebenu. Přes její vrchol prochází česko-polská státní hranice. První v historii zaznamenaný výstup je z roku 1456, kdy jistý Benátčan hledal v horách drahé kamení. Název Sněžka pochází z 19. století, je odvozen od pojmenování Sněžná – jako „sněhem pokrytá“."),
        new Location("Máchovo jezero", "Jezero", 50.58349, 14.64984, "Největší umělá vodní plocha (278 ha) Máchova kraje byla založena jako Velký rybník císařem Karlem IV. v roce 1367. Nachází se v nadmořské výšce 266 m. Díky krajině, ve které je zasazeno, je dnes vyhledávaným turistickým cílem.")
    ];
}*/

function getAllJSONLocations()
{
    const locations = [];

    fetch("/database/Basic.json")
        .then(response => response.json())
        .then(data => data.forEach(element => { console.log(element.Name); locations.push(new Location(element.Name, element.Type, element.CoordinateX, element.CoordinateY, element.Description)); }))
        .catch(error => console.error('Error fetching JSON:', error));

    return locations;
}

//Spuštění/začátek
console.log(type);
players.push(new Player(nickname, 0));
players.forEach(refreshPlayer);
const locations = getAllJSONLocations();
locations.forEach(element => { console.log(element) });
$('.custom-btn-container').draggable();
round = 0;
setTimeout(() => { elementBody.style.visibility = "visible"; startRound(); }, 100);
getCurrentBrowserZoom();
getCurrentBrowserSize();
//konec začátku

function startRound()
{
    currentLocation = getNewLocation();
    usedLocations.push(currentLocation);
    round++; elementMap.textContent = "Kolo " + round;
    divTextAnswer.style.visibility = "visible";
    $('.custom-btn-container').draggable("enable");

    if (type == "anagrams") {
        showAllLetters(mixedLetters(currentLocation.name));
    } else if (type == "flashing-letters") {
        flashingLetters(currentLocation.name);
    } else {
        alert("Při spouštění hry došlo k chybě!");
        window.location.href="index.html";
    }
}

function getNewLocation()
{
    var check = "true";
    console.log(check);
    while(check == "true")
    {
        check = "false";
        var quest = locations[Math.floor(Math.random()*locations.length)];
        usedLocations.forEach(element => { console.log("Dvojice: " + element.name + " a " + quest.name); if(element.name == quest.name) { check = "true"; } });
        console.log(check);
    }
    console.log(check);
    return quest;
}

function refreshPlayer(item, index)
{
    let playerName= document.getElementById("player" + index + "-nickname");
    let playerScore = document.getElementById("player" + index + "-score");
    console.log("player" + index + "-nickname");
    playerName.textContent = item.name;
    playerScore.textContent = item.score;
}

function changePlayerScore(playerID, score)
{
    let playerScore = document.getElementById("player" + playerID + "-score");
    playerScore.textContent = parseInt(playerScore.textContent) + score;
    players[playerID].score = parseInt(playerScore.textContent)
    players[playerID] = new Player(players[playerID].name, playerScore.textContent);
}

function showAllLetters(location)
{
    let i = 0;

    while(i < location.length)
    {
        let letter = document.getElementById("letter" + i);

        if(location[i] != " ")
        {
            letter.textContent = location[i].toUpperCase();
            letter.style.visibility = "visible";
        }

        i++;
    }
}

function mixedLetters(location)
{
    state = "guessing";
    let final = "";

    while(location.length > 0)
    {
        let result = location.indexOf(" ");
        if(result > 0)
        {
            const part = location.split(" "); let i = 0;
            while(part.length > i)
            {
                let x = part[i];
                while(x.length > 0)
                {
                    let y = Math.floor(Math.random() * x.length);
                    final = final + x[y];
                    x = x.replace(x[y], "");
                }

                final += " ";
                i++;
            }

            break;

        }
        else
        {
            while(location.length > 0)
            {
                let y = Math.floor(Math.random() * location.length);
                final = final + location[y];
                location = location.replace(location[y], "");
            }

            break;
        }
    }


    console.log("Výsledek: " + final);
    return final;
}

async function flashingLetters(location)
{
    state = "guessing";
    hideAllLetters(location);
    showAllLetters(currentLocation.name);

    while (state == "guessing")
    {       
        hideAllLetters(location);
        let x = 1;
        /*if (location.length > 7)
        {
            x = Math.floor(Math.random() * 2) + 1;
        }
        else
        {
            x = 1;
        }
        console.log(x);*/

        while(x > 0)
        {
            let y = Math.floor(Math.random() * location.length);
            console.log("letter" + y);
            let letter = document.getElementById("letter" + y);
            letter.style.color = "#000000";
            //zobrazit konkrétní polohu/písmeno
            x--;
        }
        
        await delay(500);
        //čekat 0,5s      
    }

}

function hideAllLetters(location)
{
    let c = 0;
    while (c < location.length)
    {   
        let letter = document.getElementById("letter" + c);
        letter.style.color = "transparent";
        c++;
    }
}

function showAllLettersColor(location)
{
    let c = 0;
    while (c < location.length)
    {   
        let letter = document.getElementById("letter" + c);
        letter.style.color = "#000000";
        c++;
    }
}

function cleanAllLetters(location)
{
    let i = 0;

    while(i < location.length)
    {
        let letter = document.getElementById("letter" + i);
        letter.textContent = null;
        letter.style.visibility = "hidden";     
        i++;
    }
}

function delay(time) 
{
    return new Promise(resolve => setTimeout(resolve, time));
}

function checkLocationGuessAnswer()
{
    console.log(elementTextAnswer.value);
    console.log(currentLocation.name);

    if (elementTextAnswer.value.toUpperCase() == currentLocation.name.toUpperCase())
    {
        state = "guessed";
        changePlayerScore(0, 10);
        divTextAnswer.style.visibility = "hidden";
        //elementMap.textContent = currentLocation.name;
        elementDescription.textContent = currentLocation.description;
        elementDescription.style.visibility = "visible";
        elementPin.style.visibility = "visible";
        showAllLettersColor(currentLocation.name);
        showAllLetters(currentLocation.name);
        elementConfirm.style.visibility = "visible";
    }
    else
    {
        console.log("Špatná odpověď!");
        alert("Špatná odpověď");
    }

    elementTextAnswer.value = null;
}

elementTextAnswer.addEventListener("keypress", function(event) {
    
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("location-input-submit").click();
    }
});

function confirmMapPinAnswer() {

    if (state == "finished")
    {
        finishRound();
    }
    else
    {
        checkMapPositionAnswer();
    }
}


function checkMapPositionAnswer() 
{
    let pinPosition = getPinPosition();
    const pinX = pinPosition[0], pinY = pinPosition[1];
    const correctX = currentLocation.coordinateX, correctY = currentLocation.coordinateY;
    console.log("Correct - " + correctX + ", " + correctY);
    let coordinates = convertCoordinatesToMap(correctX, correctY);
    console.log(coordinates[0]); console.log(coordinates[1]);
    elementCorrect.style.left = coordinates[0] + 'px';
    elementCorrect.style.top = coordinates[1]  + 'px';
    const distance = getDistance(pinX, pinY, coordinates[0], coordinates[1]);
    console.log("Vzdálenost: " + distance);

    if(distance < 53)
    {
        changePlayerScore(0, 40);
        elementCorrect.style.background = '#00ff00';
        $('.custom-btn-container').draggable("disable");
        //elementPin.setAttribute("draggable", "false");
    }
    else
    {
        elementCorrect.style.background = '#f00000';
    }

    elementCorrect.style.visibility = "visible";
    state = "finished";
}

function getPinPosition()
{
    var bodyRect = document.body.getBoundingClientRect();
    var elemRect = elementPin.getBoundingClientRect();
    const x = elemRect.left - bodyRect.left;
    const y = elemRect.top - bodyRect.top;

    // Create a string with the position information
    const position = `Pin - X: ${x}, Y: ${y}`;
    console.log(position);

    const mapSize = `${elementMap.offsetWidth} x ${elementMap.offsetHeight} px`;
    console.log("Map - " + mapSize);

    return [x, y]
}

function convertCoordinatesToMap(coordinateX, coordinateY)
{
    //const north = 51.08000, 14.32000; west = 50.25200, 12.06500; south = 48.53000, 14.33300; east = 49.55000, 18.90000;
    const north = 51.08000, south = 48.53000, west = 12.06500, east = 18.90000;

    var a2 = east-west; 
    var b2 = coordinateY-west;
    var c2 = (b2/a2);
    var d2 = 1035*c2-20;

    var a1 = north-south; 
    var b1 = coordinateX-south;
    var c1 = 1-(b1/a1);
    var d1 = 600*c1-20+100;

    console.log(`Convert - X: ${a2}, Y: ${a1}`);
    console.log(`Convert - X: ${b2}, Y: ${b1}`);
    console.log(`Convert - X: ${c2}, Y: ${c1}`);
    console.log(`Convert - X: ${d2}, Y: ${d1}`);

    return [d2, d1];
}

function getDistance(x1, y1, x2, y2)
{
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt(x * x + y * y);
}


function getCurrentBrowserZoom() 
{
    let zoom = Math.round(window.devicePixelRatio*100);
    console.log("Zoom: " + zoom + "%");
    return zoom;
}

function getCurrentBrowserSize() 
{
    var w = window.innerWidth;
    var h = window.innerHeight;
    console.log("Browser window size: " + w + "x" + h + "px");
    return[w, h]
}

function finishRound()
{
    elementPin.style.visibility = "hidden";
    elementDescription.style.visibility = "hidden";
    elementPin.style.top = "135px"; elementPin.style.left = "10px";
    elementCorrect.style.visibility = "hidden";
    elementConfirm.style.visibility = "hidden";
    elementDescription.textContent = null;
    cleanAllLetters(currentLocation.name);

    if (round < 3)
    {
        startRound();
    }
    else
    {
        finishGame();
    }
}

function finishGame()
{
    state = "end";
    console.log(players[0]);
    alert("Konec hry " + players[0].name + "! Celkové skóre je " + players[0].score + "!");
    window.location.href="index.html";
}
