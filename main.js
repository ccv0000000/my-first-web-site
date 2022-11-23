const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
let template = require("./lib/template.js");
let path = require("path");
let sanitizeHtml = require("sanitize-html");

let server = http.createServer(function (request, response) {
  let queryData = request.url;
  let params = new URL("http://localhost:3000" + queryData).searchParams;
  let pathName = new URL("http://localhost:3000" + queryData).pathname;

  if (pathName === "/") {
    if (!params.get("id")) {
      let title = "Welcome";
      let description = "Hi!!";
      fs.readdir("./data", function (error, fileList) {
        let list = template.list(fileList);
        let html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      let title = params.get("id");
      fs.readdir("./data", function (error, fileList) {
        let list = template.list(fileList);
        let filteredId = path.parse(params.get("id")).base;
        fs.readFile(`data/${filteredId}`, "utf8", function (error, description) {
          let sanitizedTitle = sanitizeHtml(title);
          let sanitizedDescription = sanitizeHtml(description);
          let html = template.HTML(
            title,
            list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a>
             <a href="/update?id=${sanitizedTitle}">update</a>
             <form action="http://localhost:3000/delete_process" method="post">
              <input type="hidden" name="id" value=${sanitizedTitle}>
              <input type="submit" value="delete">
             </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathName === "/create") {
    let title = "WEB - create";
    fs.readdir("./data", function (error, fileList) {
      let list = template.list(fileList);
      let html = template.HTML(
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
      response.end(html);
    });
  } else if (pathName === "/create_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    }); // let server = http.createServer(function (request, response) {}에서 request값을 argument로
    // data라는 parameter에 대입하여 호출
    request.on("end", function () {
      let post = qs.parse(body); // body값을 개체로 변환해서 post에 대입 {title: value, description: value}
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
      let list = template.list(fileList);
      let filteredId = path.parse(params.get("id")).base;
      fs.readFile(`data/${filteredId}`, "utf8", function (error, description) {
        let html = template.HTML(
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
        response.end(html);
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
      let filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function (error) {
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
