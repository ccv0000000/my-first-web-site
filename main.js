const http = require("http");
const fs = require("fs");
const url = require("url");
function templateHTML(title, list, body) {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8" />
  </head>

  <body>
  <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
</html>
  `;
}
function templateList(fileList) {
  let list = "<ul>";
  for (let i = 0; i < fileList.length; i++) {
    list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
  }
  list += "</ul>";
  return list;
}

var server = http.createServer(function (request, response) {
  let queryData = request.url;
  let params = new URL("http://localhost:3000" + queryData).searchParams;
  let pathName = new URL("http://localhost:3000" + queryData).pathname;

  if (pathName === "/") {
    if (!params.get("id")) {
      let title = "Welcome";
      let description = "Hi!!";
      fs.readdir("./data", function (error, fileList) {
        let list = templateList(fileList);
        let template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      let title = params.get("id");
      fs.readdir("./data", function (error, fileList) {
        let list = templateList(fileList);
        fs.readFile(`data/${params.get("id")}`, "utf8", function (error, description) {
          let template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
server.listen(3000);
