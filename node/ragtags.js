var fs = require('fs');

var DIRECTORY_SEPARATOR = '/';

var REGEX_LINE_CONTAINS_FUNCTION = /^\s*function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^\(\)]*\)\s*.*$/;

var nodes = ['.'];
var currentNode;
var currentNodeStat;
var children;

function childNodePath(childNode){
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
    analyse(currentNode);
  }
}

function analyse(path) {
  var file;

  var options = {
    encoding: 'utf8',
    flag:     'r'
  };

  var contents = fs.readFileSync(path, options);

  var functions = findFunctions(contents);
}

function findFunctions(js) {
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
}
