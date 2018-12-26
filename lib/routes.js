
const multer = require('multer');
var path = require('path');
	const dir = './app/uploads';
	
let storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, dir);
		},
		filename: (req, file, cb) => {
			cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
		}
	});
	
	let upload = multer({storage: storage});

module.exports = {

    configure: function (app) {
			
		
    }
};