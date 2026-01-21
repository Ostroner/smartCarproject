// In-Memory Database (Fallback if MySQL not available)
// Data will be reset on server restart

class MemoryDB {
  constructor() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@crpms.com',
        password: '$2a$10$6Bj7P4lYvHWzQzF8xD2D0uOvXzVXvqWqJyK9zD2K0LvPxYlSJ5PYC', // Admin@123
        createdAt: new Date().toISOString()
      }
    ];
    this.customers = [];
    this.cars = [];
    this.serviceRecords = [];
    this.payments = [];
    this.nextIds = {
      users: 2,
      customers: 1,
      cars: 1,
      serviceRecords: 1,
      payments: 1
    };
  }

  // Users
  addUser(user) {
    const newUser = { ...user, id: this.nextIds.users++, createdAt: new Date().toISOString() };
    this.users.push(newUser);
    return newUser;
  }

  getUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  updateUserPassword(userId, hashedPassword) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.password = hashedPassword;
      return true;
    }
    return false;
  }

  // Customers
  addCustomer(customer) {
    const newCustomer = { ...customer, id: this.nextIds.customers++, createdAt: new Date().toISOString() };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  getCustomers() {
    return this.customers;
  }

  getCustomerById(id) {
    return this.customers.find(c => c.id === parseInt(id));
  }

  updateCustomer(id, data) {
    const customer = this.customers.find(c => c.id === parseInt(id));
    if (customer) {
      Object.assign(customer, data);
      return customer;
    }
    return null;
  }

  deleteCustomer(id) {
    const index = this.customers.findIndex(c => c.id === parseInt(id));
    if (index > -1) {
      this.customers.splice(index, 1);
      return true;
    }
    return false;
  }

  // Cars
  addCar(car) {
    const newCar = { ...car, id: this.nextIds.cars++, createdAt: new Date().toISOString() };
    this.cars.push(newCar);
    return newCar;
  }

  getCars() {
    return this.cars;
  }

  getCarById(id) {
    return this.cars.find(c => c.id === parseInt(id));
  }

  updateCar(id, data) {
    const car = this.cars.find(c => c.id === parseInt(id));
    if (car) {
      Object.assign(car, data);
      return car;
    }
    return null;
  }

  deleteCar(id) {
    const index = this.cars.findIndex(c => c.id === parseInt(id));
    if (index > -1) {
      this.cars.splice(index, 1);
      return true;
    }
    return false;
  }

  // Service Records
  addServiceRecord(record) {
    const newRecord = { ...record, id: this.nextIds.serviceRecords++, createdAt: new Date().toISOString() };
    this.serviceRecords.push(newRecord);
    return newRecord;
  }

  getServiceRecords() {
    return this.serviceRecords;
  }

  getServiceRecordById(id) {
    return this.serviceRecords.find(r => r.id === parseInt(id));
  }

  updateServiceRecord(id, data) {
    const record = this.serviceRecords.find(r => r.id === parseInt(id));
    if (record) {
      Object.assign(record, data);
      return record;
    }
    return null;
  }

  deleteServiceRecord(id) {
    const index = this.serviceRecords.findIndex(r => r.id === parseInt(id));
    if (index > -1) {
      this.serviceRecords.splice(index, 1);
      return true;
    }
    return false;
  }

  // Payments
  addPayment(payment) {
    const newPayment = { ...payment, id: this.nextIds.payments++, createdAt: new Date().toISOString() };
    this.payments.push(newPayment);
    return newPayment;
  }

  getPayments() {
    return this.payments;
  }

  getPaymentById(id) {
    return this.payments.find(p => p.id === parseInt(id));
  }
}

module.exports = new MemoryDB();
