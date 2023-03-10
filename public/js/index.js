// 로그인 / 로그아웃 버튼을 눌렀을 때 이벤트처리
$(function () {
  // 로그인 했을 시에
  $("#naverIdLogin_loginButton").click(function () {
    $("#profile_view").css({ display: "flex" });
    $("#login_view").css({ display: "none" });
  });
  
  $("#kakaoIdLogin_loginButton").click(function () {
    $("#profile_view").css({ display: "flex" });
    $("#login_view").css({ display: "none" });
  });
});

// 네이버 로그인
var naverLogin = new naver.LoginWithNaverId({
  clientId: "bXtVxf20aEiH_6zM5yjf", //내 애플리케이션 정보에 cliendId를 입력해줍니다.
  callbackUrl: "http://localhost:3001/start", // 내 애플리케이션 API설정의 Callback URL 을 입력해줍니다.
  isPopup: false,
  callbackHandle: true,
});

naverLogin.init();

window.addEventListener("load", function () {
  naverLogin.getLoginStatus(function (status) {
    if (status) {
      var email = naverLogin.user.getEmail(); // 필수로 설정할것을 받아와 아래처럼 조건문을 줍니다.

      $("#profile_view").css({ display: "flex" });
      $("#login_view").css({ display: "none" }); // 로그인 후 ui 변경

      document.getElementById("login_name").innerText = naverLogin.user.name; // 네이버에서 넘어온 유저의 이름을 표시
      document.getElementById("login_nick").innerText = naverLogin.user.nickname; // 네이버에서 넘어온 유저의 닉네임을 표시
      document.getElementById("login_email").innerText = naverLogin.user.email; // 네이버에서 넘어온 유저의 이메일을 표시
      document.getElementById("login_img").src = naverLogin.user.profile_image; // 네이버에서 넘어온 유저의 프로필 사진을 표시

      if (email == undefined || email == null) {
        alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
        naverLogin.reprompt();
        return;
      }

      $("#naverIdLogin_loginButton").click(function () {
        $("#profile_view").css({ display: "flex" });
        $("#login_view").css({ display: "none" });
      });
    } else {
      console.log("callback 처리에 실패하였습니다.");
    }
  });
});

window.onload = function () {
  buildCalendar(); // 웹 페이지가 로드되면 buildCalendar 실행
};
// 카카오 로그인
Kakao.init("65a522f7dd0d7c691b6042af368342e0"); //발급받은 키 중 javascript키를 사용해준다.
function kakaoLogin() {
  Kakao.Auth.login({
    success: function (response) {
      Kakao.API.request({
        url: "/v2/user/me",
        success: function (response) {
          $("#login_nick").css({ display: "none" }); // 닉네임을 표시해주는 html요소를 가려준다.
          document.getElementById("login_name").innerText = response.properties.nickname; // 카카오에서 넘어온 유저의 닉네임을 표시
          document.getElementById("login_img").src = response.properties.profile_image; // 카카오에서 넘어온 유저의 프로필 사진을 표시
          document.getElementById("login_email").innerText = response.kakao_account.email; // 카카오에서 넘어온 유저의 이메일을 표시
        },
        fail: function (error) {
          console.log(error);
        },
      });
    },
    fail: function (error) {
      console.log(error);
    },
  });
}

function logout() {

  alert("로그아웃 되었습니다.");
  $("#profile_view").css({ display: "none" });
  $("#login_view").css({ display: "inline-block" });
}

