var argv = require('optimist').argv,
    colors = require('colors'),
    Task = require('./task').Task,
    bleno = require('bleno'),
    DeviceInformationService = require('./services/device-information');

var DEFAULT_DEVICE_NAME = 'BleTools';

var ToolsTask = function() {};

ToolsTask.prototype = new Task();

ToolsTask.prototype.run = function(tools) {
  this.tools = tools;
  var self = this;

  this.loadSettings(function(){
    
    self.start(tools);

    if(tools.hasFailed) return;

  });  
};

ToolsTask.prototype.loadSettings = function(cb) {
  var self = this;

  this.devName = argv.name || argv.n || DEFAULT_DEVICE_NAME;
  this.advertising = argv.advertise || argv.a;

  var deviceInformationService = new DeviceInformationService({model: this.devName});
  this.serviceIds = ['180a']; // Device Information Service as default
  this.services = [deviceInformationService];

  cb();

  process.stdin.on('readable', function() {
    var input = process.stdin.read();
    if(input === null) return;
    input = (input + '').trim();

    if(input == 'advertise' || input == 'a') {
      self.advertising = !self.advertising;
      /*
      var scanData = new Buffer(0); // maximum 31 bytes
      var advertisementData = new Buffer(15); // maximum 31 bytes

      advertisementData[0] = 0x03; // Length
      advertisementData[1] = 0x03; // Parameter: Service List
      advertisementData[2] = 0xD8; // URI Beacon ID
      advertisementData[3] = 0xFE; // URI Beacon ID
      advertisementData[4] = 0x0A; // Length
      advertisementData[5] = 0x16; // Service Data
      advertisementData[6] = 0xD8; // URI Beacon ID
      advertisementData[7] = 0xFE; // URI Beacon ID
      advertisementData[8] = 0x00; // Flags
      advertisementData[9] = 0x20; // Power
      advertisementData[10] = 0x00; // http://www.
      advertisementData[11] = 0x61; // a
      advertisementData[12] = 0x62; // b
      advertisementData[13] = 0x63; // c
      advertisementData[14] = 0x07; // .com

      bleno.startAdvertisingWithEIRData(advertisementData, scanData);
      */
      console.log('Advertising: '.green + (self.advertising ? 'enabled' : 'disabled'));
      self.advertising ? bleno.startAdvertising(self.devName, self.serviceIds) : bleno.stopAdvertising();

    } else if(input.indexOf('service ') === 0 || input.indexOf('s ') === 0) {
      var uuid = input.replace('service ', '').replace('s ', '');
      self._addService(uuid);

    } else if(input == 'help' || input == 'h') {
      self.printCommandTips();

    } else if(input == 'quit' || input == 'q') {
      process.exit();

    } else if(input == 'clear' || input == 'clr') {
      process.stdout.write("\u001b[2J\u001b[0;0H");

    } else {
      console.log('\nInvalid peripheral command'.error.bold);
      self.printCommandTips();
    }
  });
}

ToolsTask.prototype.printCommandTips = function(tools) {
  console.log('Peripheral commands, enter:'.green.bold);
  console.log('  advertise' + ' or '.green + 'a' + ' to enable/disable advertising'.green);
  console.log('  service' + ' or '.green + 's' + ' and a service UUID to add a service'.green);
  console.log('  quit' + ' or '.green + 'q' + ' to shutdown the server and exit'.green);
  console.log('');
};

ToolsTask.prototype.start = function(tools) {
  try {
    var self = this;

    bleno.on('stateChange', function(state) {
      console.log('bleno.stateChange: ' + state);
    });

    bleno.on('advertisingStart', function(err) {
      if (!err) {
        bleno.setServices(self.services);
      } else {
        console.log('bleno.advertisingStart error: '.red + err);
      }
    });

    bleno.on('advertisingStop', function() {
      console.log('Advertising stopped');
    });

    bleno.on('advertisingStop', function() {
      console.log('Advertisement stopped');
    });

    bleno.on('serviceSet', function() {
      console.log('Service set');
    });

    bleno.on('accept', function(clientAddress) {
      console.log('Connection accepted from ' + clientAddress);
    });

    bleno.on('disconnect', function(clientAddress) {
      console.log('Client ' + clientAddress + ' disconnected');
    });

    bleno.on('rssiUpdate', function(rssi) {
      console.log('RSSI update: ' + rssi + 'dBm');
    });

    console.log('Running peripheral:'.green.bold, this.devName);    
    self.printCommandTips();
  } catch(e) {
    var msg;
    msg = ('peripheral start error: ' + e).error.bold;
    console.log(msg);
    process.exit(1);
  }
};

ToolsTask.prototype._addService = function(uuid) {
  console.log( ('TODO').red );
};

exports.ToolsTask = ToolsTask;
