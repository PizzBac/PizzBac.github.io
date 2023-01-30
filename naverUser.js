$ npm install 
$ node app.js

var express = require('express')
    , passport = require('passport')
    , session = require('express-session')
    , NaverStrategy = require('../lib/index.js').Strategy;

var client_id = 'bXtVxf20aEiH_6zM5yjf';
var client_secret = '8JE9iF0LXu';
// 콜백url 바꿔주기
var callback_url = 'http://127.0.0.1:3000/index.html';

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
// 재인증
// 재인증은 사용자가 서비스에 로그인할 때마다 네이버 비밀번호를 다시 입력하도록 요청하는 행위입니다. 이는 Naver의 사용자 세션이 살아있는 동안 중간자 하이재킹을 방지하는 데 유용합니다.

// 다음은 authType을 사용하여 재인증을 트리거하는 예입니다.
passport.use(new NaverStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: callback_url,
    svcType: 0  // optional. see http://gamedev.naver.com/index.php/%EC%98%A8%EB%9D%BC%EC%9D%B8%EA%B2%8C%EC%9E%84:OAuth_2.0_API
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        //console.log("profile=");
        //console.log(profile);
        // data to be saved in DB
        user = {
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.displayName,
            provider: 'naver',
            naver: profile._json
        };
        //console.log("user=");
        //console.log(user);
        return done(null, profile);
    });
}));

var app = express();

app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'jade');
app.set('views', __dirname + '/views/');

app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res) {
    console.log(req.user);
    res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

// 요청 인증
// 전략을 passport.authenticate()지정하는 를 사용 하여 요청을 인증합니다.'naver'
// 예를 들어, Express 애플리케이션의 라우트 미들웨어로:

// Setting the naver oauth routes
app.get('/auth/naver', 
    passport.authenticate('naver', null), function(req, res) {
        console.log('/auth/naver failed, stopped');
    });

// creates an account if no account of the new user
app.get('/auth/naver/callback', 
    passport.authenticate('naver', {
        failureRedirect: '#!/auth/login'
    }), function(req, res) {
        res.redirect('/'); 
    });
// ---------------------------------------------------

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(3000);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}