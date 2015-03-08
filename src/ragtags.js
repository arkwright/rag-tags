'use strict';

var fs = require('fs');

var DIRECTORY_SEPARATOR = '/';

var REGEX_LINE_CONTAINS_FUNCTION = /^\s*function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^\(\)]*\)\s*.*$/;

module.exports = {
  _analyse: function (path) {
    var file;

    var options = {
      encoding: 'utf8',
      flag:     'r'
    };

    var contents = fs.readFileSync(path, options);

    var functions = this._findFunctions(contents);

    return functions;
  },

  _findFunctions: function(js) {
    var lines = js.split('\n');
    var match;
    var matches = [];

    for (var i = 0; i < lines.length; i++)
    {
      match = lines[i].match(REGEX_LINE_CONTAINS_FUNCTION);

      if (match === null) { continue; }

      matches.push(match);
    }

    return matches;
  },

  _renderTags: function(tags, path) {
    var renderedTags = [];

    if (!tags.length) { return renderedTags; }

    for (var i = 0; i < tags.length; i++)
    {
      renderedTags.push(tags[i][1] + '\t' + path + '\t'  + '/^' + tags[i][0] + '$/');
    }

    return renderedTags;
  },

  scan: function() {
    var nodes = ['.'];
    var currentNode;
    var currentNodeStat;
    var children;
    var tags = [];
    var tagsFile;

    function childNodePath(childNode) {
      return currentNode + DIRECTORY_SEPARATOR + childNode;
    }

    while (nodes.length !== 0)
    {
      currentNode     = nodes.shift();
      currentNodeStat = fs.statSync(currentNode);

      if (currentNodeStat.isDirectory())
      {
        nodes = fs.readdirSync(currentNode)
        .map(childNodePath)
        .concat(nodes);
      }
      else if (currentNodeStat.isFile())
      {
        tags = tags.concat(this._renderTags(this._analyse(currentNode), currentNode));
      }
    }

    this._writeTagsFile(tags);
  },

  _writeTagsFile: function(tags) {
    tags = tags.sort();

    var data = tags.join('\n');

    fs.writeFileSync('tags', data, {
      encoding: 'utf8'
    });
  }
};
