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

//키워드 추출 api
app.get("/keyword", function (req, res) {
  //index.html에서 submit으로 넘어온 일기 텍스트를 쿼리스트링을 이용해 받기
  let { user_input } = req.query;
  //가져온 텍스트를 쿠키로 유효시간을 설정 후 저장
  res.cookie("input", user_input, { maxAge: 60000 });

  var headers = {
    "content-type": "application/json",
    "x-auth-token": `${process.env.keywordAPIKey}`, //키워드 api 키 보안을 위해 .env에 따로 저장
  };
  //키워드 api로 보낼 데이터 설정 - 앞서 받아온 일기장 텍스트
  var dataString = `{"document": "${user_input}"}`;
  //api를 사용하기 위한 기본 설정
  var options = {
    url: "https://api.matgim.ai/54edkvw2hn/api-keyword",
    method: "POST",
    headers: headers,
    body: dataString,
  };
  // 키워드 api를 통해 키워드 추출 후 다음 url로 보내는 과정
  request.post(options, function (error, response, body) {
    //조건문을 통해서 오류가 발생한 경우와 발생하지 않은 경우 분리
    if (!error && response.statusCode == 200) {
      //추출된 데이터를JSON.parse()메서드를 통해 JSON문자열 구문을 분석 후
      //Js객체나 값을 생성
      const obj = JSON.parse(body);
      //obj 객체를 다시 JSON 문자열로 반환
      const ok = JSON.stringify(obj);
      //url에 파라미터로 JSON문자열=(ok) 담아서 translate로 보내기
      return res.redirect("/translate?translatedText=" + ok);
    } else {
      //오류 발생 시 오류 코드 콘솔창에 출력
      return res
        .status(response.statusCode)
        .end(console.log("error = " + response.statusCode));
    }
  });
});

const client_id = process.env.papagoID; // 파파고 아이디
const client_secret = process.env.papagoSecret; // 파파고 키
const api_url = "https://openapi.naver.com/v1/papago/n2mt"; //파파고 n2mt방식 url

app.get("/translate", function (req, res) {
  let keyword = req.query; //키워드api에서 redirect된 쿼리스트링을 keyword=req.query로 받아서 세팅

  var str = "";
  var json = JSON.stringify(keyword); //제이슨형식 문자열로 변경(stringfy)
  var data = JSON.parse(json); //제이슨형식으로 변경된것을 자바스크립트의 객체로 변경(parse)
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
  }; //for문으로 돌려서 읽어온 값들을 ","기준으로 출력했기에 마지막에도 ","가 붙어있는데 이를 제거하기위하여 함수설정
  var change_str = str.slice(0, -1); //슬라이스하여 change_str에 삽입
  res.cookie("key", change_str, { maxAge: 600000 }); //쿠키에 이름을 "key"로 설정하고 value에 change_str을 담아서 리스폰스함(마지막화면에서 키워드 한글출력을 위해서)
  const options = {
    //번역하기 위한 클라이언트 아이디, 비밀번호 그리고 번역하고자 하는 문장의 form을 담아서 제이슨형식으로 발송
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

// 그림 그려주는 AI Karlo API
async function getKarlo(text) {
  // 비동기적으로 동작하도록 async 키워드를 붙여줌
  try {
    const response = await axios.post(
      // post방식으로 Karlo에 그림을 요청(await 키워드를 붙여줌으로써 안정적으로 그림을 요청하고 받는 과정을 마친다.)
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
    ); // 요청이 정상적으로 마무리가 되면 json형식으로 응답이 날아온다.

    const resData = JSON.stringify(response.data);
    const parseData = JSON.parse(resData); // 응답으로 날아온 json 데이터에서 그림에 해당하는 값을 추출
    const decode = Buffer.from(parseData.images[0].image, "base64"); // 응답으로 날아온 그림은 base64로 인코딩이 되어있어 디코딩을 해줘야 온전한 그림을 얻을 수 있다.
    let makeDecodeFile = fs.writeFileSync("./public/img/res.png", decode); // 디코딩된 그림을 이미지 파일(png 파일)로 변환시킨다.
  } catch (error) {
    console.log(error);
  }
}

// Karlo로 그림을 그려주는 페이지
app.all("/loading", async function (req, res) {
  let { translatedText } = req.query; // 번역된 키워드를 받아온다.(url의 param값에서 추출)
  res.sendFile(__dirname + "/loadingjs.html"); // 로딩 페이지(loadingjs.html)파일을 로드
  // 받은 번역된 키워드를 Karlo api 요청 메소드로 넘겨줘 해당 키워드로 그림을 그리게 해준다.
  // await 키워드를 붙여 해당 과정이 안전하게 끝날 때 까지 기다려준다.
  await getKarlo(translatedText);
  console.log("그림완성"); // 그림이 완성이되면 콘솔창에 해당 문구가 출력
});

// 그림의 결과를 보여주는 페이지(위 loading 페이지에서 일정 시간이 지난 후 UserResult페이지로 넘어온다.)
app.all("/UserResult", function (req, res) {
  res.sendFile(__dirname + "/UserResult.html"); // 결과 페이지(UserResult.html)파일을 로드
});

// 그린 그림을 다운로드 받는 페이지
app.all("/download", function (req, res) {
  res.download(__dirname + "/public/img/res.png", "res.png"); // 위 Karlo를 통해 그린 그림을 다운로드 받게한다.
});

app.listen(3001);
