const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models'); // models 폴더 (models/index.js)를 구조분해할당

// 커스텀으로 만든 미들웨어를 불러와서 라우터의 두번째 인자에 넣어서 next() 를 호출하면
// 다음 미들웨어로 이동하라는 것이니 위에서부터 아래로, 왼쪽에서부터 아래로.
// 로긴(/login)했을 때 먼저 isNotLoggedIn이 실행되고 next()가 호출되면
// 다음 미들웨어인 passport.authenticate... 부분이 실행된다.
// 에러가 생겨 next('에러')가 호출되면 에러처리 미들웨어로 간다. (app.js 끝 부분 참고)
// 왜 직접 req.isAuthenticated() 를 써가면서 검사하면 되는데 왜 미들웨어로 따로 만들어서 쓸까?
// 중복 제거!
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 클라에서 온 유저 로그인 정보 쿠키를 이용하여 로그인 체크
router.get('/', async (req, res, next) => { // GET /user
  try {
    // 새로고침할 때마다 호출되는데 req.user 즉 사용자 정보가 들어있을 때만 찾는다.
    if (req.user) {
      // user를 프론트로 응답해주는데 필요한 정보를 가공해주자. 비번은 위험하니 빼자.(보낼필요도없고)
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        
        // 원래는 attribute(데이터)를 갖고 오는데 attributes로 원하는 것만 가져올 수 있다.
        attributes: {
          exclude: ['password'],
        },

        // include를 통해서 user에 db의 여러 정보를 검색하여 포함시킨다.
        include: [{
          model: Post, // 여기선 단수지만 hasMany 관계라서 복수형이 되어 me.Posts가 된다.!!
          attributes: ['id'], // 전부를 가져 올 필요 없다. 아이디만 가져와서 몇개인지 카운트만 되면 된다.
        }, {
          model: User, // 마찬가지로 models/user의 Followings 모델 포함 (as가 있으면 as 써줘야한다!)
          as: 'Followings',
          attributes: ['id'], // 전부를 가져 올 필요 없다. 아이디만 가져와서 몇개인지 카운트만 되면 된다.
        }, {
          model: User, // 마찬가지로 models/user의 Followers 모델 포함
          as: 'Followers',
          attributes: ['id'], // 전부를 가져 올 필요 없다. 아이디만 가져와서 몇개인지 카운트만 되면 된다.
        }]
      });
      
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 유저 로그인 - get인지 post인지 애매할 때는 포스트 쓴다. done()이 실행이 끝나고 두번째 인자로 전달되어 (서버에러, 성공객체, 인포객체) 로 콜백된다.
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { // POST /login
    if (err) {
      console.error(err);
      return next(err); // 에러나면 next()로 익스프레스가 에러처리하게끔 보낸다는 의미다.
    }

    // 세번째 인포 객체가 있다는 것은 클라 에러가 있다는 것이므로
    if (info) {
      return res.status(401).send(info.reason); // 401: 허가되지 않음 이란 의미.
    }

    // 성공하면 진짜 passport로 login하자. 이때 패스포트가 세션으로 로긴 데이터를 알아서 저장한다. (세션설정은 app.js 에서 함)
    // 동시에 req.login() 마치고 다음에 passport.serializeUser() 가 자동 실행된다.
    return req.login(user, async (loginErr) => {
      if (loginErr) { // 그럴 일 거의 없지만 혹시나 passport에서 에러날 수 있으니...
        consoleerror(loginErr);
        return next(loginErr);
      }

      // user를 프론트로 응답해주는데 필요한 정보를 가공해주자. 비번은 위험하니 빼자.(보낼필요도없고)
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        
        // 원래는 attribute(데이터)를 갖고 오는데 attributes로 원하는 것만 가져올 수 있다.
        attributes: {
          exclude: ['password'],
        },

        // include를 통해서 user에 db의 여러 정보를 검색하여 포함시킨다.
        include: [{
          model: Post, // 여기선 단수지만 hasMany 관계라서 복수형이 되어 me.Posts가 된다.!!
          attributes: ['id'], // 전부를 가져 올 필요 없다. 아이디만 가져와서 몇개인지 카운트만 되면 된다.
        }, {
          model: User, // 마찬가지로 models/user의 Followings 모델 포함 (as가 있으면 as 써줘야한다!)
          as: 'Followings',
          attributes: ['id'], // 전부를 가져 올 필요 없다. 아이디만 가져와서 몇개인지 카운트만 되면 된다.
        }, {
          model: User, // 마찬가지로 models/user의 Followers 모델 포함
          as: 'Followers',
          attributes: ['id'], // 전부를 가져 올 필요 없다. 아이디만 가져와서 몇개인지 카운트만 되면 된다.
        }]
      });

      // 백엔드 로그인, passport 로그인 까지 성공하면 모두 끝!
      return res.status(200).json(fullUserWithoutPassword); // 프론트로 응답 넘겨주자. user ----> user.me (리듀서), action.data (사가) 가 된다.
    });

  })(req, res, next); // 미들웨어 확장 (res, next 등을 사용하게끔 하는 패턴)
});

// 유저 로그아웃
router.post('/logout', isLoggedIn, (req, res) => {
  // req.user에 담겨 있는 유저정보를 이용하면 되는데 로그아웃은 간단히 구형 가능
  console.log("--> " + req.isAuthenticated());
  console.log(req.session);
  req.logout();
  console.log("@@->"+ req.isAuthenticated());
  console.log(req.session);
  // req.session.destory(); // 왜 안되지? - credentials 설정이 문젠가? ㅜ
  // 일단 이렇게 콜백으로 에러 예외 처리... 쿠키를 클라한테 제대로 못받나?
  req.session.destroy((err) =>{
    // res.clearCookie('connect.sid');
    console.log('error req.session.destroy()');
    console.error(err);
  });
  
  res.send('ok');
});

// 유저 회원가입
router.post('/', isNotLoggedIn, async (req, res, next) => { // POST /user
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
