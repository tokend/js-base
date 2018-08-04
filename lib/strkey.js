"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.decodeCheck = decodeCheck;
exports.encodeCheck = encodeCheck;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var base32 = _interopRequire(require("base32.js"));

var crc = _interopRequire(require("crc"));

var contains = _interopRequire(require("lodash/includes"));

var isUndefined = _interopRequire(require("lodash/isUndefined"));

var isNull = _interopRequire(require("lodash/isNull"));

var isString = _interopRequire(require("lodash/isString"));

var versionBytes = {
  accountId: 48,
  balanceId: 8,
  seed: 144
};

function decodeCheck(versionByteName, encoded) {
  if (!isString(encoded)) {
    throw new TypeError("encoded argument must be of type String");
  }

  var decoded = base32.decode(encoded);
  var versionByte = decoded[0];
  var payload = decoded.slice(0, -2);
  var data = payload.slice(1);
  var checksum = decoded.slice(-2);

  if (encoded != base32.encode(decoded)) {
    throw new Error("invalid encoded string");
  }

  var expectedVersion = versionBytes[versionByteName];

  if (isUndefined(expectedVersion)) {
    throw new Error("" + versionByteName + " is not a valid version byte name.  expected one of \"accountId\" or \"seed\"");
  }

  if (versionByte !== expectedVersion) {
    throw new Error("invalid version byte. expected " + expectedVersion + ", got " + versionByte);
  }

  var expectedChecksum = calculateChecksum(payload);

  if (!verifyChecksum(expectedChecksum, checksum)) {
    throw new Error("invalid checksum");
  }

  return new Buffer(data);
}

function encodeCheck(versionByteName, data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error("cannot encode null data");
  }

  var versionByte = versionBytes[versionByteName];

  if (isUndefined(versionByte)) {
    throw new Error("" + versionByteName + " is not a valid version byte name.  expected one of \"accountId\" or \"seed\"");
  }

  data = new Buffer(data);
  var versionBuffer = new Buffer([versionByte]);
  var payload = Buffer.concat([versionBuffer, data]);
  var checksum = calculateChecksum(payload);
  var unencoded = Buffer.concat([payload, checksum]);

  return base32.encode(unencoded);
}

function calculateChecksum(payload) {
  // This code calculates CRC16-XModem checksum of payload
  // and returns it as Buffer in little-endian order.
  var checksum = new Buffer(2);
  checksum.writeUInt16LE(crc.crc16xmodem(payload), 0);
  return checksum;
}

function verifyChecksum(expected, actual) {
  if (expected.length !== actual.length) {
    return false;
  }

  if (expected.length === 0) {
    return true;
  }

  for (var i = 0; i < expected.length; i++) {
    if (expected[i] !== actual[i]) {
      return false;
    }
  }

  return true;
}