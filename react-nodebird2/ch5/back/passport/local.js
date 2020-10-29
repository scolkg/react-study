const passport = require('passport');
// 로컬 로그인 전략 (구조분해할당을 새로운 이름(LocalStrategy)로 짓는다.)
const { Strategy: LocalStrategy} = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
  try {
    // 비동기요청이기 때문에 try에 넣어줘라.
    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    }, async (email, password, done) => {
      // 로그인 전략 
      // 먼저 이메일 검색!
      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        // done은 콜백함수. 라우터의 passport.authenticate()의 두번쨰 인자에 전달.
        // 첫번째: 서버에러, 두번째: 성공객체, 세번째: 인포객체
        return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
      }
      // 다음 비밀번호 체크!
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      }
      // 패스워드 틀리면
      return done(null, false, { reason: '비밀번호가 틀렸습니다' });
    }));
  } catch (error) {
    console.log(error);
    // 첫번째는 서버에러
    return done(error);
  }
};
