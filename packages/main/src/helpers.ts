import { existsSync, mkdirSync, writeFile } from "node:fs";
import { TournamentState } from "../../../types/tournament.js";
import { app } from "electron";
import path from "node:path";

export function writeToFiles(data: TournamentState) {
  let textsRootPath = path.join(app.getAppPath(), "..", "resources", "texts");
  if (process.env.NODE_ENV !== "development") {
    switch (process.platform) {
      case "win32": {
        textsRootPath = path.join(
          process.env.PORTABLE_EXECUTABLE_DIR as string,
          "resources",
          "texts"
        );
        break;
      }
      default: {
        console.log();
      }
    }
  }
  writeFile(`${textsRootPath}/tournament-name.txt`, data.name, (err) => {
    if (err) throw err;
    console.log(`${textsRootPath}/tournament-name.txt has been saved!`);
  });
  writeFile(`${textsRootPath}/best-of.txt`, data.bestOf.toString(), (err) => {
    if (err) throw err;
    console.log(`${textsRootPath}/best-of.txt has been saved!`);
  });
  writeFile(`${textsRootPath}/round-format.txt`, data.roundFormat, (err) => {
    if (err) throw err;
    console.log(`${textsRootPath}/round-format.txt has been saved!`);
  });
  writeFile(
    `${textsRootPath}/custom-round-format.txt`,
    data.customRoundFormat || " ",
    (err) => {
      if (err) throw err;
      console.log(`${textsRootPath}/custom-round-format.txt has been saved!`);
    }
  );
  writeFile(
    `${textsRootPath}/round-number.txt`,
    data.roundNumber?.toString() || " ",
    (err) => {
      if (err) throw err;
      console.log(`${textsRootPath}/round-number.txt has been saved!`);
    }
  );
  for (let i = 0; i < data.commentators.length; i++) {
    let commentatorsRootPath = `${textsRootPath}/commentators/${i + 1}`;
    if (!existsSync(commentatorsRootPath)) {
      mkdirSync(commentatorsRootPath, { recursive: true });
    }
    writeFile(
      `${commentatorsRootPath}/name.txt`,
      data.commentators[i].name,
      (err) => {
        if (err) {
          throw err;
        }
        console.log(`${commentatorsRootPath}/name.txt has been saved!`);
      }
    );
    writeFile(
      `${commentatorsRootPath}/twitter.txt`,
      data.commentators[i].twitter,
      (err) => {
        if (err) {
          throw err;
        }
        console.log(`${commentatorsRootPath}/twitter.txt has been saved!`);
      }
    );
    writeFile(
      `${commentatorsRootPath}/pronouns.txt`,
      data.commentators[i].pronouns,
      (err) => {
        if (err) {
          throw err;
        }
        console.log(`${commentatorsRootPath}/pronouns.txt has been saved!`);
      }
    );
  }
  for (let i = 0; i < data.teams.length; i++) {
    for (let j = 0; j < data.teams[i].players.length; j++) {
      let playerRootPath = `${textsRootPath}/teams/${i + 1}/players/${j + 1}`;
      if (!existsSync(playerRootPath)) {
        mkdirSync(playerRootPath, { recursive: true });
      }
      writeFile(
        `${playerRootPath}/team-name.txt`,
        data.teams[i].players[j].playerInfo.teamName,
        (err) => {
          if (err) {
            throw err;
          }
          console.log(`${playerRootPath}/team-name.txt has been saved`);
        }
      );
      writeFile(
        `${playerRootPath}/player-tag.txt`,
        data.teams[i].players[j].playerInfo.playerTag,
        (err) => {
          if (err) {
            throw err;
          }
          console.log(`${playerRootPath}/player-tag.txt has been saved`);
        }
      );
      writeFile(
        `${playerRootPath}/pronouns.txt`,
        data.teams[i].players[j].playerInfo.pronouns,
        (err) => {
          if (err) {
            throw err;
          }
          console.log(`${playerRootPath}/pronouns.txt has been saved`);
        }
      );
      writeFile(
        `${playerRootPath}/twitter.txt`,
        data.teams[i].players[j].playerInfo.twitter,
        (err) => {
          if (err) {
            throw err;
          }
          console.log(`${playerRootPath}/twitter.txt has been saved`);
        }
      );
      writeFile(
        `${playerRootPath}/character.txt`,
        data.teams[i].players[j].gameInfo.character,
        (err) => {
          if (err) {
            throw err;
          }
          console.log(`${playerRootPath}/character.txt has been saved`);
        }
      );
      writeFile(
        `${playerRootPath}/alt-costume.txt`,
        data.teams[i].players[j].gameInfo.altCostume,
        (err) => {
          if (err) {
            throw err;
          }
          console.log(`${playerRootPath}/alt-costume.txt has been saved`);
        }
      );
    }
    let teamRootPath = `${textsRootPath}/teams/${i + 1}`;
    writeFile(`${teamRootPath}/name.txt`, data.teams[i].name, (err) => {
      if (err) {
        throw err;
      }
      console.log(`${teamRootPath}/name.txt has been saved`);
    });
    writeFile(
      `${teamRootPath}/score.txt`,
      data.teams[i].score.toString(),
      (err) => {
        if (err) {
          throw err;
        }
        console.log(`${teamRootPath}/score.txt has been saved`);
      }
    );
    writeFile(
      `${teamRootPath}/in-losers.txt`,
      data.teams[i].inLosers ? "[L]" : "",
      (err) => {
        if (err) {
          throw err;
        }
        console.log(`${teamRootPath}/in-losers.txt has been saved`);
      }
    );
  }
}
