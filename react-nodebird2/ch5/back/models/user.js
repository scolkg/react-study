module.exports = (sequelize, DataTypes) => {
  // 시퀄라이즈의 규칙!
  // 'User'가 모델이름인데 자동으로 소문자가 되고 복수형이 되면서 users 란 이름의 테이블이 된다.
  const User = sequelize.define('User', { 
    // id는 mysql에서 기본적으로 들어가 있다.
    email: {
      type: DataTypes.STRING(50), // 데이터 타입 // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME 정도가 많이 쓰인다.
      allowNull: true, // 필수 여부
      unique: true, // 고유한 값 여부
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false, 
    },
    password: {
      type: DataTypes.STRING(100), // 패스워드는 암호화 후 길어지므로 넉넉하게
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });
  
  // 테이블간 관계는 associate에 정의.
  User.associate = (db) => {
    // 일대다 관계 정의.
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    // 두번째 인자에서 중간 테이블 이름도 정해줄 수 있다. as(별칭)에 따라 내가 좋아요를 누른 게시글들을 정해준다.
    db.User.belongsToMany(db.Post, { 'through': 'Like', as: 'Liked' });
    // 내가 팔로잉하는 유저들을 찾아라 할 때 중간테이블에서 나를 먼저 찾아야 한다.
    // 그런데 같은 테이블이라 userId가 똑같으니 포린키로 구별해주는 것이다.
    db.User.belongsToMany(db.User, { 'through': 'Follow', as: 'Followers', foreignkey: 'FollowingId' });
    db.User.belongsToMany(db.User, { 'through': 'Follow', as: 'Following', foreignkey: 'FollowerId' });
  };

  return User;
};