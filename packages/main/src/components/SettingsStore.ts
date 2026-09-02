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

const EVENT_URL_DB_KEY = "event-url";
const LEGACY_API_KEY_DB_KEY = "startgg-api-key";
const LEGACY_EVENT_URL_DB_KEY = "startgg-tournament-url";
const LEGACY_STARTGG_PLATFORM = "startgg";

function platformApiKeyDbKey(platform: string) {
  return `platform:${platform}:api-key`;
}

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

    await db.transaction(async (txn: Transaction) => {
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
    await db.put("shortcuts", serializedSettings);
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

  static async writePlatformApiKey(platform: string, newApiKey: string) {
    const db = RocksDatabase.open(this.storePath);
    const serializedKey = await this.serialize(newApiKey);
    await db.put(platformApiKeyDbKey(platform), serializedKey);
    db.close();
    EventStream.notify("API Key", "Successfully saved API Key!");
  }

  static async getPlatformApiKey(platform: string) {
    const isApiKey = (key: any): key is string => {
      return key !== null && typeof key === "string" && key !== "";
    };
    const db = RocksDatabase.open(this.storePath);
    const key = await db.get(platformApiKeyDbKey(platform));
    // Keys used to be stored per-app rather than per-platform.
    const legacy =
      platform === LEGACY_STARTGG_PLATFORM && !isApiKey(key)
        ? await db.get(LEGACY_API_KEY_DB_KEY)
        : undefined;
    db.close();

    if (isApiKey(key)) {
      return key;
    }
    return isApiKey(legacy) ? legacy : "";
  }

  static async writeEventUrl(url: string) {
    const serializedUrl = await this.serialize(url);

    const db = RocksDatabase.open(this.storePath);
    await db.put(EVENT_URL_DB_KEY, serializedUrl);

    db.close();
  }

  // Returned unvalidated: only the renderer's platform registry knows which URL
  // shapes are recognised, and it drops anything it cannot parse.
  static async getEventUrl() {
    const isUrl = (url: any): url is string => {
      return url !== null && typeof url === "string" && url !== "";
    };

    const db = RocksDatabase.open(this.storePath);
    const url = await db.get(EVENT_URL_DB_KEY);
    const legacy = isUrl(url)
      ? undefined
      : await db.get(LEGACY_EVENT_URL_DB_KEY);
    db.close();

    if (isUrl(url)) {
      return url;
    }
    return isUrl(legacy) ? legacy : "";
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

    await db.transaction(async (txn: Transaction) => {
      (txn.put("obs-websocket-ip", serializedIp),
        txn.put("obs-websocket-port", serializedPort));
    });

    db.close();
  }

  static async writeObsScenes(scenes: ObsSceneSettings) {
    const db = RocksDatabase.open(this.storePath);

    const serializedScenes = await this.serialize(scenes);

    await db.put("obs-scenes", serializedScenes);

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
