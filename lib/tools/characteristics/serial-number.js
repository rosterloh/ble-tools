var util = require('util'),
    bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SerialNumberCharacteristic(serial) {
  SerialNumberCharacteristic.super_.call(this, {
    uuid: '2a25',
    properties: ['read'],
    value: new Buffer(serial),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Serial Number String'
      })
    ]
  });
}

util.inherits(SerialNumberCharacteristic, BlenoCharacteristic);

module.exports = SerialNumberCharacteristic;

