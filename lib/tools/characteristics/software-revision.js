var util = require('util'),
    bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SoftwareRevisionCharacteristic(software) {
  SoftwareRevisionCharacteristic.super_.call(this, {
    uuid: '2a28',
    properties: ['read'],
    value: new Buffer(software),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Software Revision String'
      })
    ]
  });
}

util.inherits(SoftwareRevisionCharacteristic, BlenoCharacteristic);

module.exports = SoftwareRevisionCharacteristic;

