// 로그인 / 로그아웃 버튼을 눌렀을 때 이벤트처리
$(function(){
    // 로그인 헀을 시에
    // $("#naverIdLogin_loginButton").click(function(){
    //     // setTimeout(function(){}, 5000);
    //     $("#profile_view").css({"display" : "flex"});
    //     $("#login_view").css({"display" : "none"});
    // });
    $("#googleIdLogin_loginButton").click(function(){
        $("#profile_view").css({"display" : "flex"});
        $("#login_view").css({"display" : "none"});
        
    });
    $("#appleIdLogin_loginButton").click(function(){
        $("#profile_view").css({"display" : "flex"});
        $("#login_view").css({"display" : "none"});
    });
    $("#kakaoIdLogin_loginButton").click(function(){
        $("#profile_view").css({"display" : "flex"});
        $("#login_view").css({"display" : "none"});
    });

    // 로그아웃 했을 시에
    $(".btn_logout").click(function(){
        $("#profile_view").css({"display" : "none"});
        $("#login_view").css({"display" : "inline-block"});
    });
});



// 네이버 로그인
var naverLogin = new naver.LoginWithNaverId(
    {
        clientId: "bXtVxf20aEiH_6zM5yjf", //내 애플리케이션 정보에 cliendId를 입력해줍니다.
        callbackUrl: "https://pizzbac.github.io/", // 내 애플리케이션 API설정의 Callback URL 을 입력해줍니다.
        // callbackUrl: "http://127.0.0.1:3000/index.html",
        isPopup: false,
        callbackHandle: true
    }
);	

naverLogin.init();

