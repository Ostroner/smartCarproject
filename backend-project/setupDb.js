const mysql = require('mysql2');
const bcryptjs = require('bcryptjs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.log('Make sure MySQL is running on localhost:3306');
    process.exit(1);
  }
  
  console.log('✅ Connected to MySQL Server');
  
  // Create database
  connection.query('CREATE DATABASE IF NOT EXISTS crpms', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      connection.end();
      process.exit(1);
    }
    
    console.log('✅ Database created/already exists');
    
    // Use database
    connection.query('USE crpms', (err) => {
      if (err) {
        console.error('Error using database:', err);
        connection.end();
        process.exit(1);
      }
      
      // Create users table
      connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err);
        else console.log('✅ Users table created');
      });
      
      // Create customers table
      connection.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          email VARCHAR(255) NOT NULL,
          address VARCHAR(255),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating customers table:', err);
        else console.log('✅ Customers table created');
      });
      
      // Create cars table
      connection.query(`
        CREATE TABLE IF NOT EXISTS cars (
          id INT AUTO_INCREMENT PRIMARY KEY,
          licensePlate VARCHAR(50) UNIQUE NOT NULL,
          make VARCHAR(100) NOT NULL,
          model VARCHAR(100) NOT NULL,
          year INT NOT NULL,
          ownerName VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating cars table:', err);
        else console.log('✅ Cars table created');
      });
      
      // Create service_records table
      connection.query(`
        CREATE TABLE IF NOT EXISTS service_records (
          id INT AUTO_INCREMENT PRIMARY KEY,
          carId INT NOT NULL,
          serviceId INT NOT NULL,
          description TEXT,
          cost DECIMAL(10, 2) NOT NULL,
          date VARCHAR(50) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating service_records table:', err);
        else console.log('✅ Service Records table created');
      });
      
      // Create payments table
      connection.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          carId INT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          paymentMethod VARCHAR(50) NOT NULL,
          date VARCHAR(50) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating payments table:', err);
        else console.log('✅ Payments table created');
      });
      
      // Create default admin user
      bcryptjs.hash('Admin@123', 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          connection.end();
          process.exit(1);
        }
        
        connection.query('SELECT * FROM users WHERE username = ?', ['admin'], (err, results) => {
          if (err) {
            console.error('Error checking admin user:', err);
            connection.end();
            process.exit(1);
          }
          
          if (results.length === 0) {
            connection.query(
              'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
              ['admin', 'admin@example.com', hashedPassword],
              (err) => {
                if (err) console.error('Error creating admin user:', err);
                else {
                  console.log('✅ Default admin user created');
                  console.log('   Username: admin');
                  console.log('   Password: Admin@123');
                }
                
                connection.end();
                console.log('\n✅ Database setup completed!');
              }
            );
          } else {
            console.log('✅ Admin user already exists');
            connection.end();
            console.log('\n✅ Database setup completed!');
          }
        });
      });
    });
  });
});
