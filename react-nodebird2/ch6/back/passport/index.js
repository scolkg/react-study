const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
/*   브라우저(3060) ----------------------> 프론트(next)(3060) -----------------------> 백엔드(express)(3065)
- 로그인 상황에서 백엔드에서 로그인 성공 후 브라우저에게 성공데이터(이메일, 비밀번호) 등을 다시 보내주는 대신에
브라우저에게 랜덤한 문자열(쿠키) 를 보내줘서 보안성을 높인다.
그리고 서버쪽에는 그 쿠키와 연결하는 정보를 통째로 따로 저장한다. 그게 세션.
그리고 로그인되어있는지 브라우저는 항상 가지고 있는 쿠키를 백앤드로 체크하여 세션값과 비교해서
로그인 여부를 체크한다. 
====
브라우저(쿠키) <------------> 백앤드(세션)
====
하지만 필요한 정보만 가지고 있는 쿠키와는 달리 세션에 통째로 데이터를 들고 있으면 무겁다.
세션에 수백만의 유저가 로그인한 정보를 들고있다고 생각하면 메모리 부족으로 뻥 터질 수 있다.

그래서 패스포트는 다 들고 있지 않고 유니크한 유저의 아이디(이메일) 데이터만 가지고 있도록 한다.
그리고 브라우저에서 쿠키 보내주면 백앤드는 아이디로 db를 조회해서 해당 유저 데이터를 찾는 방식으로 한다. */

  // req.login() 실행되고 나서 이게 자동으로 실행됨. 아이디만 저장하여 서버의 부담을 줄이는 것!
  passport.serializeUser((user, done) => {
    // 유저 정보 중에서 쿠키랑 묶어 줄 id만 저장하겠다는 것!
    done(null, user.id); 
    // 첫번째인자: 서버에러, 두번째인자: 성공객체
  });

  // 로그인 이후 다음 요청부터는 아이디 정보로만 디비를 통하여 유저 데이터를 검색하여 복구해준다! 그걸 req.user에 넣어준다.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } }); // req.user 에 넣어준다. 그래서 다른 요청을 처리할 때 req.user를 사용하면 된다.
      done(null, user);
    } catch(error) {
      console.error(error);
      done(error);
    }
  });

  local();
};

// 프론트에서 서버로는 cookie만 보내요(clhxy)
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 1 발견
// id: 1이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱
