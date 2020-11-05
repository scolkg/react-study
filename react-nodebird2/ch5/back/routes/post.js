const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { Post } = require('../models');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => { // POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      // 게시글 쓰려면 로그인을 헀다는 것이기 때문에 req.user 로 id 이용 가능.
      // 라우터 접근할 때마다 passport.deserializeUser가 자동 실행되어 req.user를 사용할 수 있다.
      UserId: req.user.id, 
    });
    
    res.send(201).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 세미콜론은 동적으로 바뀌는 주소부분인데 이게 파라미터이다. 이건 req.params. 로 사용 가능.
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => { // POST /post/1/comment
  try {
    // 실제로 postId가 존재하는지 철저하게 체크해주자.
    const post = await Post.findOne({
      where: { id: req.params.postId }
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });

    res.send(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', (req, res) => { // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
