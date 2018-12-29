const security = require('./security/Security');
const Users = require ('./controller/Users');
const Orders = require ('./controller/Orders');
const Product = require ('./controller/Product');
const multer = require('multer');
var path = require('path');
	const dir = './www/uploads';
	
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
			
		app.post('/api/authUser',function (req, res) {
			Users.authUser(req.body,res);
		});
		
		app.post('/api/ResetPassword',function (req, res) {
			Users.ResetPassword(req,res);
		});
	
		app.post('/api/ForgotPassword',function (req, res) {
			Users.ForgotPassword(req.body,res);
		});
		
		app.get('/api/verifyOTP/:otp',function (req, res) {
			Users.verifyOTP(req,res);
		});

		app.post('/api/SaveCompanyData', upload.single('file'),function (req, res) {
            Users.SaveCompanyData(req, res);
			});
		
    }
};