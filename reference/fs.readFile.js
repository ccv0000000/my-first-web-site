const fs = require("fs");

//동기
console.log("a");
let result = fs.readFileSync("reference/sync_sample.txt", "utf8");
console.log(result);
console.log("c");

////////////////////////////////////////////////////////////////////////////////

//비동기
console.log("a");
fs.readFile("reference/sync_sample.txt", "utf8", function (error, result) {
  console.log(result);
});
console.log("c");
