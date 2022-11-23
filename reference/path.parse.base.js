let path = require("path");
const password = require("./path.parse.base_password");

console.log(path.parse("../password"));
console.log(path.parse("../password").base);
