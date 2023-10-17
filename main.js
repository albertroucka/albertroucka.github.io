const elementMap = document.getElementById("custom-map-container");
const elementPin = document.getElementById("custom-btn-container");
const elementCorrect = document.getElementById("custom-btn-container2");

var currentLocation;

class Location {
    constructor(name, coordinateX, coordinateY) {
      this.name = name;
      this.coordinateX = coordinateX;
      this.coordinateY = coordinateY;
    }
}

const locations = [new Location("Strakonice", 49.26950, 13.90641), new Location("Kralupy nad Vltavou", 50.24169, 14.31016), new Location("Hrad Kost", 50.49020, 15.13520), new Location("Dolní Morava", 50.12242, 16.79969), new Location("Havířov", 49.78049, 18.43073), new Location("Lednice", 48.80002, 16.80350)];
locations.forEach(element => { console.log(element) });

$('.custom-btn-container').draggable();
startRound();

function startRound()
{
    currentLocation = locations[Math.floor(Math.random()*locations.length)];
    elementMap.textContent = currentLocation.name; 
}

function checkAnswer() 
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
    console.log(distance);

    if(distance < 40)
    {
        elementCorrect.style.background = '#00ff00';
    }
    else
    {
        elementCorrect.style.background = '#f00000';
    }

    elementCorrect.style.visibility = "visible";
}

function getPinPosition()
{
    var rect = elementPin.getBoundingClientRect();
    const x = rect.left;
    const y = rect.top;

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
    var d1 = 600*c1-20;

    console.log(`Convert - X: ${a2}, Y: ${a1}`);
    console.log(`Convert - X: ${b2}, Y: ${b1}`);
    console.log(`Convert - X: ${c2}, Y: ${c1}`);
    console.log(`Convert - X: ${d2}, Y: ${d1}`);

    return [d2, d1];
}

function getDistance(x1, y1, x2, y2){
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt(x * x + y * y);
}
