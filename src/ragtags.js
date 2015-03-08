'use strict';

process.title = 'ragtags';

var FS          = require('fs');
var Path        = require('path');
var MetaScanner = require('./MetaScanner.js');

module.exports = {
  _initMetaScanner: function() {
    MetaScanner.useScanner('./scanners/global-function.js');
    // MetaScanner.useScanner('./scanners/method.js');
  },

  _isHiddenPath: function(path) {
    if (path === '.') { return false; }

    return Path.basename(path)[0] === '.';
  },

  _renderTags: function(tags) {
    var renderedTags = [];

    if (!tags.length) { return renderedTags; }

    for (var i = 0; i < tags.length; i++)
    {
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
      return currentNode + Path.sep + childNode;
    }

    while (nodes.length !== 0)
    {
      currentNode = nodes.shift();

      if (this._isHiddenPath(currentNode)) { continue; }

      currentNodeStat = FS.statSync(currentNode);

      if (currentNodeStat.isDirectory())
      {
        nodes = FS.readdirSync(currentNode)
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
    // Remove './' from beginning of file path, if it exists.
    if (path.substring(0, 2) === './') {
      path = path.substring(2);
    }

    var tags = MetaScanner.scan(path);

    return tags;
  },

  _writeTagsFile: function(tags) {
    var renderedTags = this._renderTags(tags);

    var sortedTags = renderedTags.sort();

    var data = sortedTags.join('\n');

    FS.writeFileSync('tags', data, {
      encoding: 'utf8'
    });
  }
};
