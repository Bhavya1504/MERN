

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received username:', username);
  console.log('Received password:', password);

  const query = 'SELECT * FROM employees WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }
    console.log('Query results:', results);
    if (results.length > 0 && results[0].password === password) {
      console.log('Login successful');
      res.status(200).json({ message: 'Login successful' }); 
    } else {
      console.log('Invalid username or password');
      res.status(401).json({ message: 'Invalid username or password' }); // Respond with an error status code
    }
  });
});


app.post('/submit_employee', (req, res) => {
  const { name, email, mobile, designation, gender, course, image } = req.body;

 
  res.redirect(`/employeelist?name=${name}&email=${email}&mobile=${mobile}&designation=${designation}&gender=${gender}&course=${JSON.stringify(course)}&image=${image}`);
});


app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/script.js');
});

app.get('/styles.css', (req, res) => {
  res.sendFile(__dirname + '/styles.css');
});

app.get('/employeelist', (req, res) => {
  res.sendFile(__dirname + '/public/employeelist.html');
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
