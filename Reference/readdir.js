const fs = require("fs");

fs.readdir("./data", function (error, fileList) {
  console.log(fileList);
});
