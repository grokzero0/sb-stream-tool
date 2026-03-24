import path from "node:path";
import { EventStream } from "./observer.js";
import { app } from "electron";
import { mkdir } from "node:fs/promises";
import { existsSync, mkdirSync, writeFile } from "node:fs";
import { readFile } from "node:fs/promises";
import { Tournament } from "@app/common";
import { copy } from "fs-extra";

export class FileReaderWriter extends EventStream {
  private rootPath: string;
  private configRootPath: string;
  private resourcesRootPath: string;
  private overlayRootPath: string;
  private charactersRootPath: string;
  constructor() {
    super();
    this.rootPath = app.getAppPath();
    this.resourcesRootPath = path.join(this.rootPath, "..", "resources");
    this.configRootPath = path.join(this.rootPath, "..", "config");
    this.overlayRootPath = `${this.rootPath}/assets/overlay/`;
    this.charactersRootPath = `${this.rootPath}/assets/characters/`;
    if (process.env.NODE_ENV !== "development") {
      this.overlayRootPath = `${process.resourcesPath}/overlay/`;
      this.charactersRootPath = `${process.resourcesPath}/characters/`;
      if (process.platform == "win32") {
        this.rootPath = process.env.PORTABLE_EXECUTABLE_DIR ?? "undefined";
        this.resourcesRootPath = path.join(this.rootPath, "resources");
        this.configRootPath = path.join(this.rootPath, "config");
      }
    }
  }

  // writes data to text files
  writeData(data: Tournament) {
    const dataPath = path.join(this.resourcesRootPath, "texts");
    const errors = [] as NodeJS.ErrnoException[];
    writeFile(`${dataPath}/tournament-name.txt`, data.name, (err) => {
      if (err) errors.push(err);
    });

    writeFile(`${dataPath}/best-of.txt`, data.bestOf.toString(), (err) => {
      if (err) errors.push(err);
    });

    writeFile(`${dataPath}/round-format.txt`, data.roundFormat, (err) => {
      if (err) errors.push(err);
    });

    writeFile(
      `${dataPath}/custom-round-format.txt`,
      data.customRoundFormat || " ",
      (err) => {
        if (err) errors.push(err);
      },
    );

    writeFile(
      `${dataPath}/round-number.txt`,
      data.roundNumber?.toString() || " ",
      (err) => {
        if (err) errors.push(err);
      },
    );

    for (let i = 0; i < data.commentators.length; i++) {
      const commentatorsRootPath = `${dataPath}/commentators/${i + 1}`;
      if (!existsSync(commentatorsRootPath)) {
        mkdirSync(commentatorsRootPath, { recursive: true });
      }
      writeFile(
        `${commentatorsRootPath}/name.txt`,
        data.commentators[i].name,
        (err) => {
          if (err) {
            errors.push(err);
          }
        },
      );
      writeFile(
        `${commentatorsRootPath}/twitter.txt`,
        data.commentators[i].twitter,
        (err) => {
          if (err) {
            errors.push(err);
          }
        },
      );
      writeFile(
        `${commentatorsRootPath}/pronouns.txt`,
        data.commentators[i].pronouns,
        (err) => {
          if (err) {
            errors.push(err);
          }
        },
      );
    }

    for (let i = 0; i < data.teams.length; i++) {
      for (let j = 0; j < data.teams[i].players.length; j++) {
        const playerRootPath = `${dataPath}/teams/${i + 1}/players/${j + 1}`;
        if (!existsSync(playerRootPath)) {
          mkdirSync(playerRootPath, { recursive: true });
        }
        writeFile(
          `${playerRootPath}/team-name.txt`,
          data.teams[i].players[j].playerInfo.teamName,
          (err) => {
            if (err) {
              errors.push(err);
            }
          },
        );
        writeFile(
          `${playerRootPath}/player-tag.txt`,
          data.teams[i].players[j].playerInfo.playerTag,
          (err) => {
            if (err) {
              errors.push(err);
            }
          },
        );
        writeFile(
          `${playerRootPath}/pronouns.txt`,
          data.teams[i].players[j].playerInfo.pronouns,
          (err) => {
            if (err) {
              errors.push(err);
            }
          },
        );
        writeFile(
          `${playerRootPath}/twitter.txt`,
          data.teams[i].players[j].playerInfo.twitter,
          (err) => {
            if (err) {
              errors.push(err);
            }
          },
        );
        writeFile(
          `${playerRootPath}/character.txt`,
          data.teams[i].players[j].gameInfo.character,
          (err) => {
            if (err) {
              errors.push(err);
            }
          },
        );
        writeFile(
          `${playerRootPath}/alt-costume.txt`,
          data.teams[i].players[j].gameInfo.altCostume,
          (err) => {
            if (err) {
              errors.push(err);
            }
          },
        );
      }
      const teamRootPath = `${dataPath}/teams/${i + 1}`;
      writeFile(`${teamRootPath}/name.txt`, data.teams[i].name, (err) => {
        if (err) {
          errors.push(err);
        }
      });
      writeFile(
        `${teamRootPath}/score.txt`,
        data.teams[i].score.toString(),
        (err) => {
          if (err) {
            errors.push(err);
          }
        },
      );
      writeFile(
        `${teamRootPath}/in-losers.txt`,
        data.teams[i].inLosers ? "[L]" : "",
        (err) => {
          if (err) {
            errors.push(err);
          }
        },
      );

      if (errors.length > 0) {
        for (const error of errors) {
          this.notify(error.message);
        }
        this.notify(`${errors.length} errors found`);
      } else {
        this.notify("Data successfully saved to files!");
      }
    }
  }

  async writeApiKey(newApiKey: string) {
    writeFile(`${this.configRootPath}/api_key.txt`, newApiKey, (err) => {
      if (err) {
        this.notify(err.message);
        return;
      }
    });
    this.notify("Successfully saved API key!");
  }

  async getApiKey() {
    return readFile(`${this.configRootPath}/api_key.txt`, "utf-8")
      .then((key) => key)
      .catch(() => {
        return "";
      });
  }

  async createDirs() {
    // console.log(path.join(this.resourcesRootPath, "overlay"));
    copy(
      this.overlayRootPath,
      `${path.join(this.resourcesRootPath, "overlay")}`,
      {
        recursive: true,
        overwrite: false,
      },
    );
    copy(
      this.charactersRootPath,
      `${path.join(this.resourcesRootPath, "characters")}`,
      {
        recursive: true,
        overwrite: false,
      },
    );
    mkdir(`${path.join(this.resourcesRootPath, "texts", "commentators")}`, {
      recursive: true,
    });
    mkdir(`${path.join(this.resourcesRootPath, "texts", "teams")}`, {
      recursive: true,
    });
    mkdir(this.configRootPath, { recursive: true });
  }
}
