var inttodate = require('./inttodate.js');

for(var i=0; i<20; i++) {
    var d = Math.floor(Math.random() * 12).toString();
    var m = Math.floor(Math.random() * 31).toString();
    var y = Math.floor(Math.random() * 2000).toString();

    var rndStr = m + d + y;

    console.log("\n%s/%s/%s -> %s\n" , m,d,y, rndStr, inttodate(parseInt(rndStr)));
}


console.log('1311806\n', inttodate(1311806));
console.log('1211664\n', inttodate(1211664));

console.log('56814\n', inttodate(56814));
console.log('26205\n', inttodate(26205));
console.log('91345\n', inttodate(91345));
console.log('78228\n', inttodate(78228));
console.log('89411\n', inttodate(89411));

/*
TODO

 56814 // show a three-digit year
 26205
 91345
 78228
 89411
 1801275
 1211664
 1311806

 160249 //fix leading zero in the year "0249"

 [ { x: '1', y: '09' }, { x: '10', y: '9' } ] //TODO check when b.len == 2 then a.len should be also 2
 1091253 [ { d: 9, m: 1, y: 1253 },
 { d: 1, m: 9, y: 1253 },
 { d: 9, m: 10, y: 1253 },
 { d: 10, m: 9, y: 1253 } ]


 */