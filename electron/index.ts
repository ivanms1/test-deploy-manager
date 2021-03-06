import path from "path";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import isDev from "electron-is-dev";

import {
  getAuthenticationGoogleURL,
  getAuthenticationKakaoURL,
  loadTokens,
} from "./services/auth-service";

import logger from "./logger";

import { prepareDb, resetDb } from "./store/db";

import initAutoUpdate from "./updater";

import "./ipcMain/account";
import "./ipcMain/wallet";
import "./ipcMain/db";
import "./ipcMain/drive";
import "./ipcMain/app";

const APP_HEIGHT = process.platform === "win32" ? 762 : 736;
const TRANSFER_WINDOW_HEIGHT = process.platform === "win32" ? 397 : 371;

if (!isDev && process.platform === "win32") {
  try {
    initAutoUpdate();
  } catch (error) {
    logger("init-auto-update", error?.message, "error");
  }
}

export let mainWindow: BrowserWindow | null = null;
let authWindow: BrowserWindow | null = null;
let transferWindow: BrowserWindow | null = null;
let showWindow: () => Promise<void> | null = null;

function destroyAuthWin() {
  if (!authWindow) return;
  authWindow.close();
  authWindow = null;
}

const createWindow = async (): Promise<void> => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "Conun Manager",
    width: 414,
    height: APP_HEIGHT,
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(__dirname, "preload.js"),
    },
    resizable: false,
  });

  mainWindow.removeMenu();
  mainWindow.setResizable(false);

  try {
    await prepareDb();
  } catch (error) {
    logger("prepare-db", error?.message, "error");
  }

  if (isDev) {
    await mainWindow.loadURL("http://localhost:1234");
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadURL(
      `file://${path.join(__dirname, "../parcel-build/index.html")}`
    );
  }

  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on("close", () => {
    if (transferWindow) {
      transferWindow.close();
      transferWindow = null;
    }
  });

  if (authWindow) {
    destroyAuthWin();
  }
};

function createAuthWindow(provider: "google" | "kakao") {
  if (mainWindow) {
    mainWindow.close();
  }

  authWindow = new BrowserWindow({
    width: 414,
    height: APP_HEIGHT,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  authWindow.removeMenu();
  authWindow.setResizable(false);

  const url =
    provider === "google"
      ? getAuthenticationGoogleURL()
      : getAuthenticationKakaoURL();

  authWindow.loadURL(url, { userAgent: "Chrome" });

  const {
    session: { webRequest },
  } = authWindow.webContents;

  const filter = {
    urls: ["http://localhost/callback*"],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    await loadTokens(url, provider);
    return showWindow();
  });
}

showWindow = async () => {
  try {
    return createWindow();
  } catch (err) {
    logger("show-window", err?.message, "error");
  }
};

app.on("ready", showWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("logout", async () => {
  await resetDb();
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
    showWindow();
  }
});

ipcMain.handle("open-auth-window", (_, provider) => {
  createAuthWindow(provider);
});

ipcMain.handle("open-transfer-window", async (_, args) => {
  try {
    if (!transferWindow) {
      transferWindow = new BrowserWindow({
        width: 380,
        height: TRANSFER_WINDOW_HEIGHT,
        frame: false,
        webPreferences: {
          nodeIntegration: false,
          preload: path.resolve(__dirname, "preload.js"),
        },
      });

      transferWindow.removeMenu();
      transferWindow.setResizable(false);

      if (isDev) {
        await transferWindow.loadURL("http://localhost:1234/#transfer");
        transferWindow.webContents.openDevTools();
      } else {
        await transferWindow.loadURL(
          `file://${path.join(
            __dirname,
            "../parcel-build/index.html#transfer"
          )}`
        );
      }

      if (transferWindow) {
        transferWindow.webContents.send("send-transfer-data", args);
      }

      transferWindow.webContents.on("new-window", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
      });
      transferWindow.on("close", () => {
        if (transferWindow) {
          transferWindow = null;
        }
      });
    }
  } catch (error) {
    logger("transfer-window", error?.message, "error");
  }
});

ipcMain.handle("close-transfer-window", () => {
  if (transferWindow) {
    transferWindow.close();
    transferWindow = null;
  }
});

ipcMain.handle("check-transfer-window", () => !!transferWindow);

ipcMain.handle("request-balance-refetch", async () => {
  mainWindow.webContents.send("refetch-balances");
});

process.on("uncaughtException", (uncaughtException) => {
  logger("uncaught-exception", uncaughtException, "error");
});
