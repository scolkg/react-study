module.exports = (sequelize, DataTypes) => {
  // 시퀄라이즈의 규칙!
  // 'Comment'가 모델이름인데 자동으로 소문자가 되고 복수형이 되면서 comments 란 이름의 테이블이 된다.
  const Comment = sequelize.define('Comment', { 
    // id는 mysql에서 기본적으로 들어가 있다.
    content: {
      type: DataTypes.STRING(100), // 참고: TEXT는 무제한 비슷하지만 실제 트위터는 140자 제한.
      allowNull: false,
    },
    // UserId: {} // belongsTo 로 인하여 자동으로 생긴다.
    // PostId: {} // belongsTo 로 인하여 자동으로 생긴다.
  }, {
    modelName: 'Comment',
    tableName: 'comments',
    charset: 'utf8mb4', // 이모티콘까지 되는 캐릭터셋
    collate: 'utf8mb4_general_ci', // 한글 저장
  });
  Comment.associate = (db) => {
    // 댓글 여러개에 유저는 한명만 존재.
    db.Comment.belongsTo(db.User);
    // 댓글 여러개에 게시물은 한개만 존재.
    db.Comment.belongsTo(db.Post);
  };

  return Comment;
};