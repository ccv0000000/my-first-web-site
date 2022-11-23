const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
function templateHTML(title, list, body, control) {
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
    ${control}
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
        let template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      let title = params.get("id");
      fs.readdir("./data", function (error, fileList) {
        let list = templateList(fileList);
        fs.readFile(`data/${params.get("id")}`, "utf8", function (error, description) {
          let template = templateHTML(
            title,
            list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>
             <a href="/update?id=${title}">update</a>
             <form action="http://localhost:3000/delete_process" method="post">
              <input type="hidden" name="id" value=${title}>
              <input type="submit" value="delete">
             </form>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathName === "/create") {
    let title = "WEB - create";
    fs.readdir("./data", function (error, fileList) {
      let list = templateList(fileList);
      let template = templateHTML(
        title,
        list,
        `
      <form action="http://localhost:3000/create_process" method="post">
      <p><input type="text" , name="title" placeholder="title"/></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit" />
      </p>
    </form>
      `,
        ""
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathName === "/create_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (error) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathName === "/update") {
    let title = params.get("id");
    fs.readdir("./data", function (error, fileList) {
      let list = templateList(fileList);
      fs.readFile(`data/${params.get("id")}`, "utf8", function (error, description) {
        let template = templateHTML(
          title,
          list,
          `
          <form action="http://localhost:3000/update_process" method="post">
          <input type="hidden", name="id", value="${title}">
          <p><input type="text" , name="title" placeholder="title" value="${title}"/></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathName === "/update_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let id = post.id;
      let title = post.title;
      let description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, "utf8", function (error) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathName === "/delete_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let id = post.id;
      fs.unlink(`data/${id}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
server.listen(3000);
