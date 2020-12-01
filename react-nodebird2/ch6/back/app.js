const express = require('express');
const cors = require('cors'); // 이 미들웨어만 사용하면 cors 해결.
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
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

// 로그 설정 (프론트에서 백엔드로 요청 보낼 때 기록해준다)
app.use(morgan('dev'));

// cors 설정
// origin: true 로 설정해두면 * 대신 보낸 곳의 주소가 자동으로 들어가 편리하다.
// credentials 는 기본값이 false인데 나중에 true로 바꿔줘야 한다. true로 해야 쿠키도 전달해준다. (로그인 유지 등)
// *를 쓰면 쿠키를 보낼 때 안된다. 정확한 신뢰된 사이트 주소를 직접 적어줘야 한다. 아니면 true
app.use(cors({
  origin: 'http://localhost:3000', // true
  credentials: true,
}));

// express가 uploads폴더를 프론트에 제공할 수 있도록 한다.
// static미들웨어: /back/+ 폴더명을 합쳐준다. 윈도우-리눅스 디렉토리 경로가 다르므로 static 미들웨어가 알아서 처리해준다.
// localhost:3065/ == 첫번쨰 파라미터인 '/' - 프론트에선 백단의 이미지 경로를 모르므로 보안에도 유리
app.use('/', express.static(path.join(__dirname, 'uploads')));

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
app.use('/posts', postsRouter);
app.use('/user', userRouter);

// 에러처리 미들웨어는 내부적으로 기본으로 존재하나 이렇게 커스텀할 수 있다.
// 에러페이지를 따로 띄워주고 싶다던가 등등.
/* app.use((err, req, res, next) => {
  console.error('에러 처리 미들웨어');
}); */

app.listen(3065, () => {
  console.log('서버 실행 중');
});