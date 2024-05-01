const multer = require('multer');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(
            null, 
            path.join(__dirname, '..', 'uploads', 'defects')
        );
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
});

const upload = multer({
    storage: storage
});

module.exports = upload;