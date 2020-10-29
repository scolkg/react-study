module.exports = (sequelize, DataTypes) => {
  // 시퀄라이즈의 규칙!
  // 'Hashtag'가 모델이름인데 자동으로 소문자가 되고 복수형이 되면서 hashtags 란 이름의 테이블이 된다.
  const Hashtag = sequelize.define('Hashtag', { 
    // id는 mysql에서 기본적으로 들어가 있다.
    name: {
      type: DataTypes.STRING(20), // 참고: TEXT는 무제한 비슷하지만 실제 트위터는 140자 제한.
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', // 이모티콘까지 되는 캐릭터셋
    collate: 'utf8mb4_general_ci', // 한글 저장
  });
  Hashtag.associate = (db) => {
    // 게시글 하나는 여러 개의 해시태그를 가질 수 있고 또한 하나의 해시태그는 여러개의 게시글을 가질 수 있다.
    // 다대다 관계
    // belongsToMany로 관계를 만들면 시퀄라이즈가 자동으로 PostHashtag 라는 중간 테이블이 만들어진다.
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    
  };

  return Hashtag;
};