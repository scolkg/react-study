const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 파일시스템 조작해주는 라이브러리 (폴더생성 등)

const { isLoggedIn } = require('./middlewares');
const { Post, Image, Comment, User, Hashtag } = require('../models');
const image = require('../models/image');

const router = express.Router();

// uploads 폴더 없으면 자동 생성
try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

// 이미지 업로드 multer는 app에 적용할 수 있지만 개별적으로 라우터마다 적용한다. form 마다 멀티파트 사용 유무가 다르기 떄문에
// multer 설정
// 지금은 하드디스큰데 나중엔 클라우드에 저장해야 한다. 나중에 백엔데에 요청이 늘어나면 서버 스케일링을 해줘야하는데 (같은파일을 여러 서버에 복사)
// 이미지 용량도 크니 서버에 쓸 데 없는 용량을 줄여야 하므로 aws등의 클라우드를 이용하는 게 좋다.
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) { // 제로초.png
      // 파일 이름 중복이 있으면 안되므로 이름에 현재 시간을 붙여서 변경해준다.
      const ext = path.extname(file.originalname); // 확장자 추출 (.png)
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + '_' + new Date().getTime() + ext); // 제로초1511818291.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// 이미 이미지는 서버에 올라갔기 때문에 upload.none()으로 텍스트 데이터만 올리면 된다.
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /post
  try {
    // 해시캐그 정규표현식으로 추출
    const hashtags = req.body.content.match(/#[^\s#]+/g); // #노드, #리액트
    const post = await Post.create({
      content: req.body.content,
      // 게시글 쓰려면 로그인을 헀다는 것이기 때문에 req.user 로 id 이용 가능.
      // 라우터 접근할 때마다 passport.deserializeUser가 자동 실행되어 req.user를 사용할 수 있다.
      UserId: req.user.id, 
    });
    if (hashtags) {
      console.log(hashtags);
      // 이미 등록된 해시태그가 있다면 패스하고 없으면 create한다.
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() }, 
      })));
      // result: [[노드, true], [리액트, true]] // 그래서 첫번째 v[0]만 넣어준다.
      await post.addHashtags(result.map((v) => v[0]));
    }

    // 이미지 텍스트 정보가 있는지 확인
    if (req.body.image) {
      if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png] 처럼 배열로 들어오고 한개면 배열이 아니니 if 써서 판단.
        // 배열로 들어온 이미지 정보들을 시퀄라이즈 해준다.
        // create()는 promise이므로 await Prosmise.all() 해준다.
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image }))); // 주소만 넣으면 된다. 실제 데이터는 CDN 에 저장하여 캐싱을 이용하면 더 빠르니까.
        await post.addImages(images); // post에 images 주소들 추가
      
      } else { // 이미지를 하나만 올리면 image: 제로초.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

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

// 3번째 파라미터: 한장만 올릴거면 upload.single('image'), 폼에 파일 input이 두개이상씩 있을 땐 upload.fields() 텍스트-json만 있다 그러면 upload.none() 쓰면 된다.
// 순서: isLoggedIn으로 로그인검사부터 하고, upload.array()로 업로드해준다.
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => { // POST /post/images
  console.log(req.files); // 업로드된 파일들의 정보가 들어있다.
  res.json(req.files.map((v) => v.filename)); // 업로드된 파일들 정보를 프론트로 보내준다.
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
      PostId: parseInt(req.params.postId, 10),
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

router.delete('/:postId', isLoggedIn, async (req, res, next) => { // DELETE /post/1
  try {
    await Post.destroy({
      where: { 
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 리트윗하기
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => { // POST /post/1/retweet
  try {
    // 실제로 postId가 존재하는지 철저하게 체크해주자.
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Retweet', // post.Retweet을 가져와서 쓸 수 있다.
      }],
    });
    if (!post) {
      return res.sendStatus(403).send('존재하지 않는 게시글입니다.');
    }
    // retweet은 검사할 게 좀 있다.
    // 내 게시글이거나 나의 게시글을 다른 사람이 리트윗한 게시글을 리트윗한거면 막자.
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    // 다른 사람 게시글을 리트윗한 게시글은 또 리트윗할 수 있다. RetweetId가 있다면 그걸 그대로 쓰면 되고 아니면 postId를 쓰면 된다.
    const retweetTargetId = post.RetweetId || post.id;
    // 이미 리트윗했는지 찾아본다.
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    })
    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    // 어떤 게시글을 리트윗했는지 정보를 합쳐서 프론트에 보내준다.
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{ // 리트윗한 게시글(Post)도 한번 더 include해주자
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }],
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }],
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
