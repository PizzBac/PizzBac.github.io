window.onload = function () {
  let nowMonth = new Date(); // 현재 달을 페이지를 로드한 날의 달로 초기화
  let today = new Date(); // 페이지를 로드한 날짜를 저장
  let date =
    nowMonth.getFullYear() +
    "년" +
    (nowMonth.getMonth() + 1) +
    "월" +
    today.getDate() +
    "일";
  document.getElementById("main_today").innerHTML = date;

  var diary = decodeURIComponent(decodeURI(get_cookie("input"))); // 쿠키에 담긴 다이어리 내용(URI 디코딩을 해줌)
  var keys = decodeURIComponent(decodeURI(get_cookie("key"))); // 쿠키에 담긴 다이어리의 키워드들(URI 디코딩을 해줌)

  var sideTextEl = document.querySelector(".side_day_text"); // 다이어리의 내용이 담길 html 요소
  sideTextEl.innerText = diary; // 쿠키에 담긴 다이어리 내용을 해당 html요소에 뿌려준다.

  var keyosrdsEl = document.querySelector(".side_div_keywords ul"); // 키워드들이 적힐 html 요소

  var keyVal = keys.split(","); // 쿠키에 담긴 다이어리의 키워드들을 ','를 기준으로 쪼개준다.
  keyVal.forEach((val) => {
    // 위에서 쪼갠 키워드들 만큼 아래 li태그를 반복 생성해준다.
    keyosrdsEl.innerHTML += /* HTML */ `
      <li id="keywords"><span>${val}</span></li>
    `;
  });
};

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

var photo = document.getElementById("main_photo");
var thumbnail = document.querySelectorAll("#gallery > li > img");

for (var i = 0; i < thumbnail.length; i++)
  thumbnail[i].addEventListener("click", function () {
    photo.setAttribute("src", this.getAttribute("src"));
  });

function get_cookie(name) {
  var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return value ? value[2] : null;
}
