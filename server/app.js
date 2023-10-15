const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const app = express();
const port =3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin:'<client url from where request is initiating>',
    methods:['GET','POST','PUT','DELETE'],
    allowHeaders:['Content-Type'],

  })
);

const db = mysql.createConnection({
  host:'<Endpoint>',
  user:'<username>',
  password:'<password>',
  database:'<Database>',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err);
  } else {
    console.log('Connected to the database');
  }
});

// ...

// Create the students table if it doesn't exist
db.query(`
  CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    rollno VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL
  )
`, (err, result) => {
  if (err) {
    console.error('Error creating students table: ' + err);
  } else {
    console.log('Students table created successfully');
  }
});

// ...



app.use(express.static('public'));

// Route to add a student
app.post('/add-student', (req, res) => {
  console.log("inside");
  const { name, surname, rollno, city } = req.body;
  const student = { name, surname, rollno, city };
  console.log(student);
  const sql = 'INSERT INTO students SET ?';

  db.query(sql, student, (err, result) => {
    if (err) {
      console.error('Error adding student: ' + err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Student added successfully');
      res.status(201).json({ success: true });
    }
  });
});


app.get("/gopal",(req,res)=>{
  res.send("Gopal bhau zindabad");
})


// Route to retrieve all students
app.get('/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) {
      console.error('Error fetching students: ' + err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// Route to update a student
app.put('/update-student/:id', (req, res) => {
  const studentId = req.params.id;
  console.log("inside put request id= ",studentId);
  const { name, surname, rollno, city } = req.body;
  const sql = 'UPDATE students SET name = ?, surname = ?, rollno = ?, city = ? WHERE rollno = ?';

  db.query(sql, [name, surname, rollno, city, studentId], (err, result) => {
    if (err) {
      console.error('Error updating student: ' + err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Student updated successfully');
      res.json({ success: true });
    }
  });
});




// Route to delete a student
app.delete('/delete-student/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = 'DELETE FROM students WHERE rollno = ?';

  db.query(sql, studentId, (err, result) => {
    if (err) {
      console.error('Error deleting student: ' + err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Student deleted successfully');
      res.json({ success: true });
    }
  });
});







app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
