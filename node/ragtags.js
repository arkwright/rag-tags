var fs = require('fs');

var DIRECTORY_SEPARATOR = '/';

var REGEX_LINE_CONTAINS_FUNCTION = /^\s*function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^\(\)]*\)\s*.*$/;

var nodes = ['.'];
var currentNode;
var currentNodeStat;
var children;
var tags = [];
var tagsFile;

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
    tags = tags.concat(renderTags(analyse(currentNode), currentNode));
  }
}

writeTagsFile(tags);

function childNodePath(childNode){
  return currentNode + DIRECTORY_SEPARATOR + childNode;
}

function analyse(path) {
  var file;

  var options = {
    encoding: 'utf8',
    flag:     'r'
  };

  var contents = fs.readFileSync(path, options);

  var functions = findFunctions(contents);

  return functions;
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

function renderTags(tags, path) {
  var renderedTags = [];

  if (!tags.length) { return renderedTags; }

  for (var i = 0; i < tags.length; i++)
  {
    renderedTags.push(tags[i][1] + '\t' + path + '\t'  + '/^' + tags[i][0] + '$/');
  }

  return renderedTags;
}

function writeTagsFile(tags) {
  tags = tags.sort();

  var data = tags.join('\n');

  fs.writeFileSync('tags', data, {
    encoding: 'utf8'
  });
}