window.addEventListener('load', function () {
naverLogin.getLoginStatus(function (status) {
if (status) {
    var email = naverLogin.user.getEmail(); // 필수로 설정할것을 받아와 아래처럼 조건문을 줍니다.
    
    console.log(naverLogin.user);
    
    if( email == undefined || email == null) {
        alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
        naverLogin.reprompt();
        return;
    }

    $("#naverIdLogin_loginButton").click(function(){
            // setTimeout(function(){}, 5000);
            $("#profile_view").css({"display" : "flex"});
            $("#login_view").css({"display" : "none"});
        });

} else {
    console.log("callback 처리에 실패하였습니다.");
}
});
});
// 구글 로그인
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
window.onload = function () {
    buildCalendar();  // 웹 페이지가 로드되면 buildCalendar 실행
    google.accounts.id.initialize({
        client_id: "297020363981-aj22v44hf4i3npk54aqb2ti39d280tkt.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("google_login"),
         { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
}
// 카카오 로그인 
Kakao.init('502c3fe3e6df6ef481d4c56f61c900b9'); //발급받은 키 중 javascript키를 사용해준다.
console.log(Kakao.isInitialized()); // sdk초기화여부판단
//카카오로그인
function kakaoLogin() {
    Kakao.Auth.login({
    success: function (response) {
        Kakao.API.request({
        url: '/v2/user/me',
        success: function (response) {
            console.log(response)
        },
        fail: function (error) {
            console.log(error)
        },
        })
    },
    fail: function (error) {
        console.log(error)
    },
    })
}
//카카오로그아웃  
function kakaoLogout() {
    if (Kakao.Auth.getAccessToken()) {
    Kakao.API.request({
        url: '/v1/user/unlink',
        success: function (response) {
            console.log(response)
        },
        fail: function (error) {
        console.log(error)
        },
    })
    Kakao.Auth.setAccessToken(undefined)
    }
}  
function logout(){
    alert("로그아웃 되었습니다.")
    location.href = "http://127.0.0.1:3000/index.html";
    
}
function clickApple(){
    alert("개발중입니다.")
}

var testPopUp;
function openPopUp() {
testPopUp= window.open("https://nid.naver.com/nidlogin.logout", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=1,height=1");
}
function closePopUp(){
testPopUp.close();
}

function naverLogout() {
openPopUp();
setTimeout(function() {
closePopUp();
}, 1000);
}

function hideLogin(){
    const btn1 = document.getElementById("login_view");
    if(btn1.style.display !== "none"){
        btn1.style.display = "none";
    }
    else{
        btn1.style.display = "block";
    }
}

function logout(){
    alert("로그아웃 되었습니다.")
    history.go(-1);
}
function clickApple(){
    alert("개발중입니다.")
}

var testPopUp;
function openPopUp() {
testPopUp= window.open("https://nid.naver.com/nidlogin.logout", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=1,height=1");
}
function closePopUp(){
testPopUp.close();
}

function naverLogout() {
openPopUp();
setTimeout(function() {
closePopUp();
}, 1000);
}
function hideLogin(){
    const btn1 = document.getElementById("login_view");
    if(btn1.style.display !== "none"){
        btn1.style.display = "none";
    }
    else{
        btn1.style.display = "block";
    }
}
// window.onload = function () { 
//     buildCalendar();  // 웹 페이지가 로드되면 buildCalendar 실행
// }

let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date();     // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar() {

    let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);     // 이번달 1일
    let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);  // 이번달 마지막날

    let tbody_Calendar = document.querySelector(".Calendar > tbody");
    document.getElementById("calYear").innerText = nowMonth.getFullYear();             // 연도 숫자 갱신
    document.getElementById("calMonth").innerText = leftPad(nowMonth.getMonth() + 1);  // 월 숫자 갱신

    while (tbody_Calendar.rows.length > 0) {                        // 이전 출력결과가 남아있는 경우 초기화
        tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
    }

    let nowRow = tbody_Calendar.insertRow();        // 첫번째 행 추가           

    for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
        let nowColumn = nowRow.insertCell();        // 열 추가
    }

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복  

        let nowColumn = nowRow.insertCell();        // 새 열을 추가하고


        let newDIV = document.createElement("p");
        newDIV.innerHTML = leftPad(nowDay.getDate());        // 추가한 열에 날짜 입력
        nowColumn.appendChild(newDIV);

        if (nowDay.getDay() == 6) {                 // 토요일인 경우
            nowRow = tbody_Calendar.insertRow();    // 새로운 행 추가
        }

        if (nowDay < today) {                       // 지난날인 경우
            newDIV.className = "pastDay";
        }
        else if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()) { // 오늘인 경우           
            newDIV.className = "today";
            newDIV.onclick = function () { choiceDate(this); }
        }
        else {                                      // 미래인 경우
            newDIV.className = "futureDay";
            newDIV.onclick = function () { choiceDate(this); }
        }
    }
    $("#period_1").val(nowMonth.getFullYear() + "-" + leftPad(nowMonth.getMonth() + 1) + "-" + today.getDate());
}


// 날짜 선택
function choiceDate(newDIV) {
    if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
        document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
    }
    newDIV.classList.add("choiceDay");           // 선택된 날짜에 "choiceDay" class 추가
    console.log(newDIV); 
}


// 이전달 버튼 클릭
function prevCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());   // 현재 달을 1 감소
    buildCalendar();    // 달력 다시 생성
}
// 다음달 버튼 클릭
function nextCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());   // 현재 달을 1 증가
    buildCalendar();    // 달력 다시 생성
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
};

// 이미지 클릭시 모달 창
$(function(){
    // 	이미지 클릭시 해당 이미지 모달
        $(".div_main_pic").click(function(){
            $(".modal").show();
            // 해당 이미지 가겨오기
            var imgSrc = $(this).children("img").attr("src");
            var imgAlt = $(this).children("img").attr("alt");
            $(".modalBox img").attr("src", imgSrc);
            $(".modalBox img").attr("alt", imgAlt);
            
            // 해당 이미지 텍스트 가져오기
            var imgTit =  $(this).children("p").text();
            $(".modalBox p").text(imgTit);
            
       // 해당 이미지에 alt값을 가져와 제목으로
            //$(".modalBox p").text(imgAlt);
        });
        
        //.modal안에 button을 클릭하면 .modal닫기
        $(".modal button").click(function(){
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

for ( var i = 0; i < thumbnail.length; i++ )
  thumbnail[i].addEventListener("click", function () {

    photo.setAttribute("src", this.getAttribute("src"));
    // photo.src = this.src;

});

