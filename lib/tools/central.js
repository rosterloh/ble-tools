var argv = require('optimist').argv,
    Task = require('./task').Task;

var ToolsTask = function() {};

ToolsTask.prototype = new Task();

ToolsTask.prototype.run = function(tools) {
}

exports.ToolsTask = ToolsTask;
