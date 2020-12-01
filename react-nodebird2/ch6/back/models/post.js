module.exports = (sequelize, DataTypes) => {
  // 시퀄라이즈의 규칙!
  // 'Post'가 모델이름인데 자동으로 소문자가 되고 복수형이 되면서 posts 란 이름의 테이블이 된다.
  const Post = sequelize.define('Post', { 
    // id는 mysql에서 기본적으로 들어가 있다.
    content: {
      type: DataTypes.TEXT, // 참고: TEXT는 무제한 비슷하지만 실제 트위터는 140자 제한.
      allowNull: false,
    },
    // 원래 belogsTo(db.Post) 하면 자동으로 PostId가 생기는데 햇갈리니까 이걸 RetweetId로 바꿔준다.
  }, {
    modelName: 'Post',
    tableName: 'posts',
    charset: 'utf8mb4', // 이모티콘까지 되는 캐릭터셋
    collate: 'utf8mb4_general_ci', // 한글, 이모티콘 저장
  });
  Post.associate = (db) => {
    // 일대다 관계 정의.
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser, post.removeUser 시퀄라이즈의 관계 메서드가 자동으로 4개의 메서드를 기본 제공해준다.
    // 일대다 관계
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    // 다대다 관계
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
    // 두번째 인자에서 중간 테이블 이름도 정해줄 수 있다. 
    // as에 따라서 post.getLikers 처럼 게시글 좋아요 누른 사람을 가져오게 됨. // post.addImages
    db.Post.belongsToMany(db.User, { 'through': 'Like', as: 'Likers' }); // post.addLikers
    // 리트윗용 관계 일대다(하나의 게시글을 여러개의 게시글이 리트윗)
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet (belongsTo니까 단수)
  };

  return Post;
};