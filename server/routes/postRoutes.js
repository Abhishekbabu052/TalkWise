const r = require('express').Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const c = require('../controllers/postController');
const { protect, optionalProtect } = require('../middleware/auth');
const admin = require('../middleware/admin');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: 'talkwise/posts', allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'] },
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
