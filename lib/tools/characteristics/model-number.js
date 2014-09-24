var util = require('util'),
    bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function ModelNumberCharacteristic(model) {
  ModelNumberCharacteristic.super_.call(this, {
    uuid: '2a24',
    properties: ['read'],
    value: new Buffer(model),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Model Number String'
      })
    ]
  });
}

util.inherits(ModelNumberCharacteristic, BlenoCharacteristic);

module.exports = ModelNumberCharacteristic;

