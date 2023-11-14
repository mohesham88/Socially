import multer from 'multer'; // handle files (images)
/* 
Two uploaders one for posts and one for users
*/




function profilePicturesUploader(req, res, next) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `/public/assets/${req.user.userId}/profilePicture`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null,  uniqueSuffix)
    }
  });

  const upload = multer({ storage });
  
  return upload;
}


function postsUploader(req, res, next) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `/public/assets/${req.user.userId}/posts`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix)
    }
  });

  const upload = multer({ storage });
  
  return upload;
}


export  {postsUploader, profilePicturesUploader};