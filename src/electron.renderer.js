// This file is a electron/angular-cli hackfix (simple non-transformed .js file included via 'scripts' in angular-cli.json).
// node.js modules can only be accessed from this file, node.js modules are stripped from all other files by angular-cli/webpack. 

var electron = require('electron').remote;
var ipcRenderer = require('electron').ipcRenderer;
var elementResizeEvent = require('element-resize-event'); // https://github.com/KyleAMathews/element-resize-event

// auto-resize window to dynamically fit its contents
setTimeout(function() {
    document.body.style.overflow = 'hidden'; // hide global scrollbars since offsetWidth/offsetHeight do not include scrollbar width/height somehow..  
    var element = document.getElementById("app-root").children[0];
    elementResizeEvent(element, function() {
        electron.getCurrentWindow().setContentSize(element.offsetWidth, element.offsetHeight, false);
    });
}, 1000); // TODO: replace with 'onloaded' event or simliar

// exports for UI
window.app = {
    "minimize": function() {
        electron.getCurrentWindow().hide();
    },

    "triggerSearch": function(query, results) {
        console.info(`Triggering search: '${query}'`);

        ipcRenderer.on('searchProgress', function(event, arg) {
            console.debug("searchProgress", arg);
            results.next(arg);
        });
        ipcRenderer.on('searchFinished', function(event) {
            console.debug("searchFinished");
            results.complete();
        });
        
        ipcRenderer.send('search', query);
    },

    "triggerAction": function(wedge, uri) {
        console.info(`Triggering wedge: '${wedge}'/'${uri}'`);

        // load wedges
        var wedges = loadWedges();

        // trigger action in appropriate wedge
        wedges[wedge].action(uri);
    },
}