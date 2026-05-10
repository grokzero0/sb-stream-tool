import {
  ALL_ACTIONS,
  ALL_OBS_SCENE_TYPES,
  ALL_SLIPPI_RELAY_STATUSES,
  ObsScene,
  ObsSceneSettings,
  ObsWebsocketSettings,
  ShortcutSettings,
  SlippiRelaySettings,
} from "@app/common";
import { app } from "electron";
import path from "path";
import { RocksDatabase, Transaction } from "@harperfast/rocksdb-js";
import { isPlainObject } from "es-toolkit";
import { EventStream } from "./EventStream.js";

export class SettingsStore {
  private static storePath = path.join(app.getPath("userData"), "settings");

  private static async serialize(data: any) {
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

  static async writeSlippiRelaySettings(settings: SlippiRelaySettings) {
    const db = RocksDatabase.open(this.storePath);
    const relayStatus = await this.serialize(settings.relayStatus);
    const directory = await this.serialize(settings.directory);
    const relayIp = await this.serialize(settings.ip);
    const relayPort = await this.serialize(settings.port);

    db.transaction(async (txn: Transaction) => {
      (txn.put("slippi-relay-status", relayStatus),
        txn.put("slippi-relay-directory", directory),
        txn.put("slippi-relay-ip", relayIp),
        txn.put("slippi-relay-port", relayPort));
    });

    db.close();

    // EventStream.notify("Slippi Relay", "Successfully saved Relay settings!");
  }

  static async getSlippiRelaySettings() {
    const isSlippiRelaySettings = (data: any): data is SlippiRelaySettings => {
      return (
        typeof data === "object" &&
        ALL_SLIPPI_RELAY_STATUSES.includes(data.relayStatus) &&
        typeof data.directory === "string" &&
        typeof data.ip === "string" &&
        typeof data.port === "string"
      );
    };
    const db = RocksDatabase.open(this.storePath);

    const relayStatus = await db.get("slippi-relay-status");
    const directory = await db.get("slippi-relay-directory");
    const ip = await db.get("slippi-relay-ip");
    const port = await db.get("slippi-relay-port");

    const settings: SlippiRelaySettings = {
      relayStatus: relayStatus,
      directory: directory,
      ip: ip,
      port: port,
    };

    db.close();

    if (isSlippiRelaySettings(settings)) {
      return settings;
    }
    return undefined;
  }

  static async writeShortcutSettings(settings: ShortcutSettings) {
    const serializedSettings = await this.serialize(settings);
    const db = RocksDatabase.open(this.storePath);
    db.put("shortcuts", serializedSettings);
    db.close();
    EventStream.notify("Shortcuts", "Successfully saved shortcuts!");
  }

  static async getShortcuts() {
    const isShortcutSettings = (data: any): data is ShortcutSettings => {
      if (!Array.isArray(data)) return false;

      return data.every(
        (item) =>
          item !== null &&
          typeof item === "object" &&
          typeof item.hotkey === "string" &&
          ALL_ACTIONS.includes(item.action),
      );
    };
    const db = RocksDatabase.open(this.storePath);
    try {
      const json = JSON.parse(await db.get("shortcuts"));
      db.close();
      if (isShortcutSettings(json)) {
        return json;
      }
      return undefined;
    } catch {
      db.close();
      return undefined;
    }
  }

  static async writeStartggApiKey(newApiKey: string) {
    const db = RocksDatabase.open(this.storePath);
    const serializedKey = await this.serialize(newApiKey);
    // console.log(serializedKey)
    db.put("startgg-api-key", serializedKey);
    db.close();
    EventStream.notify("Start.gg API Key", "Successfully saved API Key!");
  }

  static async getStartggApiKey() {
    const isApiKey = (key: any): key is string => {
      return key !== null && typeof key === "string";
    };
    const db = RocksDatabase.open(this.storePath);
    const key = await db.get("startgg-api-key");
    if (isApiKey(key)) {
      db.close();
      return key;
    }
    db.close();
    return "";
  }

  static async writeStartggTournamentUrl(url: string) {
    const serializedUrl = await this.serialize(url);

    const db = RocksDatabase.open(this.storePath);
    db.put("startgg-tournament-url", serializedUrl);

    db.close();
  }

  static async getStartggTournamentUrl() {
    const isStartggTournamentUrl = (url: any): url is string => {
      const regex =
        /^https:\/\/(?:www\.)?start\.gg\/tournament\/([^\/?#]+)\/event\/([^\/?#]+)(?:[\/?#].*)?$/;
      return (
        url !== null && typeof url === "string" && regex.test(url) === true
      );
    };

    const db = RocksDatabase.open(this.storePath);
    const url = await db.get("startgg-tournament-url");
    db.close();

    if (isStartggTournamentUrl(url)) {
      return url;
    }
    return "";
  }

  static async getObsWebsocketSettings() {
    const isWebsocketSettings = (data: any): data is ObsWebsocketSettings => {
      return (
        data !== null &&
        typeof data === "object" &&
        typeof data.ip === "string" &&
        typeof data.port === "string"
      );
    };

    const db = RocksDatabase.open(this.storePath);
    const websocketSettings: ObsWebsocketSettings = {
      ip: await db.get("obs-websocket-ip"),
      port: await db.get("obs-websocket-port"),
    };
    db.close();

    if (isWebsocketSettings(websocketSettings)) {
      return websocketSettings;
    }
    return undefined;
  }

  static async getObsScenes() {
    const isObsScenes = (data: any): data is ObsSceneSettings => {
      const isObsScene = (obj: any): obj is ObsScene => {
        return (
          obj !== null &&
          typeof obj === "object" &&
          typeof obj.scene === "string" &&
          typeof obj.start === "number"
        );
      };

      if (!Array.isArray(data)) return false;

      return data.every(
        (scene) =>
          scene !== null &&
          typeof scene === "object" &&
          ALL_OBS_SCENE_TYPES.includes(scene.type) &&
          isObsScene(scene.scene),
      );
    };
    const db = RocksDatabase.open(this.storePath);

    try {
      const scenesJson = JSON.parse(await db.get("obs-scenes"));
      db.close();
      if (isObsScenes(scenesJson)) {
        return scenesJson;
      }
      return undefined;
    } catch {
      db.close();
      return undefined;
    }
  }

  static async writeObsWebsocketSettings(settings: ObsWebsocketSettings) {
    const db = RocksDatabase.open(this.storePath);
    const serializedIp = await this.serialize(settings.ip);
    const serializedPort = await this.serialize(settings.port);

    db.transaction(async (txn: Transaction) => {
      (txn.put("obs-websocket-ip", serializedIp),
        txn.put("obs-websocket-port", serializedPort));
    });

    db.close();
  }

  static async writeObsScenes(scenes: ObsSceneSettings) {
    const db = RocksDatabase.open(this.storePath);

    const serializedScenes = await this.serialize(scenes);

    db.put("obs-scenes", serializedScenes);

    db.close();
  }

  static async getObsSettings() {
    const websocketSettings = await this.getObsWebsocketSettings();
    const scenes = await this.getObsScenes();

    return {
      websocket: websocketSettings,
      scenes: scenes,
    };
  }
}
