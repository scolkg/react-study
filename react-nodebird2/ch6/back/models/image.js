module.exports = (sequelize, DataTypes) => {
  // 시퀄라이즈의 규칙!
  // 'Image'가 모델이름인데 자동으로 소문자가 되고 복수형이 되면서 images 란 이름의 테이블이 된다.
  const Image = sequelize.define('Image', { 
    // id는 mysql에서 기본적으로 들어가 있다.
    src: {
      type: DataTypes.STRING(200),
      allowNull: false,
    }
  }, {
    modelName: 'Image',
    tableName: 'images',
    charset: 'utf8', // 이모티콘까지 되는 캐릭터셋
    collate: 'utf8_general_ci', // 한글 저장
  });
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };

  return Image;
};