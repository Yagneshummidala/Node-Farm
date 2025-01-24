let fs = require("fs");
let http = require("http");
let url = require("url");
let replaceTemplate = require("./modules/replaceTemplate");

//////////////////////////////////////////////////
////////////////filesystem////////////////////////
//////////////////////////////////////////////////
// let textin=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textin);

// let textout=`this is what we know about avacado : ${textin}.\n created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textout);

// fs.readFile(`./txt/start.txt`,`utf-8`,(err,data1)=>{
//     if(err) return console.log('ERROR!!');
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8',(err,data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', err=>{
//                 console.log(`file has been written`);
//             })
//         });
//     });
// });
// console.log('reading file......');

///////////////////////////////////////////////////
/////////////////////server///////////////////////
/////////////////////////////////////////////////
let tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
let tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
let tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

let data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
let dataObj = JSON.parse(data);
// console.log(dataObj);
let server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //overview
  // console.log("hello!");
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  //product
  else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text.html" });
    // console.log(query);
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //api
  else if (pathname == "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  }
  //notfound
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>page not found<!/h1>");
  }
});

server.listen(8000, `127.0.0.1`, () => {
  console.log("server is listining request from port 8000");
});
