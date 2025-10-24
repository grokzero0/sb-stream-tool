const socket = io("http://127.0.0.1:20242/");

const portToNum = {
  Red: 0,
  Blue: 1,
  Green: 2,
  Yellow: 3,
};

const portToImg = {
  Red: "ports/port1.svg",
  Blue: "ports/port2.svg",
  Green: "ports/port3.svg",
  Yellow: "ports/port4.svg",
};

function setElementData(id, data) {
  if (
    document.getElementById(id) === null ||
    data === undefined ||
    data === null
  ) {
    return;
  }

  document.getElementById(id).innerText = data;
}

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
  for (let j = 0; j < nodes.length; j++) {
    nodes[j].src = "./ports/noport.svg";
  }
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

  return pronounsList.join("/");
}

function getCharacters(nodes, players) {
  index = 0;
  for (let i = 0; i < players.length; i++) {
    nodes[i].style.width = "30px";
    nodes[i].style.height = "30px";
    if (players[i].gameInfo.character == "Random") {
      nodes[i].src = "../characters/melee/random/icons/overlay-default.png";
    } else {
      nodes[i].src = `../characters/melee/${players[
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

function getTeams(team) {
  const teamList = [];
  for (let i = 0; i < team.players.length; i++) {
    if (team.players[i].playerInfo.teamName !== "") {
      teamList.push(team.players[i].playerInfo.teamName);
    }
  }

  if (teamList.length <= 0) {
    return "";
  }

  return teamList.join(" / ");
}

function updateOverlay(newData) {
  console.log("updating overlay");
  setElementData(
    "left-playername",
    getPlayerNames(newData.teams[0].players, newData.teams[0].inLosers)
  );

  setElementData(
    "right-playername",
    getPlayerNames(newData.teams[0].players, newData.teams[0].inLosers)
  );

  setElementData("left-score", newData.teams[0].score);
  setElementData("right-score", newData.teams[1].score)

  setElementData("tournament-name", newData.name)
  setElementData("best-of", newData.bestOf)

  setElementData("left-team", getTeams(newData.teams[0]))
  setElementData("right-team", newData.teams[1])

  console.log(getTeams(newData.teams[0]));
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
