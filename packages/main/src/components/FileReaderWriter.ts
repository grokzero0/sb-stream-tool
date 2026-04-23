import path from "node:path";
import { EventStream } from "./observer.js";
import { app } from "electron";
import { readFile, mkdir } from "node:fs/promises";
import { Tournament } from "@app/common";
import fs, { outputFile } from "fs-extra";
import { isPlainObject } from "es-toolkit";

// make this less cluttered right now
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

  async serialize(data: any) {
    if (data === null || data === undefined) {
      return "";
    } else if (Array.isArray(data) || isPlainObject(data)) {
      return JSON.stringify(data);
    } else if (Buffer.isBuffer(data)) {
      return data;
    } else {
      return String(data);
    }
  }

  async write(location: string, data: any) {
    const serializedData = await this.serialize(data);
    return outputFile(location, serializedData)
      .then(() => undefined)
      .catch((error: Error) => error);
  }

  // writes data to text files
  async writeData(data: Tournament) {
    const dataPath = path.join(this.resourcesRootPath, "texts");
    const errors = [] as Error[];

    const setPotentialErrors = await Promise.all([
      this.write(`${dataPath}/tournament-name.txt`, data.name),
      this.write(`${dataPath}/best-of.txt`, data.bestOf.toString()),
      this.write(`${dataPath}/round-format.txt`, data.roundFormat),
      this.write(`${dataPath}/custom-round-format.txt`, data.customRoundFormat),
      this.write(`${dataPath}/round-number.txt`, data.roundNumber),
    ]);
    errors.push(...setPotentialErrors.filter((e) => e !== undefined));

    for (let i = 0; i < data.commentators.length; i++) {
      const commentatorsRootPath = `${dataPath}/commentators/${i + 1}`;
      const commentatorsPotentialErrors = await Promise.all([
        this.write(
          `${commentatorsRootPath}/name.txt`,
          data.commentators[i].name,
        ),
        this.write(
          `${commentatorsRootPath}/twitter.txt`,
          data.commentators[i].twitter,
        ),
        this.write(
          `${commentatorsRootPath}/pronouns.txt`,
          data.commentators[i].pronouns,
        ),
      ]);
      errors.push(
        ...commentatorsPotentialErrors.filter((e) => e !== undefined),
      );
    }

    for (let i = 0; i < data.teams.length; i++) {
      for (let j = 0; j < data.teams[i].players.length; j++) {
        const playerRootPath = `${dataPath}/teams/${i + 1}/players/${j + 1}`;
        const playerPotentialErrors = await Promise.all([
          this.write(
            `${playerRootPath}/team-name.txt`,
            data.teams[i].players[j].playerInfo.teamName,
          ),
          this.write(
            `${playerRootPath}/player-tag.txt`,
            data.teams[i].players[j].playerInfo.playerTag,
          ),
          this.write(
            `${playerRootPath}/pronouns.txt`,
            data.teams[i].players[j].playerInfo.pronouns,
          ),
          this.write(
            `${playerRootPath}/twitter.txt`,
            data.teams[i].players[j].playerInfo.twitter,
          ),
          this.write(
            `${playerRootPath}/character.txt`,
            data.teams[i].players[j].gameInfo.character,
          ),
          this.write(
            `${playerRootPath}/alt-costume.txt`,
            data.teams[i].players[j].gameInfo.altCostume,
          ),
        ]);
        errors.push(...playerPotentialErrors.filter((e) => e !== undefined));
      }

      const teamRootPath = `${dataPath}/teams/${i + 1}`;
      const teamPotentialErrors = await Promise.all([
        this.write(`${teamRootPath}/name.txt`, data.teams[i].name),
        this.write(`${teamRootPath}/score.txt`, data.teams[i].score),
        this.write(
          `${teamRootPath}/in-losers.txt`,
          data.teams[i].inLosers ? "[L]" : "",
        ),
      ]);
      errors.push(...teamPotentialErrors.filter((e) => e !== undefined));
    }

    if (errors.length > 0) {
      for (const error of errors) {
        this.notify(error.message);
      }
      this.notify(`${errors.length} errors found`);
    } else {
      this.notify("Data successfully saved to files!");
    }
  }

  async writeApiKey(newApiKey: string) {
    const error = await this.write(
      `${this.configRootPath}/api_key.txt`,
      newApiKey,
    );
    if (error !== undefined) {
      return this.notify(error.message);
    }
    this.notify("Successfully saved API key!");
  }

  async getApiKey() {
    return readFile(`${this.configRootPath}/api_key.txt`, "utf-8")
      .then((key) => key)
      .catch(() => {
        return "";
      });
  }

  async getSlippiSettings() {
    return readFile(`${this.configRootPath}/slippi.json`, "utf-8")
      .then((data) => JSON.parse(data))
      .catch(() => {
        return undefined;
      });
  }

  async getShortcuts() {
    return readFile(`${this.configRootPath}/shortcuts.json`, "utf-8")
      .then((data) => JSON.parse(data))
      .catch(() => {
        return undefined;
      });
  }

  async getObsSettings() {
    return readFile(`${this.configRootPath}/obs.json`, "utf-8")
      .then((data) => JSON.parse(data))
      .catch(() => {
        return undefined;
      });
  }

  async createDirs() {
    // console.log(path.join(this.resourcesRootPath, "overlay"));
    fs.copy(
      this.overlayRootPath,
      `${path.join(this.resourcesRootPath, "overlay")}`,
      {
        recursive: true,
        overwrite: false,
      },
    );
    fs.copy(
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
