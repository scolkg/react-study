const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models'); // models 폴더 (models/index.js)를 구조분해할당

const router = express.Router();

// 유저 로그인 - get인지 post인지 애매할 때는 포스트 쓴다. done()이 실행이 끝나고 두번째 인자로 전달되어 (서버에러, 성공객체, 인포객체) 로 콜백된다.
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { // POST /login
    if (err) {
      console.error(err);
      next(err); // 에러나면 next()로 익스프레스가 에러처리하게끔 보낸다는 의미다.
    }

    // 세번째 인포 객체가 있다는 것은 클라 에러가 있다는 것이므로
    if (info) {
      return res.status(401).send(info.reason); // 401: 허가되지 않음 이란 의미.
    }

    // 성공하면 진짜 passport로 login하자.
    return req.login(user, async (loginErr) => {
      if (loginErr) { // 그럴 일 거의 없지만 혹시나 passport에서 에러날 수 있으니...
        consoleerror(loginErr);
        return next(loginErr);
      }

      // 백엔드 로그인, passport 로그인 까지 성공하면 모두 끝!
      return res.json(user); // 프론트로 응답 넘겨주자.
    });

  })(req, res, next); // 미들웨어 확장 (res, next 등을 사용하게끔 하는 패턴)
});


// 유저 회원가입
router.post('/', async (req, res, next) => { // POST /user
  try {
    // 먼저 중복검사.
    // 팁: 비동기 작업인지 아닌지는 직접 공식문서찾아봐서 await를 넣어줄지 아닐지 알아봐야 한다.
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });

    // 중복 없으면 null 리턴
    if (exUser) {
      // 응답은 한번 보내야되기 때문에 return 해야 한다.
      //  요청/응답은 헤더(상태, 용량, 시간, 쿠키) - 바디(데이터) 로 구성됨.
      // 먼저 실패 상태(403)부터 보내고 메시지를 send로 보낸다.
      // 200 성공, 300 리다이렉트, 400 클라이언트 에러, 500 서버 에러
      return res.status(403).send('이미 사용중인 이메일입니다.');
    }

    // brypt로 비밀번호를 암호화 시키자. 두번째 인자는 높을수록 복잡도 증가. 10~13정도 추천 (높을수록 대신 소요시간 증가)
    // 역시 bcrypt(해쉬작업)은 비동기작업이라 동기작업하겠다는 의미로 await로 감싸줘야 한다.
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // async await를 붙여야 동기로 동작하여 정상적으로 데이터가 잘 들어가게 된다.
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    // cors 문제 해결하기 위해 프론트엔드 -> 백엔드로 요청하고 응답을 받아오는 방법, 즉 프록시로 해결!
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // 이렇게 한줄 적어도 되지만 보통 이런것도 미들웨어로 처리한다. // npm i cors (app.js에서 불러와서 사용)

    // 그리고 동기 작업이 끝나면 바로 다음 라인인 res.send가 실행된다.
    // 200 성공, 201 데이터 잘 만들어짐 등의 의미로 전달.
    res.status(201).send('ok');

  } catch (error) {
    console.error(error);
    // next()를 사용하면 error가 express가 한방에 처리해준다.
    next(error);
  }
});

module.exports = router;
