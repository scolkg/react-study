const express = require('express');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET // posts
  try {
    const where = {};
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
      }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
