'use strict';

var fs = require('fs');
var MetaScanner = require('./MetaScanner.js');

var DIRECTORY_SEPARATOR = '/';

module.exports = {
  _initMetaScanner: function() {
    MetaScanner.useScanner('./scanners/global-function.js');
    // MetaScanner.useScanner('./scanners/method.js');
  },

  _renderTags: function(tags) {
    var renderedTags = [];

    if (!tags.length) { return renderedTags; }

    for (var i = 0; i < tags.length; i++)
    {
      // Remove './' from beginning of file path, if it exists.
      if (tags[i][1].substring(0, 1) === './') { tags[i][1] = tags[i][1].substring(2) };

      renderedTags.push(tags[i][0] + '\t' + tags[i][1] + '\t'  + '/^' + tags[i][2] + '$/');
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

    this._initMetaScanner();

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
        tags = tags.concat(this._scanFile(currentNode));
      }
    }

    this._writeTagsFile(tags);

    console.log('Tags file written!');
  },

  _scanFile: function(path) {
    var tags = MetaScanner.scan(path);

    return tags;
  },

  _writeTagsFile: function(tags) {
    var renderedTags = this._renderTags(tags);

    var sortedTags = renderedTags.sort();

    var data = sortedTags.join('\n');

    fs.writeFileSync('tags', data, {
      encoding: 'utf8'
    });
  }
};
