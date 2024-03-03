// Import the Express framework
var express = require('express'); 
// Import the path module
var path = require('path'); 
// Create an instance of the Express application
var app = express(); 
// Import express-handlebars for template rendering
const exphbs = require('express-handlebars'); 
// Define the port for the application, defaulting to 3000 if not provided
const port = process.env.port || 3000; 

const data = require('./datasetB.json'); 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); 
// Set up Handlebars as the template engine
app.engine('.hbs', exphbs.engine(
  { 
    extname: '.hbs',
    // helpers: {
    //   formatReviews: function(reviews) {
    //     return reviews === 0 ? "N/A" : this.reviews;
    //   }
    // }
  })); 
// Set the view engine to Handlebars
app.set('view engine', 'hbs'); 

// Define route for the home page
app.get('/', function(req, res) {
  // Render the 'index' view with a title
  res.render('index', { title: 'Express'}); 
});

// Define route for '/users'
app.get('/users', function(req, res) {
  // Send a simple response for '/users' route
  res.render('error', {message: 'Wrong Route'}); 
});

app.get("/data/", (req, res) => {
  if (data) {
    console.log(data);
    res.render('data', { title: 'JSON data is loaded and ready!' });
  }
});

app.get("/data/product/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (data && data[index]) {
    // Retrieving the product information based on the provided index
    const product = data[index];
    res.render('product', { title: 'Product Details', data: JSON.stringify(product) });
  }
  // You may want to add logic to retrieve and render product details here
  
});

app.get("/data/search/productid", (req, res) => {
  res.render('prdIDSrcForm', { title: 'Search by Product ID' });
});

app.post("/data/search/productid", (req, res) => {
  const productId = req.body.productId;
  if (data && Array.isArray(data)) {
    const matchingProduct = data.find((product) => product.asin === productId);
    // Checking if a matching product was found
    if (matchingProduct) {
      res.render('prdIDSrcResult', { title: 'Search Results', data: JSON.stringify(matchingProduct) });
    } 
    else {
      res.render('error', { message: 'Product Not Found'});
    }
  }
});

app.get("/data/search/prdName/", (req, res) => {
  res.render('prdNameSrcForm', { title: 'Search by Product Name' });
});

app.post("/data/search/prdName/", (req, res) => {
  const productName = req.body.productName;
  if (data && Array.isArray(data)) {
    const matchingProducts = data.filter((product) => product.title.includes(productName));
    if (matchingProducts.length > 0) {
      // Extracting specific information from matching products
      const result = matchingProducts.map(({ asin, title, price }) => ({ asin, title, price }));
      res.render('prdIDSrcResult', { title: 'Search Results', data: JSON.stringify(result) });
    } else {
      res.render('error', { message: 'Product Not Found'});
    }
  }
});

app.get("/allData", (req, res) => {
  // Check if data was successfully read
  if (data && Array.isArray(data)) {
      res.render('allData', { title: 'All Products', products: data });
  } else {
      // Send a 500 Internal Server Error response if there is an issue loading the data
      res.status(500).render('500', { title: '500 Internal Server Error' });
  }
});

// Define catch-all route for any other routes not defined
app.get('*', function(req, res) {
  // Render the 'error' view with an error message
  res.render('error', { title: 'Error', message:'Wrong Route' }); 
});

// Start the server and listen for requests on the defined port
app.listen(port, () => {
  // Log a message indicating the server is running
  console.log(`Example app listening at http://localhost:${port}`); 
});