let nowMonth = new Date(); // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date(); // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0); // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar() {
  let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1); // 이번달 1일
  let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0); // 이번달 마지막날

  let tbody_Calendar = document.querySelector(".Calendar > tbody");
  document.getElementById("calYear").innerText = nowMonth.getFullYear(); // 연도 숫자 갱신
  document.getElementById("calMonth").innerText = leftPad(
    nowMonth.getMonth() + 1
  ); // 월 숫자 갱신

  while (tbody_Calendar.rows.length > 0) {
    // 이전 출력결과가 남아있는 경우 초기화
    tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
  }

  let nowRow = tbody_Calendar.insertRow(); // 첫번째 행 추가

  for (let j = 0; j < firstDate.getDay(); j++) {
    // 이번달 1일의 요일만큼
    let nowColumn = nowRow.insertCell(); // 열 추가
  }

  for (
    let nowDay = firstDate;
    nowDay <= lastDate;
    nowDay.setDate(nowDay.getDate() + 1)
  ) {
    // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복

    let nowColumn = nowRow.insertCell(); // 새 열을 추가하고

    let newDIV = document.createElement("p");
    newDIV.innerHTML = leftPad(nowDay.getDate()); // 추가한 열에 날짜 입력
    nowColumn.appendChild(newDIV);

    if (nowDay.getDay() == 6) {
      // 토요일인 경우
      nowRow = tbody_Calendar.insertRow(); // 새로운 행 추가
    }

    if (nowDay < today) {
      // 지난날인 경우
      newDIV.className = "pastDay";
    } else if (
      nowDay.getFullYear() == today.getFullYear() &&
      nowDay.getMonth() == today.getMonth() &&
      nowDay.getDate() == today.getDate()
    ) {
      // 오늘인 경우
      newDIV.className = "today";
      newDIV.onclick = function () {
        choiceDate(this);
      };
    } else {
      // 미래인 경우
      newDIV.className = "futureDay";
      newDIV.onclick = function () {
        choiceDate(this);
      };
    }
  }
  $("#period_1").val(
    nowMonth.getFullYear() +
      "-" +
      leftPad(nowMonth.getMonth() + 1) +
      "-" +
      today.getDate()
  );
}

// 날짜 선택
function choiceDate(newDIV) {
  if (document.getElementsByClassName("choiceDay")[0]) {
    // 기존에 선택한 날짜가 있으면
    document
      .getElementsByClassName("choiceDay")[0]
      .classList.remove("choiceDay"); // 해당 날짜의 "choiceDay" class 제거
  }
  newDIV.classList.add("choiceDay"); // 선택된 날짜에 "choiceDay" class 추가
  console.log(newDIV);
}

// 이전달 버튼 클릭
function prevCalendar() {
  nowMonth = new Date(
    nowMonth.getFullYear(),
    nowMonth.getMonth() - 1,
    nowMonth.getDate()
  ); // 현재 달을 1 감소
  buildCalendar(); // 달력 다시 생성
}
// 다음달 버튼 클릭
function nextCalendar() {
  nowMonth = new Date(
    nowMonth.getFullYear(),
    nowMonth.getMonth() + 1,
    nowMonth.getDate()
  ); // 현재 달을 1 증가
  buildCalendar(); // 달력 다시 생성
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
  if (value < 10) {
    value = "0" + value;
    return value;
  }
  return value;
}

// 이미지 클릭시 모달 창
$(function () {
  // 	이미지 클릭시 해당 이미지 모달
  $(".div_main_pic").click(function () {
    $(".modal").show();
    // 해당 이미지 가겨오기
    var imgSrc = $(this).children("img").attr("src");
    var imgAlt = $(this).children("img").attr("alt");
    $(".modalBox img").attr("src", imgSrc);
    $(".modalBox img").attr("alt", imgAlt);

    // 해당 이미지 텍스트 가져오기
    var imgTit = $(this).children("p").text();
    $(".modalBox p").text(imgTit);
  });

  //.modal안에 button을 클릭하면 .modal닫기
  $(".modal button").click(function () {
    $(".modal").hide();
  });

  //.modal밖에 클릭시 닫힘
  $(".modal").click(function (e) {
    if (e.target.className != "modal") {
      return false;
    } else {
      $(".modal").hide();
    }
  });
});

// 이미지 썸네일 클릭시 전환하기
var photo = document.getElementById("main_photo");
var thumbnail = document.querySelectorAll("#gallery > li > img");

for (var i = 0; i < thumbnail.length; i++)
  thumbnail[i].addEventListener("click", function () {
    photo.setAttribute("src", this.getAttribute("src"));
  });
