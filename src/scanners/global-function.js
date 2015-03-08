'use strict';

var REGEX_LINE_CONTAINS_FUNCTION = /^\s*function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^\(\)]*\)\s*.*$/;

module.exports = {
  scan: function(path, text, lines) {
    var match;
    var matches = [];

    for (var i = 0; i < lines.length; i++)
    {
      match = lines[i].match(REGEX_LINE_CONTAINS_FUNCTION);

      if (match === null) { continue; }

      matches.push([match[1], path, match[0]]);
    }

    return matches;
  }
};
