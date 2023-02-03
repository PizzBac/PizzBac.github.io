const express = require("express");
var request = require("request");
const axios = require("axios");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

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

const client_id = process.env.papagoID; // 파파고 아이디
const client_secret = process.env.papagoSecret; // 파파고 키
const api_url = "https://openapi.naver.com/v1/papago/n2mt";//파파고 n2mt방식 url

app.get("/translate", function (req, res) {
  let keyword = req.query;//키워드api에서 redirect된 쿼리스트링을 keyword=req.query로 받아서 세팅

  var str = "";
  var json = JSON.stringify(keyword);//제이슨형식 문자열로 변경(stringfy)
  var data = JSON.parse(json);//제이슨형식으로 변경된것을 자바스크립트의 객체로 변경(parse)
  var json2 = JSON.stringify(data);
  var data2 = JSON.parse(json2);
  var data3 = JSON.parse(data2.translatedText);
  for (var i = 0; i < data3.sentences.length; ++i) {
    for (var j = 0; j < data3.sentences[i].keywords.length; ++j) {
      str += data3.sentences[i].keywords[j].word + ",";
    }
  }
  //str에 kewyord를 data3에서 translatedText(쿼리스트링받은거)를 넣어 값에 접근하여 for문으로 배열을 읽어옴
  var replaceAt = function (input, index, character) {
    return (
      input.substr(0, index) +
      character +
      input.substr(index + character.length)
    );
  };//for문으로 돌려서 읽어온 값들을 ","기준으로 출력했기에 마지막에도 ","가 붙어있는데 이를 제거하기위하여 함수설정
  var change_str = str.slice(0, -1);//슬라이스하여 change_str에 삽입
  res.cookie("key", change_str, { maxAge: 600000 });//쿠키에 이름을 "key"로 설정하고 value에 change_str을 담아서 리스폰스함(마지막화면에서 키워드 한글출력을 위해서)
  const options = {//번역하기 위한 클라이언트 아이디, 비밀번호 그리고 번역하고자 하는 문장의 form을 담아서 제이슨형식으로 발송
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
      let trans = JSON.parse(body);//위에서 발송한 url을 파싱하여 자바스크립트 객체로 만들고 
      let translated = trans.message.result.translatedText;//번역된 키워드들이 들어있는 translatedText만 추출하여
      res.redirect("loading?translatedText=" + translated);// /loading으로 쿼리스트링형태로 발송 하면 133줄의 /loading에서 칼로가 받아 그림을 그리기 시작함
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  }); //리퀘스트
});

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

app.all("/loading", async function (req, res) {
  let { translatedText } = req.query;
  res.sendFile(__dirname + "/loadingjs.html");
  await getKarlo(translatedText);
  console.log("그림완성");
});

app.all("/UserResult", function (req, res) {
  res.sendFile(__dirname + "/UserResult.html");
});

app.all("/download", function (req, res) {
  res.download(__dirname + "/public/img/res.png", "res.png");
});

app.listen(3001);
