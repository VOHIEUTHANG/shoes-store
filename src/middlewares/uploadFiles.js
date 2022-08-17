import multer from 'multer';

const MIME_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png',
};

const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, 'public/assets/uploads/');
   },
   filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, 'images_' + Date.now() + '.' + extension);
   },
});

const upload = multer({ storage });

const signleFileUpload = (fileKey = 'file') => upload.single(fileKey);
const multipleFileUpload= (fileKey = 'file',num=12) => upload.array(fileKey,num);
export { signleFileUpload,multipleFileUpload };
