const express = require('express');
const cors = require('cors'); // 이 미들웨어만 사용하면 cors 해결.
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

// 닷엔브 사용 설정 (.env파일의 내용이 치환되어 들어온다)
dotenv.config();

const app = express();

// db 연결
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
})
  .catch(console.error);

// 중앙통제실인 app.js에서 패스포트 설정 실행
passportConfig();

// cors 설정
// origin: true 로 설정해두면 * 대신 보낸 곳의 주소가 자동으로 들어가 편리하다.
// credentials 는 기본값이 false인데 나중에 true로 바꿔줘야 한다. 바꿔주지 않으면 문제가 생기는데...
app.use(cors({
  origin: true,
  credentials: false,
}));

// req.body를 쓰려면 라우터들 연결한 것보다 위에 먼저 설정해줘야 한다. 순서가 중요!
app.use(express.json()); // json형태 데이터를 req.body로 넣어주는 기능을 사용하겠다는 것.
app.use(express.urlencoded({ extended: true })); // form submit 했을 때 urlencoded형식으로 데이터가 들어오는데 이렇게 해야 req.body로 넣어준다는 것.

// 쿠키 사용 설정
app.use(cookieParser(process.env.COOKIE_SECRET));

// 익스프레스 세션 설정
app.use(session({
  saveUinitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET, // 이 시크릿을 토대로 만들어진 정보를 쿠키로 만들어내어 브라우저로 보내는 것.
})); 

// 패스포트 초기화
app.use(passport.initialize());
// 패스포트용 세션 설정
app.use(passport.session());

// 모든 라우트를 여기서 임포트한다.
app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
  console.log('서버 실행 중');
});