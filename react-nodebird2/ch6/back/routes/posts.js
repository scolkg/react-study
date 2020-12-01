const express = require('express');
const { Op } = require('sequelize'); // Operator 연산자 사용 (쿼리 날릴 때)
const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET // posts
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때 (스크롤 내려서 더 불러올 떄)
      // 원래 [Op.lt] 가 아닌 예전엔 $lt: ... 로 썼는데 sql인젝션 위험으로 쓰지 않는다.
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) } // lastId 보다 작은 id의 게시글들을 불러와야 한다.
    }
    const posts = await Post.findAll({
      where,
      limit: 10, // 10개 제한
      // offset: 0, // 0번째부터 10개를 가져와라. offset방식은 치명적인 단점이 있는데 도중에 게시글이 삭제하거나 글을 생성하면 limit과 offset이 꼬여버린다. 그래서 lastId를 이용하는 방법을 쓰자.
      order: [['createdAt', 'DESC']], // 작성시간 내림차순으로 (최신글이 맨 앞에 정렬되게)
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attiributes: ['id', 'nickname'],
          order: [['createdAt', 'DESC']],
        }]
      }, {
        model: User, // 게시글 좋아요 누른 사람들 (Likers)
        as: 'Likers', // 이렇게 해야 게시글, 댓글 작성자와 구별되고 post.Likers를 사용할 수 있다.
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
