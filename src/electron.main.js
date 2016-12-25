const {app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain } = require('electron');
const electronDebug = require('electron-debug');

const { Subject } = require('@reactivex/rxjs');
const path = require('path');
const fs = require('fs');

// config
const iconPath = `${__dirname}/../dist/favicon.ico`;
let wedgesDirectory  = "wedges";
if (process.argv.length > 2) {
  wedgesDirectory = process.argv[2];
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function showWindow() {
  win.show(); // also sets focus
}
function hideWindow() {
  win.hide(); // send to tray
}
function toggleWindow() {
  if (!win.isVisible() || !win.isFocused()) {
    showWindow();
  } else {
    hideWindow();
  }
}
function showDevTools() {
  win.show();
  electronDebug.openDevTools(win, "undocked");
}

function createWindow() {
  // Create the browser window.
  // see: https://github.com/electron/electron/blob/master/docs/api/frameless-window.md
  win = new BrowserWindow({ width: 600, height: 74, useContentSize: true, frame: false, transparent: false, resizable: false, alwaysOnTop: false });

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/../dist/index.html`);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });


  // Create tray icon
  appIcon = new Tray(iconPath);
  appIcon.setToolTip('wedg.it');

  appIcon.on('click', () => {
    toggleWindow();
  });

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Toggle DevTools',
      accelerator: 'CommandOrControl+Shift+I',
      click: function() {
        showDevTools();
      }
    },
    {
      label: 'Quit',
      role: 'quit'
    }
  ]);
  appIcon.setContextMenu(contextMenu);
  Menu.setApplicationMenu(contextMenu); // also register as application menu for registering 'accelerator's 


  // Register global shortcut
  if (!globalShortcut.register('CommandOrControl+Q', () => {
    toggleWindow();
  })) {
    console.log('Global shortcut registration failed');
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

console.debug = console.log;
function loadWedges() {
    console.debug("Loading wedges");
    
    var wedges = {};

    // scan through 'wedgesDirectory'
    var modulesDir = path.resolve(wedgesDirectory);
    console.debug(`Scanning for wedges in '${modulesDir}'`);
    fs.readdirSync(modulesDir).forEach(function(file) {
        // load modules 
        var moduleDir = path.join(modulesDir, file);
        console.debug(`Loading wedges from '${moduleDir}'`);
        try {
            var module = require(moduleDir);

            // load wedges
            var moduleWedges = module.wedges; 
            if (!(moduleWedges instanceof Object)) { // validate interface 
                console.warn(`Could not load wedges from '${moduleDir}', module should export a 'wedges' dictionary of kind {key: IWedge}`);
                return;
            }

            // merge all wedges into global dictionary, overwrite existing keys
            for (var key in moduleWedges) {
                var wedge = moduleWedges[key];

                if (!(typeof(wedge.search) === "function" && typeof(wedge.action) === "function")) { // validate interface 
                    console.warn(`Could not load wedge '${key}' from '${moduleDir}', not of type IWedge`, wedge);
                    continue;
                }

                if ((key in wedges)) {
                    console.warn(`Duplicate wedge with key '${key}' (loaded from '${moduleDir}')`);
                }

                wedges[key] = moduleWedges[key]; 
                console.debug(`Loaded wedge '${key}' from '${moduleDir}'`);
            }
        } catch (err) { 
            console.warn(`Loading wedges from '${moduleDir}' FAILED`, err);
        }
    });

    console.info("Loaded wedges", Object.keys(wedges));

    return wedges;
}
ipcMain.on('search', function (event, query) {
  console.info(`Triggering search: '${query}'`);

  // load wedges
  var wedges = loadWedges();

  // trigger search in all wedges
  var results = new Subject();
  results
    .subscribe(
      wedgeItem => { event.sender.send('searchProgress', wedgeItem); }, // TODO: sanitize/typecheck results?
      () => { event.sender.send('searchFinished'); },
      () => { event.sender.send('searchFinished'); });

  for (var key in wedges) {
    var wedge = wedges[key];

    // search 
    wedge.search(query, results);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.