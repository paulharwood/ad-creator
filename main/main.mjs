import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import { dirname, resolve, join } from "path";

const __dirname = resolve(dirname(''));
console.log(__dirname);

const appServe = app.isPackaged ? serve({
  directory: join(__dirname, "../out")
}) : null;

const createWindow = () => {
  const win = new BrowserWindow({
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 10, y: 10 },
    width: 1680,
    height: 1224,
    nodeIntegration: true,
    webPreferences: {
      preload: join(__dirname, "main/preload.mjs")
    }
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000/dashboard");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin"){
        app.quit();
    }
});