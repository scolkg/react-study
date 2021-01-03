// app.js 에 들어가느 것들은 다 미들웨어들이다. routes도 마찬가지.
// req, res, next 가 기본으로 들어감.
// 직접 이렇게 커스텀으로 미들웨어를 만들 수 있다.
// 로그인 여부 검사하는 미들웨어
exports.isLoggedIn = (req, res, next) => {
  console.log("왜 isAuthenticated가 false일가 ㅜ : ", req.isAuthenticated());
  if (req.isAuthenticated()) { // passport에서 지원.
    // next() 안 인자에 뭘 집어넣으면 에러를 처리하러 가는 거고 그냥 next() 호출하면
    // 다음 미들웨어로 가는 것이다.
    next();
  } else {
    res.status(401).send('로그인이 필요합니다');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다');
  }
};
