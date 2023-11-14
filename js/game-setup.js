var gameType; var gameDifficulty; var playerNickname;

function setGameProperties(type, difficulty, nickname)
{
    gameType = type;
    gameDifficulty = difficulty;
    playerNickname = nickname;

    console.log("Hey " + gameType);
    //window.location.href="game.html";
}

function getGameType()
{
    return gameType;
}

function getGameDifficulty()
{
    return gameDifficulty;
}

function getPlayerNickname()
{
    return playerNickname;
}
