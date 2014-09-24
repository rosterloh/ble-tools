var util = require('util'),
    bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function FirmwareRevisionCharacteristic(firmware) {
  FirmwareRevisionCharacteristic.super_.call(this, {
    uuid: '2a26',
    properties: ['read'],
    value: new Buffer(firmware),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Firmware Revision String'
      })
    ]
  });
}

util.inherits(FirmwareRevisionCharacteristic, BlenoCharacteristic);

module.exports = FirmwareRevisionCharacteristic;

