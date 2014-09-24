var util = require('util'),
    bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var ManufacturerNameCharacteristic = require('../characteristics/manufacturer-name');
var ModelNumberCharacteristic = require('../characteristics/model-number');
var SerialNumberCharacteristic = require('../characteristics/serial-number');
var HardwareRevisionCharacteristic = require('../characteristics/hardware-revision');
var FirmwareRevisionCharacteristic = require('../characteristics/firmware-revision');
var SoftwareRevisionCharacteristic = require('../characteristics/software-revision');

function DeviceInformationService(info) {
  this.info = {
    manufacturer: info.manufacturer || 'BleTools',
    model: info.model || 'MODEL', 
    serial: info.serial || '1234567890', 
    hardware: info.hardware || 'Rev A', 
    firmware: info.firmware || '0001', 
    software: info.software || '1.00.123'
  },
  DeviceInformationService.super_.call(this, {
    uuid: '180a',
    characteristics: [
      new ManufacturerNameCharacteristic(this.info.manufacturer),
      new ModelNumberCharacteristic(this.info.model),
      new SerialNumberCharacteristic(this.info.serial),
      new HardwareRevisionCharacteristic(this.info.hardware),
      new FirmwareRevisionCharacteristic(this.info.firmware),
      new SoftwareRevisionCharacteristic(this.info.software)
    ]
  });
}

util.inherits(DeviceInformationService, BlenoPrimaryService);

module.exports = DeviceInformationService;
