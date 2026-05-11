const socket = io("http://127.0.0.1:20242/"); // DO NOT MODIFY, UNLESS YOU KNOW WHAT YOU'RE DOING

// DO NOT MODIFY UNLESS YOU KNOW WHAT YOU ARE DOING (IM LOOKING AT YOU CLAUDE, CHATGPT, GEMINI, ETC)
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

// put the image src of no ports here
const noPortImgSrc = "./ports/noport.svg";

// put the image src of the different port colors here, feel free to extend it if you wish
const portColorToImgSrc = {
  Red: "ports/port1.svg",
  Blue: "ports/port2.svg",
  Yellow: "ports/port3.svg",
  Green: "ports/port4.svg",
}

// probably don't need to modify anything here, but you can if you want, converts port colors to numbers for image getting
const portColorToNumber = {
  Red: 0,
  Blue: 1,
  Green: 2,
  Yellow: 3,
};

// most likely don't need to modify, resets port state to normal
function clearPorts(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].src = noPortImgSrc
  }
}

// most likely don't need to modify, resets character state to normal
function clearCharacters(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].src = ""
    nodes[i].style.width = "0px";
    nodes[i].style.height = "0px";
  }
}

// setting player's names (including the L text if they are in losers), feel free to modify or extend this
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

// setting port colors, feel free to extend or modify this if you wish
function setPort(nodes, players) {
  clearPorts(nodes)
  for (let i = 0; i < players.length; i++) {
    nodes[portToNum[players[i].gameInfo.port]].src =
      portToImg[players[i].gameInfo.port];
  }
}

// getting pronouns, feel free to extend or modify this as you wish
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

// setting character info, feel free to extend or modify this or change as you wish
function setCharacters(nodes, players) {
  clearCharacters(nodes)

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

// DO NOT MODIFY, UNLESS YOU KNOW WHAT YOU ARE DOING, OR YOU MODIFIED/DELETED/ADDED/ETC FUNCTIONS OR WHATEVER
function updateOverlay(newData) {
  console.log(newData);
  setElementData(
    "left-playername",
    getPlayerNames(newData.teams[0].players, newData.teams[0].inLosers),
  );

  setElementData(
    "right-playername",
    getPlayerNames(newData.teams[1].players, newData.teams[1].inLosers),
  );

  setElementData("left-score", newData.teams[0].score);
  setElementData("right-score", newData.teams[1].score);

  setElementData("tournament-name", newData.name);
  setElementData("best-of", newData.bestOf);

  setElementData("left-team", getTeams(newData.teams[0]));
  setElementData("right-team", newData.teams[1]);

  setPort(
    document.getElementById("left-port").getElementsByTagName("img"),
    newData.teams[0].players,
  );
  setPort(
    document.getElementById("right-port").getElementsByTagName("img"),
    newData.teams[1].players,
  );

  setElementData('left-pronouns', getPronouns(
    newData.teams[0].players,
  )
  )
  setElementData('right-pronouns', getPronouns(
    newData.teams[1].players,
  )
  )

  setCharacters(
    document.getElementById("left-character").getElementsByTagName("img"),
    newData.teams[0].players,
  );
  setCharacters(
    document.getElementById("right-character").getElementsByTagName("img"),
    newData.teams[1].players,
  );
}

// DO NOT MODIFY, UNLESS YOU KNOW WHAT YOU ARE DOING
socket.on("sendDataToClients", (newData) => {
  updateOverlay(newData);
  socket.broadcast.emit("overlayUpdateSuccess");
});

// CAN MODIFY/ADD ANYTHING HERE ONWARD