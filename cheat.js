var fs = require('fs');

 
var input = fs.readFileSync("data/beirut.json");
input = JSON.parse(input);

console.log(input);

var output = [];

for (var i = 0; i < input.length; i++) {
    output.push({
        total: input.total * 2
    });
}

console.log(output);