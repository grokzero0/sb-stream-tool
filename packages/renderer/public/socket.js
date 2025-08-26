const socket = io("http://127.0.0.1:20242/");
const portToNum = {
  Red: 0,
  Blue: 1,
  Green: 2,
  Yellow: 3,
};
const portToImg = {
  Red: "port1.svg",
  Blue: "port2.svg",
  Green: "port3.svg",
  Yellow: "port4.svg",
};
function getPlayerNames(players, inLosers) {
  const nameList = [];

  for (let i = 0; i < players.length; i++) {
    if (players[i].playerInfo.playerTag !== "") {
      nameList.push(players[i].playerInfo.playerTag);
    }
  }

  if (nameList.length <= 0) {
    return "";
  }

  names = "";
  names = nameList.join(" / ");
  if (inLosers) {
    names += " [L]";
  }

  return names;
}

function getPort(nodes, players) {
  for (let i = 0; i < players.length; i++) {
    nodes[portToNum[players[i].gameInfo.port]].src =
      portToImg[players[i].gameInfo.port];
  }
}

function getPronouns(players) {
  const pronounsList = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].playerInfo.pronouns !== "") {
      pronounsList.push(players[i].playerInfo.pronouns);
    }
  }

  if (pronounsList.length <= 0) {
    return "";
  }

  pronouns = "";
  pronouns = pronounsList.join(" / ");

  return pronouns;
}

function getCharacters(nodes, players) {
  index = 0;
  for (let i = 0; i < players.length; i++) {
    nodes[i].style.width = "30px";
    nodes[i].style.height = "30px";
    // console.log(players[i].gameInfo.character)
    if (players[i].gameInfo.character == "Random") {
      nodes[i].src =  "characters/melee/random/icons/overlay-default.png"
    } else {
      nodes[i].src = `characters/melee/${players[
        i
      ].gameInfo.character.toLowerCase()}/icons/${players[
        i
      ].gameInfo.altCostume.toLowerCase()}.png`;
    }

    index++;
  }
  for (let j = index; j < players.length; j++) {
    nodes[j].style.width = "0px";
    nodes[j].style.height = "0px";
    nodes[j].src = "";
  }
}

function updateOverlay(newData) {
  console.log("updating overlay");
  document.getElementById("left-playername").innerText = getPlayerNames(
    newData.teams[0].players,
    newData.teams[0].inLosers
  );
  document.getElementById("right-playername").innerText = getPlayerNames(
    newData.teams[1].players,
    newData.teams[1].inLosers
  );
  getPort(
    document.getElementById("left-port").getElementsByTagName("img"),
    newData.teams[0].players
  );
  getPort(
    document.getElementById("right-port").getElementsByTagName("img"),
    newData.teams[1].players
  );
  document.getElementById("left-pronouns").innerText = getPronouns(
    newData.teams[0].players
  );
  document.getElementById("right-pronouns").innerText = getPronouns(
    newData.teams[1].players
  );
  getCharacters(
    document.getElementById("left-character").getElementsByTagName("img"),
    newData.teams[0].players
  );
  getCharacters(
    document.getElementById("right-character").getElementsByTagName("img"),
    newData.teams[1].players
  );
}

socket.on("newData", (newData) => {
  console.log(newData);
  updateOverlay(newData);
});
