# Hospital Management System

A simple, beginner-friendly hospital management system built with Node.js, Express, MySQL, and Bootstrap.

## Features

### Patient Module
- Registration and Login
- Book appointments with doctors
- View appointment details

### Doctor Module
- Self-registration (requires admin approval)
- Login
- View appointments
- Accept/Reject appointments
- Update availability

### Admin Module
- Login
- Approve/Reject doctors
- View and manage patients
- View all appointments

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT, bcrypt

## Folder Structure

```
HospitalManagementSystem/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── admin.js
│   │   └── appointments.js
│   ├── db.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── doctor.js
│   │   └── admin.js
│   ├── pages/
│   │   ├── patient-login.html
│   │   ├── patient-register.html
│   │   ├── patient-dashboard.html
│   │   ├── book-appointment.html
│   │   ├── view-appointments.html
│   │   ├── doctor-login.html
│   │   ├── doctor-register.html
│   │   ├── doctor-dashboard.html
│   │   ├── doctor-appointments.html
│   │   ├── update-availability.html
│   │   ├── admin-login.html
│   │   ├── admin-dashboard.html
│   │   ├── approve-doctors.html
│   │   ├── manage-patients.html
│   │   └── manage-appointments.html
│   ├── index.html
│   ├── about.html
│   └── contact.html
└── config/
    └── database.sql
```

## Installation Steps

### 1. Prerequisites
- Node.js installed
- MySQL installed and running
- XAMPP or WAMP (optional, for MySQL)

### 2. Database Setup
1. Open MySQL command line or phpMyAdmin
2. Run the `config/database.sql` file to create the database and tables

```sql
-- Update the admin password hash in database.sql before running
-- Or insert a new admin with bcrypt hashed password
```

### 3. Backend Setup
```bash
cd backend
npm install
```

### 4. Update Database Configuration
Edit `backend/db.js` with your MySQL credentials:
```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'hospital_db',
    ...
});
```

### 5. Start the Server
```bash
cd backend
npm start
```
The server runs on `http://localhost:5000`

### 6. Frontend Setup
Open `frontend/index.html` in a browser or use a live server extension.

## API Endpoints

### Authentication
- `POST /api/auth/patient/register` - Patient registration
- `POST /api/auth/patient/login` - Patient login
- `POST /api/auth/doctor/register` - Doctor registration
- `POST /api/auth/doctor/login` - Doctor login
- `POST /api/auth/admin/login` - Admin login

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/patient/:id` - Get patient appointments
- `GET /api/appointments/doctor/:id` - Get doctor appointments
- `PUT /api/appointments/:id/status` - Update appointment status

### Doctors
- `GET /api/doctors` - Get all approved doctors
- `PUT /api/doctors/:id/availability` - Update doctor availability

### Admin
- `GET /api/admin/doctors` - Get all doctors
- `PUT /api/admin/doctors/:id/approve` - Approve doctor
- `GET /api/admin/patients` - Get all patients

## Default Credentials

### Admin
- Email: admin@hospital.com
- Password: (set in database.sql after hashing)

## Usage

1. **Patient**: Register or login to book appointments
2. **Doctor**: Register, wait for admin approval, then login to manage appointments
3. **Admin**: Login to approve doctors and manage the system

## Notes

- JWT secret key is set to "secret_key" - change in production
- bcrypt is used for password hashing
- Update the API_URL in frontend JS files if backend runs on different port