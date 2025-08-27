import { mkdirSync, writeFile } from "node:fs";
import { TournamentState } from "../../../types/tournament.js";

export function writeToFiles(data: TournamentState) {
  writeFile("tournament-name.txt", data.name, (err) => {
    if (err) throw err;
    console.log("tournament-name.txt has been saved!");
  });
  writeFile("best-of.txt", data.bestOf.toString(), (err) => {
    if (err) throw err;
    console.log("best-of.txt has been saved!");
  });
  writeFile("round-format.txt", data.roundFormat, (err) => {
    if (err) throw err;
    console.log("round-format.txt has been saved!");
  });
  writeFile("custom-round-format.txt", data.customRoundFormat || "", (err) => {
    if (err) throw err;
    console.log("custom-round-format.txt has been saved!");
  });
  writeFile("round-number.txt", data.roundNumber?.toString() || "", (err) => {
    if (err) throw err;
    console.log("round-number.txt has been saved!");
  });
  for (let i = 0; i < data.commentators.length; i++) {
    writeFile(
      `commentators/${i + 1}/name.txt`,
      data.commentators[i].name,
      (err) => {
        if (err) {
          // if directory doesn't exist, create it and write the file again
          mkdirSync(`commentators/${i + 1}`, { recursive: true });
          writeFile(
            `commentators/${i + 1}/name.txt`,
            data.commentators[i].name,
            (err) => {
              if (err) throw err;
            }
          );
        }
        console.log(`commentators/${i + 1}/name.txt has been saved!`);
      }
    );
    writeFile(
      `commentators/${i + 1}/twitter.txt`,
      data.commentators[i].twitter,
      (err) => {
        if (err) {
          mkdirSync(`commentators/${i + 1}`, { recursive: true });
          writeFile(
            `commentators/${i + 1}/twitter.txt`,
            data.commentators[i].twitter,
            (err) => {
              if (err) throw err;
            }
          );
        }
        console.log(`commentators/${i + 1}/twitter.txt has been saved!`);
      }
    );
    writeFile(
      `commentators/${i + 1}/pronouns.txt`,
      data.commentators[i].pronouns,
      (err) => {
        if (err) {
          mkdirSync(`commentators/${i + 1}`, { recursive: true });
          writeFile(
            `commentators/${i + 1}/pronouns.txt`,
            data.commentators[i].pronouns,
            (err) => {
              if (err) throw err;
            }
          );
        }
        console.log(`commentators/${i + 1}/pronouns.txt has been saved!`);
      }
    );
  }
  for (let i = 0; i < data.teams.length; i++) {
    for (let j = 0; j < data.teams[i].players.length; j++) {
      writeFile(
        `teams/${i + 1}/players/${j + 1}/team-name.txt`,
        data.teams[i].players[j].playerInfo.teamName,
        (err) => {
          if (err) {
            mkdirSync(`teams/${i + 1}/players/${j + 1}`, { recursive: true });
            writeFile(
              `teams/${i + 1}/players/${j + 1}/team-name.txt`,
              data.teams[i].players[j].playerInfo.teamName,
              (err) => {
                if (err) throw err;
              }
            );
          }
          console.log(
            `teams/${i + 1}/players/${j + 1}/team-name.txt has been saved`
          );
        }
      );
      writeFile(
        `teams/${i + 1}/players/${j + 1}/player-tag.txt`,
        data.teams[i].players[j].playerInfo.playerTag,
        (err) => {
          if (err) {
            mkdirSync(`teams/${i + 1}/players/${j + 1}`, { recursive: true });
            writeFile(
              `teams/${i + 1}/players/${j + 1}/player-tag.txt`,
              data.teams[i].players[j].playerInfo.playerTag,
              (err) => {
                if (err) throw err;
              }
            );
          }
          console.log(
            `teams/${i + 1}/players/${j + 1}/player-tag.txt has been saved`
          );
        }
      );
      writeFile(
        `teams/${i + 1}/players/${j + 1}/pronouns.txt`,
        data.teams[i].players[j].playerInfo.pronouns,
        (err) => {
          if (err) {
            mkdirSync(`teams/${i + 1}/players/${j + 1}`, { recursive: true });
            writeFile(
              `teams/${i + 1}/players/${j + 1}/pronouns.txt`,
              data.teams[i].players[j].playerInfo.pronouns,
              (err) => {
                if (err) throw err;
              }
            );
          }
          console.log(
            `teams/${i + 1}/players/${j + 1}/pronouns.txt has been saved`
          );
        }
      );
      writeFile(
        `teams/${i + 1}/players/${j + 1}/twitter.txt`,
        data.teams[i].players[j].playerInfo.twitter,
        (err) => {
          if (err) {
            mkdirSync(`teams/${i + 1}/players/${j + 1}`, { recursive: true });
            writeFile(
              `teams/${i + 1}/players/${j + 1}/twitter.txt`,
              data.teams[i].players[j].playerInfo.twitter,
              (err) => {
                if (err) throw err;
              }
            );
          }
          console.log(
            `teams/${i + 1}/players/${j + 1}/twitter.txt has been saved`
          );
        }
      );
      writeFile(
        `teams/${i + 1}/players/${j + 1}/character.txt`,
        data.teams[i].players[j].gameInfo.character,
        (err) => {
          if (err) {
            mkdirSync(`teams/${i + 1}/players/${j + 1}`, { recursive: true });
            writeFile(
              `teams/${i + 1}/players/${j + 1}/character.txt`,
              data.teams[i].players[j].gameInfo.character,
              (err) => {
                if (err) throw err;
              }
            );
          }
          console.log(
            `teams/${i + 1}/players/${j + 1}/character.txt has been saved`
          );
        }
      );
      writeFile(
        `teams/${i + 1}/players/${j + 1}/alt-costume.txt`,
        data.teams[i].players[j].gameInfo.altCostume,
        (err) => {
          if (err) {
            mkdirSync(`teams/${i + 1}/players/${j + 1}`, { recursive: true });
            writeFile(
              `teams/${i + 1}/players/${j + 1}/alt-costume.txt`,
              data.teams[i].players[j].gameInfo.altCostume,
              (err) => {
                if (err) throw err;
              }
            );
          }
          console.log(
            `teams/${i + 1}/players/${j + 1}/alt-costume.txt has been saved`
          );
        }
      );
    }
    writeFile(`teams/${i + 1}/name.txt`, data.teams[i].name, (err) => {
      if (err) {
        mkdirSync(`teams/${i + 1}`, { recursive: true });
        writeFile(`teams/${i + 1}/name.txt`, data.teams[i].name, (err) => {
          if (err) throw err;
        });
      }
      console.log(`teams/${i + 1}/name.txt has been saved`);
    });
    writeFile(
      `teams/${i + 1}/score.txt`,
      data.teams[i].score.toString(),
      (err) => {
        if (err) {
          mkdirSync(`teams/${i + 1}`, { recursive: true });
          writeFile(
            `teams/${i + 1}/score.txt`,
            data.teams[i].score.toString(),
            (err) => {
              if (err) throw err;
            }
          );
        }
        console.log(`teams/${i + 1}/score.txt has been saved`);
      }
    );
    writeFile(
      `teams/${i + 1}/in-losers.txt`,
      data.teams[i].inLosers ? "[L]" : "",
      (err) => {
        if (err) {
          mkdirSync(`teams/${i + 1}`, { recursive: true });
          writeFile(
            `teams/${i + 1}/in-losers.txt`,
            data.teams[i].inLosers ? "[L]" : "",
            (err) => {
              if (err) throw err;
            }
          );
        }
        console.log(`teams/${i + 1}/in-losers.txt has been saved`);
      }
    );
  }
}