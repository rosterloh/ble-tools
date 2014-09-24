var util = require('util'),
    bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function HardwareRevisionCharacteristic(hardware) {
  HardwareRevisionCharacteristic.super_.call(this, {
    uuid: '2a27',
    properties: ['read'],
    value: new Buffer(hardware),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Hardware Revision String'
      })
    ]
  });
}

util.inherits(HardwareRevisionCharacteristic, BlenoCharacteristic);

module.exports = HardwareRevisionCharacteristic;

