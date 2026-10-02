const r = require('express').Router();
const multer = require('multer');
const path = require('path');
const c = require('../controllers/postController');
const { protect, optionalProtect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, f, cb) => cb(null, Date.now() + path.extname(f.originalname)),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, f, cb) => cb(null, /image\/(jpeg|png|webp|gif)/.test(f.mimetype)),
});
r.post('/:id/react', optionalProtect, c.react); // public: guest reactions use a browser ID
r.get('/', c.getPosts); r.get('/:id', optionalProtect, c.getPost);
r.post('/', protect, admin, upload.single('image'), c.createPost);
r.put('/:id', protect, admin, upload.single('image'), c.updatePost);
r.delete('/:id', protect, admin, c.deletePost);
module.exports = r;
