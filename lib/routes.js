const security = require('./security/Security');
const Users = require('./controller/Users');
const Orders = require('./controller/Orders');
const Product = require('./controller/Product');
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

let upload = multer({
	storage: storage
});

module.exports = {

	configure: function (app) {

		app.post('/api/authUser', function (req, res) {
			Users.authUser(req.body, res);
		});

		app.get('/api/SignOut/', function (req, res) {
			security(req, res);
			Users.SignOut(req, res);
		});

		app.get('/api/getCoockies/', function (req, res) {
			if (req.headers.cookie) {
				security(req, res);
				Users.getCoockies(req, res);
			}
		});



		app.post('/api/ResetPassword', function (req, res) {
			Users.ResetPassword(req, res);
		});

		app.post('/api/ForgotPassword', function (req, res) {
			Users.ForgotPassword(req.body, res);
		});

		app.get('/api/verifyOTP/:otp', function (req, res) {
			Users.verifyOTP(req, res);
		});

		app.get('/api/ListCompanyies', function (req, res) {
			security(req, res);
			Users.ListCompanyies(req, res);
		});

		app.get('/api/GetCompanyDetails/:companyid', function (req, res) {
			security(req, res);
			Users.GetCompanyDetails(req, res);
		});

		app.get('/api/ValidateEmail/:email', function (req, res) {
			security(req, res);
			Users.ValidateEmail(req, res);
		});

		app.delete('/api/DeleteCompanyDetails/:companyid', function (req, res) {
			security(req, res);
			Users.DeleteCompanyDetails(req, res);
		});

		app.post('/api/SaveCompanyData', upload.single('file'), function (req, res) {
			security(req, res);
			Users.SaveCompanyData(req, res);
		});

		// BRANDS

		app.post('/api/SaveBrandDetails', function (req, res) {
			security(req, res);
			Product.SaveBrandDetails(req, res);
		});

		app.get('/api/ListBrands', function (req, res) {
			security(req, res);
			Product.ListBrands(req, res);
		});

		app.get('/api/getBrandDetails/:brandid', function (req, res) {
			security(req, res);
			Product.getBrandDetails(req, res);
		});

		app.get('/api/DeleteBrandDetails/:brandid', function (req, res) {
			security(req, res);
			Product.DeleteBrandDetails(req, res);
		});

		// PRODUCTS
		
		app.post('/api/SaveProductDetails', upload.single('file'), function (req, res) {
			security(req, res);
			Product.SaveProductDetails(req, res);
		});

		app.get('/api/ListProducts', function (req, res) {
			security(req, res);
			Product.ListProducts(req, res);
		});

		app.get('/api/GetProductDetails/:productid', function (req, res) {
			security(req, res);
			Product.GetProductDetails(req, res);
		});

		
	}
};