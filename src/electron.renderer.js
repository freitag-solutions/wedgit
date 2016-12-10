// auto-resize window to dynamically fit its contents
// NOTE: this in in index.html since this is the only place where the original node.js environment is available
// TODO: get rid of angular-cli which uses unconfigurable webpack which replaces all node packages with browser shims
var electron = require('electron').remote;
var elementResizeEvent = require('element-resize-event'); // https://github.com/KyleAMathews/element-resize-event

setTimeout(function() {
    document.body.style.overflow = 'hidden'; // hide global scrollbars since offsetWidth/offsetHeight do not include scrollbar width/height somehow..  
    var element = document.getElementById("app-root").children[0];
    elementResizeEvent(element, function() {
        electron.getCurrentWindow().setContentSize(element.offsetWidth, element.offsetHeight, false);
    });
}, 1000); // TODO: replace with 'onloaded' event or simliar

window.app = {
    "minimize": function() {
        electron.getCurrentWindow().hide();
    }
}