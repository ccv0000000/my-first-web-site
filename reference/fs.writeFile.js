const fs = require("fs");

let title = "a";
let description = "a is ...";

fs.writeFile(`data/${title}`, description, function (error) {
  if (error) throw error;
  console.log("The file had been saved!!");
});
