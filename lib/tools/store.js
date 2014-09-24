var fs = require('fs'),
    path = require('path');

var ToolsStore = function(fileName) {
  this.data = {};

  if(!fileName) return this;

  this.fileName = fileName;
  if(fileName.indexOf('.') < 0) {
    this.fileName += '.data';
  }

  this.homeDir = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH;

  this.privateDir = path.join(this.homeDir, '.ble-tools');

  if(!fs.existsSync(this.privateDir)) {
    fs.mkdirSync(this.privateDir);
  }

  this.filePath = path.join(this.privateDir, this.fileName);

  try {
    this.data = JSON.parse(fs.readFileSync(this.filePath));
  } catch(e) {}

  return this;
};

ToolsStore.prototype.get = function(k) {
  if(k) {
    return this.data[k];
  }
  return this.data;
};

ToolsStore.prototype.set = function(k, v) {
  this.data[k] = v;
};

ToolsStore.prototype.remove = function(k) {
  delete this.data[k];
};

ToolsStore.prototype.save = function() {
  try {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  } catch(e) {
    console.error('Unable to save ionic data:', this.filePath, e);
  }
};

exports.ToolsStore = ToolsStore;
