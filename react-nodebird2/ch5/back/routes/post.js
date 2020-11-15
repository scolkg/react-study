const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { Post, Image, Comment, User } = require('../models');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => { // POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      // 게시글 쓰려면 로그인을 헀다는 것이기 때문에 req.user 로 id 이용 가능.
      // 라우터 접근할 때마다 passport.deserializeUser가 자동 실행되어 req.user를 사용할 수 있다.
      UserId: req.user.id, 
    });
    // 다시 정보를 완성시켜서 프론트로 응답해줘야 한다.
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname'], // 사용자 가져올 땐 비밀번호 빼고 가져와야 한다! (보안 주의)
          order: [['createdAt', 'DESC']],
        }]
      }, {
        model: User, // 게시글 작성자
        attributes: ['id', 'nickname'], 
      }, {
        model: User, // 게시글 좋아요 누른 사람들 (Likers)
        as: 'Likers', // 이렇게 해야 게시글, 댓글 작성자와 구별되고 post.Likers를 사용할 수 있다.
        attributes: ['id'],
      }],
    });

    res.status(201).json(fullPost);
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
      return res.sendStatus(403).send('존재하지 않는 게시글입니다.');
    }
    
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId),
      UserId: req.user.id,
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }]
    });

    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { // PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다');
    }
    // 찾은 게시글과 그 게시글에 좋아요 누른 User의 관계를 처리한다.
    await post.addLikers(req.user.id); // 시퀄라이즈에서 자동으로 만들어준 addLikers() 메서드를 이용하여 [좋아요한 유저를 추가]
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => { // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', (req, res) => { // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
