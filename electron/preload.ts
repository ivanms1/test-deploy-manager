import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  createWallet: (args: { password: string; walletType: string }) =>
    ipcRenderer.invoke("create-wallet", args),
  logout: () => ipcRenderer.invoke("logout"),
  getProfile: () => ipcRenderer.invoke("get-profile"),
  signGenerator: (values: any) =>
    ipcRenderer.invoke("generate-signature", values),
  openTransferWindow: (values: any) =>
    ipcRenderer.invoke("open-transfer-window", values),
  listenToTransferData: (fn: any) => {
    ipcRenderer.on("send-transfer-data", (e, ...args) => fn(...args));
  },
  closeTransferWindow: () => ipcRenderer.invoke("close-transfer-window"),
  requestBalanceRefetch: () => ipcRenderer.invoke("request-balance-refetch"),
  listenToRefetchRequest: (fn: any) => {
    ipcRenderer.on("refetch-balances", () => fn());
  },
  checkTransaction: (txHash: string) =>
    ipcRenderer.invoke("check-transaction", txHash),
  createQrCode: (args: any) => ipcRenderer.invoke("create-qr-code", args),
  getRecentTransactions: () => ipcRenderer.invoke("get-recent-transactions"),
  setRecentTransacton: (transaction: any) =>
    ipcRenderer.invoke("set-recent-transaction", transaction),
  savePass: (data: any) => ipcRenderer.invoke("save-pass", data),
  getCurrentUser: () => ipcRenderer.invoke("get-current-user"),
  checkTransferWindow: () => ipcRenderer.invoke("check-transfer-window"),
  openDrive: () => ipcRenderer.invoke("open-drive"),
  listenIsDriveOpen: (fn: any) => {
    ipcRenderer.on("is-drive-open", (e, ...args) => fn(...args));
  },
  setCurrentUser: (currentUser: any) =>
    ipcRenderer.invoke("set-current-user", currentUser),
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  startWebSocket: () => ipcRenderer.invoke("start-websocket"),
});
