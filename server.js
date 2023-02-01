const express = require("express");
var request = require("request");
const fs = require("fs");
const axios = require("axios");
const app = express();
const client_id = "8bJXfIc3GXBTVkYAc1ng";
const client_secret = "xDNDEEoVU5";
const api_url = "https://openapi.naver.com/v1/papago/n2mt";
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const rq_queryStr = require("querystring");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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
          Authorization: "KakaoAK 6f38534b6b57b7e6d1b065f0e329b791",
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
app.use(
  session({
    secret: "12345",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/keyword", function (req, res) {
  let { user_input } = req.query;
  // session user_input 저장코드 작성-다이어리
  req.session.input = user_input;
  req.session.save(() => {});
  
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

app.get("/translate", function (req, res) {
  let keyword = req.query;
  // 세션에다가 키워드 삽입
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
  if(req.session.input){
    console.log(req.session.input);
  }
  res.sendFile(__dirname + "/UserResult.html");
});

app.listen(3001);
