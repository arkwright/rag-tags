'use strict';

module.exports = {
  scan: function(path, text, lines, ast) {
    var body  = ast.body;

    var currentNode;
    var functions = [];
    var nodes = [].concat(body);

    while (nodes.length !== 0)
    {
      currentNode = nodes.shift();

      switch(currentNode.type)
      {
        case 'FunctionDeclaration':
        case 'FunctionExpression':
          if (currentNode.id   &&   currentNode.id.name) {
            functions.push([currentNode.id.name, currentNode.id.loc.start.line]);
          }
          nodes = [currentNode.body].concat(nodes);
          break;
        case 'BlockStatement':
          nodes = currentNode.body.concat(nodes);
          break;
      }
    }

    var tags = functions.map(function(func){
      return [func[0], path, lines[func[1] - 1]];
    });

    return tags;
  }
};
