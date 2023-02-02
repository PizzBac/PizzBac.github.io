const express = require("express");
var request = require("request");
const fs = require("fs");
const axios = require("axios");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const client_id = process.env.papagoID; // 파파고 아이디
const client_secret = process.env.papagoSecret; // 파파고 키
const api_url = "https://openapi.naver.com/v1/papago/n2mt";
const bodyParser = require("body-parser");
const { json } = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

async function getKarlo(text) {
  try {
    const response = await axios.post(
      "https://api.kakaobrain.com/v1/inference/karlo/t2i",
      {
        prompt: {
          text: `"${text}"`,
          batch_size: 1,
        },
      },
      {
        headers: {
          Authorization: `KakaoAK ${process.env.karloAPIKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resData = JSON.stringify(response.data);
    const parseData = JSON.parse(resData);
    const decode = Buffer.from(parseData.images[0].image, "base64");
    let makeDecodeFile = fs.writeFileSync("./public/img/res.png", decode);
  } catch (error) {
    console.log(error);
  }
}

app.all("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.all("/start", (req, res) => {
  res.sendFile(__dirname + "/diary.html");
});

// user_input
//세션 미들웨어 생성

app.get("/keyword", function (req, res) {
  let { user_input } = req.query;
  // session user_input 저장코드 작성-다이어리
  res.cookie("input", user_input, { maxAge: 60000 });

  var headers = {
    "content-type": "application/json",
    "x-auth-token": `${process.env.keywordAPIKey}`,
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

app.get("/translate", function (req, res) {
  let keyword = req.query;

  var str = "";
  var json = JSON.stringify(keyword);
  var data = JSON.parse(json);
  var json2 = JSON.stringify(data);
  var data2 = JSON.parse(json2);
  var data3 = JSON.parse(data2.translatedText);
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
  res.cookie("key", change_str, { maxAge: 600000 });
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
      let trans = JSON.parse(body);
      let translated = trans.message.result.translatedText;
      console.log(trans);
      console.log(translated);
      res.redirect("loading?translatedText=" + translated);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  }); //리퀘스트
});

app.all("/loading", async function (req, res) {
  let { translatedText } = req.query;
  res.sendFile(__dirname + "/loadingjs.html");
  console.log("loading으로 이동");
  await getKarlo(translatedText);
  console.log("그림완성");
});

app.all("/UserResult", function (req, res) {
  console.log("결과 이동");
  // if (req.session.input) {
  //   console.log(req.session.input);
  // }
  console.log(req.cookies.input);
  console.log(req.cookies.key);
  res.sendFile(__dirname + "/UserResult.html");
});

app.all("/download", function (req, res) {
  res.download(__dirname + "/public/img/res.png", "res.png");
});

app.listen(3001);
