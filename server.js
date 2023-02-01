const express = require("express");
var request = require("request");
const fs = require("fs");
const app = express();
const client_id = "8bJXfIc3GXBTVkYAc1ng";
const client_secret = "xDNDEEoVU5";
const api_url = "https://openapi.naver.com/v1/papago/n2mt";
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const rq_queryStr = require("querystring");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.all("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// user_input

app.get("/keyword", function (req, res) {
  let { user_input } = req.query;

  var headers = {
    "content-type": "application/json",
    "x-auth-token": "20a7c5dc-589b-49fb-9f96-c7911ae4ff26",
  };
  var dataString = `{"document": "${user_input}"}`;

  var options = {
    url: "https://api.matgim.ai/54edkvw2hn/api-keyword",
    method: "POST",
    headers: headers,
    body: dataString,
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const obj = JSON.parse(body);
      const ok = JSON.stringify(obj);
      return res.redirect("/translate?translatedText=" + ok);
    } else {
      return res
        .status(response.statusCode)
        .end(console.log("error = " + response.statusCode));
    }
  });
});

// app.all('/translate', (res, req) => {
//   var{translatedText} = req.query;
//   console.log(translatedText)
// });

app.get("/translate", function (req, res) {
  let keyword = req.query;
  // console.log("출력성공");
  // console.log(keyword);
  var str = "";
  console.log(keyword);
  var json = JSON.stringify(keyword);
  var data = JSON.parse(json);
  var json2 = JSON.stringify(data);
  var data2 = JSON.parse(json2);
  var data3 = JSON.parse(data2.translatedText);
  // var data2 = JSON.parse(json2)
  // console.log(data.sentences.keywords);
  // console.log(data3.sentences[0].keywords[0].word);
  // console.log(data2.length.);
  for (var i = 0; i < data3.sentences.length; ++i) {
    for (var j = 0; j < data3.sentences[i].keywords.length; ++j) {
      str += data3.sentences[i].keywords[j].word + ",";
    }
  }
  var replaceAt = function (input, index, character) {
    return (
      input.substr(0, index) +
      character +
      input.substr(index + character.length)
    );
  };
  var change_str = str.slice(0, -1);
  console.log(change_str);

  const options = {
    url: api_url,
    form: { source: "ko", target: "en", text: change_str },
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  request.post(options, function (error, response, body) {
    //리퀘스트
    if (!error && response.statusCode == 200) {
      //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      //let transJSON=JSON.stringify(body);
      let trans = JSON.parse(body);
      //fs.writeFileSync('sendData.json',body);
      let translated = trans.message.result.translatedText;
      console.log(trans);
      //let translatedText = body.message.result.translatedText;
      console.log(translated);
      res.redirect("loading?translatedText=" + translated);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  }); //리퀘스트
});

app.all("/loading", function (req, res) {
  let { translatedText } = req.query;
  res.sendFile(__dirname + "/loadingjs.html");
  console.log("loading으로 이동");
  console.log(translatedText);
});

app.all("/UserResult", function (req, res) {
  console.log("결과 이동");
  res.sendFile(__dirname + "/UserResult.html");
});

app.listen(3001);
