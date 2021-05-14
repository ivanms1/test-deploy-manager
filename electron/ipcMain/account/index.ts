import { ipcMain } from "electron";

import { getProfile } from "../../services/auth-service";

import {
  createWallet,
  saveKeyStoreJson,
  createQrCode,
  saveQrCode,
} from "../../services/wallet-services";

import db from "../../store/db";

ipcMain.handle("get-profile", () => {
  return getProfile();
});

ipcMain.handle("create-wallet", async (_, args) => {
  const data = await createWallet(args);
  return data;
});

ipcMain.handle("export-key-store", async (_, args) => {
  const res = await saveKeyStoreJson(args.keyStore);
  return res;
});

ipcMain.handle("create-qr-code", async (_, args) => {
  const res = await createQrCode(args);
  return res;
});

ipcMain.handle("download-qr-code", async (_, args) => {
  const res = await saveQrCode(args.qrCode);
  return res;
});

ipcMain.handle("save-pass", async (_, args) => {
  const userDetails: { pass: string } = await db.get("userDetails");

  userDetails.pass = args?.password;

  return db.put(userDetails);
});

ipcMain.handle("get-current-user", async () => {
  return db.get("userDetails");
});
