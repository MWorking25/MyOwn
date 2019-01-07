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
		
		app.post('/api/SetNewPassword', function (req, res) {
			security(req, res);Users.SetNewPassword(req, res);
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

		app.delete('/api/DeleteBrandDetails/:brandid', function (req, res) {
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

		app.delete('/api/DeleteProductDetails/:productid', function (req, res) {
			security(req, res);
			Product.DeleteProductDetails(req, res);
		});


		app.post('/api/SubmitOrder', function (req, res) {
			security(req, res);
			Product.SubmitOrder(req, res);
		});

		app.post('/api/SaveCustomerDetails/', function (req, res) {
			security(req, res);
			Product.SaveCustomerDetails(req, res);
		});
		
		app.get('/api/ListCustomers/', function (req, res) {
			security(req, res);
			Product.ListCustomers(req, res);
		});
		
		app.get('/api/GetCustomerDetails/:customerid', function (req, res) {
			security(req, res);
			Product.GetCustomerDetails(req, res);
		});
		
		app.delete('/api/DeleteCustomerDetails/:customerid', function (req, res) {
			security(req, res);
			Product.DeleteCustomerDetails(req, res);
		});

		//INQUIRIES
		
		app.post('/api/SaveInquiryDetails/', function (req, res) {
			security(req, res);
			Product.SaveInquiryDetails(req, res);
		});
		
		app.get('/api/ListInquiries/', function (req, res) {
			security(req, res);
			Product.ListInquiries(req, res);
		});
		
		app.get('/api/GetInquiryDetails/:inquiryid', function (req, res) {
			security(req, res);
			Product.GetInquiryDetails(req, res);
		});
		
		app.delete('/api/DeleteInquiryDetails/:inquiryid', function (req, res) {
			security(req, res);
			Product.DeleteInquiryDetails(req, res);
		});

		//SALES
		
			app.get('/api/GetSaleListOninterval/:interval', function (req, res) {
			security(req, res);
			Product.GetSaleListOninterval(req, res);
		});
		
		app.get('/api/GetsaleListOndates/:fromdate/:todate', function (req, res) {
			security(req, res);
			Product.GetsaleListOndates(req, res);
		});
		
		app.delete('/api/DeleteSalesDetails/:saleid', function (req, res) {
			security(req, res);
			Product.DeleteSalesDetails(req, res);
		});
		
		//DASHBOARD
		

		app.get('/api/GetDashboardCount/:interval', function (req, res) {
			security(req, res);
			Product.GetDashboardCount(req, res);
		});

		
		app.get('/api/GetDashboardCountOndates/:fromdate/:todate', function (req, res) {
			security(req, res);
			Product.GetDashboardCountOndates(req, res);
		});

		
		app.get('/api/getTopsaledProducts/', function (req, res) {
			security(req, res);
			Product.getTopsaledProducts(req, res);
		});
		
		app.get('/api/getMonthlysaleNPurchase/', function (req, res) {
			security(req, res);
			Product.getMonthlysaleNPurchase(req, res);
		});

	}
	

	
};