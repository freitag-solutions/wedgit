// This file is a electron/angular-cli hackfix (simple non-transformed .js file included via 'scripts' in angular-cli.json).
// node.js modules can only be accessed from this file, node.js modules are stripped from all other files by angular-cli/webpack. 

var electron = require('electron').remote;
var elementResizeEvent = require('element-resize-event'); // https://github.com/KyleAMathews/element-resize-event
var path = require('path');
var fs = require('fs');

function loadWedges() {
    console.debug("Loading wedges");
    
    var wedges = {};

    // scan through 'wedgesDirectory'
    var modulesDir = path.resolve(electron.getGlobal('wedgesDirectory'));
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
                    console.warn(`Could not load wedge '${key}' from '${moduleDir}', not of type IWedge.`);
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

    "triggerSearch": function(query) {
        console.info(`Triggering search: '${query}'`);
        
        var results = [];

        // load wedges
        var wedges = loadWedges();

        // trigger search in all wedges
        for (var key in wedges) {
            var wedge = wedges[key];

            // search 
            var wedgeItems = wedge.search(query);

            // sanitize results
            wedgeItems = wedgeItems.filter(function (item) {
                if (!(typeof(item.uri) === "string" && typeof(item.title) === "string")) { // validate interface 
                    console.warn(`Skipped illegal search result from '${key}', not of type IWedgeItem`, item);
                    return false;
                }
                return true;
            });
            wedgeItems.forEach(function (item) {
                item.wedge = key;
            });

            // add to global search results
            results = results.concat(wedgeItems);
        }

        console.debug("Loaded search results", results);

        return results;
    },

    "triggerAction": function(wedge, uri) {
        console.info(`Triggering wedge: '${wedge}'/'${uri}'`);

        // load wedges
        var wedges = loadWedges();

        // trigger action in appropriate wedge
        wedges[wedge].action(uri);
    },
}