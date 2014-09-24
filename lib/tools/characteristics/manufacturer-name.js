var util = require('util'),
    bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function ManufacturerNameCharacteristic(manufacturer) {
  ManufacturerNameCharacteristic.super_.call(this, {
    uuid: '2a29',
    properties: ['read'],
    value: new Buffer(manufacturer),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Manufacturer Name String'
      })
    ]
  });
}

util.inherits(ManufacturerNameCharacteristic, BlenoCharacteristic);

module.exports = ManufacturerNameCharacteristic;
