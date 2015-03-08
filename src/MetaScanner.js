'use strict';

var FS   = require('fs');
var Path = require('path');

module.exports = {
  _scanners: [],

  _isScannableFile: function(path) {
    if (Path.extname(path) === '.js') { return true; }

    return false;
  },

  _isValidScanner: function(scanner) {
    if (!scanner) { return false; }
    if (typeof scanner.scan !== 'function') { return false; }

    return true;
  },

  useScanner: function(scanner) {
    var newScanner = require(scanner);

    if (this._isValidScanner(newScanner))
    {
      this._scanners.push(newScanner);
    }
  },
  
  scan: function(path) {
    var allTags = [];

    if (!this._isScannableFile(path)) { return allTags; }

    console.log('Scanning: ' + path);

    var scannerTags = [];
    var options     = { encoding: 'utf8', flag: 'r' };
    var text        = FS.readFileSync(path, options);
    var lines       = text.split('\n');

    for (var i in this._scanners)
    {
      scannerTags = this._scanners[i].scan(path, text, lines);

      if (!scannerTags instanceof Array) { continue; }

      allTags = allTags.concat(scannerTags);
    }

    return allTags;
  }
};
