import { app } from "electron";
import PouchDB from "pouchdb";

const db = new PouchDB(`${app.getPath("appData")}/conun-db`);

export async function prepareDb() {
  try {
    await db.get("transactions");
  } catch {
    const newTransactions: any = {
      _id: "transactions",
      list: [],
    };

    await db.put(newTransactions);
  }

  try {
    await db.get("userDetails");
  } catch {
    const userDetails: any = {
      _id: "userDetails",
      pass: "",
      askForPassword: true,
    };
    await db.put(userDetails);
  }

  try {
    await db.get("appData");
  } catch {
    const appData: any = {
      _id: "appData",
      drivePath: "",
    };

    await db.put(appData);
  }
}

export async function resetDb() {
  const transactions = await db.get("transactions");
  const newTransactions: any = {
    _id: "transactions",
    _rev: transactions._rev,
    list: [],
  };

  await db.put(newTransactions);

  const userDetails = await db.get("userDetails");

  const newUserDetails: any = {
    _id: "userDetails",
    _rev: userDetails._rev,
    pass: "",
    askForPassword: true,
  };
  await db.put(newUserDetails);

  const appData = await db.get("appData");

  const newAppData: any = {
    _id: "appData",
    _rev: appData._rev,
    drivePath: "",
  };

  await db.put(newAppData);
}

export default db;
