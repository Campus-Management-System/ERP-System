# 🎓 SMART CAMPUS MANAGEMENT SYSTEM

A comprehensive full-stack web application built with the MERN stack for managing campus operations including student records, attendance tracking, and analytics.

**Developer:** Swastik Bhardwaj (Person A)  
**Tech Stack:** MongoDB, Express.js, React.js, Node.js

---

## ✨ Features

### Person A Modules (Implemented)

#### 1. **Authentication & Authorization** 🔐
- JWT-based secure authentication
- Role-based access control (Admin, Faculty, Student)
- Password hashing with bcrypt
- Token-based session management
- Automatic token refresh and logout

#### 2. **Student Management System** 👨‍🎓
- Complete CRUD operations for student records
- Comprehensive student profiles (personal, academic, guardian info)
- CSV bulk upload for student data
- Advanced search and filtering
- Pagination support
- Department and year-wise statistics

#### 3. **Attendance Management System** 📅
- Mark attendance for individual or multiple students
- Subject-wise attendance tracking
- Real-time attendance percentage calculation
- Low attendance alerts (below 75%)
- Monthly attendance trends
- Date range filtering
- Session-based tracking (Morning/Afternoon/Full Day)

#### 4. **Interactive Dashboards** 📊

**Admin Dashboard:**
- Total students and active students count
- Department-wise student distribution (Pie Chart)
- Year-wise student distribution (Bar Chart)
- Low attendance alerts table
- Quick action buttons for navigation

**Student Dashboard:**
- Personal information display
- Overall attendance percentage
- Subject-wise attendance breakdown (Bar Chart)
- Attendance distribution (Pie Chart)
- Detailed attendance table with color-coded percentages

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Campus-Management-System/ERP-System.git
cd ERP-System
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret

# Seed the database with sample data
node seed.js

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

---

## 🔑 Login Credentials

After running the seed script, use these credentials:

### Admin
- **Email:** `admin@example.com`
- **Password:** `admin123`

### Faculty
- **Email:** `rajesh@example.com`
- **Password:** `faculty123`

### Students
- **Email:** `amit.student@example.com`
- **Password:** `stu001`
- **Email:** `priya.student@example.com`
- **Password:** `stu002`

---

## 📁 Project Structure

```
ERP-System/
│
├── backend/
│   ├── modules/
│   │   ├── auth/              # Authentication module
│   │   │   ├── model.js       # User schema
│   │   │   ├── controller.js  # Auth logic
│   │   │   ├── middleware.js  # JWT verification
│   │   │   └── routes.js      # Auth routes
│   │   │
│   │   ├── students/          # Student management module
│   │   │   ├── model.js       # Student schema
│   │   │   ├── controller.js  # CRUD operations
│   │   │   └── routes.js      # Student routes
│   │   │
│   │   └── attendance/        # Attendance module
│   │       ├── model.js       # Attendance schema
│   │       ├── controller.js  # Attendance logic
│   │       └── routes.js      # Attendance routes
│   │
│   ├── server.js              # Express server
│   ├── seed.js                # Database seeder
│   ├── package.json
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js           # Login page
│   │   │   ├── AdminDashboard.js  # Admin dashboard
│   │   │   └── StudentDashboard.js # Student dashboard
│   │   │
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── authService.js      # Auth API calls
│   │   │   ├── studentService.js   # Student API calls
│   │   │   └── attendanceService.js # Attendance API calls
│   │   │
│   │   ├── styles/
│   │   │   ├── Login.css
│   │   │   ├── AdminDashboard.css
│   │   │   └── StudentDashboard.css
│   │   │
│   │   ├── App.js             # Main app component
│   │   └── index.js           # React entry point
│   │
│   └── package.json
│
└── README.md
```

---

## 🎨 UI/UX Features

- **Modern Gradient Design:** Beautiful gradient backgrounds and cards
- **Smooth Animations:** Hover effects, transitions, and loading states
- **Responsive Layout:** Works perfectly on desktop, tablet, and mobile
- **Interactive Charts:** Recharts library for data visualization
- **Color-Coded Data:** Green for good attendance (≥75%), red for low attendance
- **Toast Notifications:** Real-time feedback for user actions
- **Loading States:** Spinners and skeletons for better UX

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Students
- `GET /api/students` - Get all students (with pagination)
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/studentId/:studentId` - Get student by student ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/upload-csv` - Bulk upload students
- `GET /api/students/stats` - Get student statistics

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance
- `GET /api/attendance/student/:studentId` - Get student attendance
- `GET /api/attendance/stats/:studentId` - Get attendance statistics
- `GET /api/attendance/subject/:subjectCode` - Get subject attendance
- `GET /api/attendance/date/:date` - Get attendance by date
- `GET /api/attendance/low-attendance` - Get low attendance students

---

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **multer** - File uploads
- **csv-parser** - CSV processing

### Frontend
- **React** 18.2.0 - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **date-fns** - Date formatting

---

## 📊 Sample Data

The seed script creates:
- **1 Admin** user
- **2 Faculty** users
- **5 Student** users and records
- **~600 Attendance** records (30 days of data)

---

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Role-based access control
- Protected API routes
- Token expiration handling
- Input validation
- SQL injection prevention (NoSQL)
- XSS protection

---

## 🎯 Future Enhancements

- Email notifications for low attendance
- PDF report generation
- Mobile app (React Native)
- Biometric attendance
- Parent portal
- SMS notifications
- Advanced analytics with ML predictions
- Faculty dashboard (Person B's work)
- Marks management (Person B's work)
- Notice board (Person B's work)

---

## 👨‍💻 Developer

**Swastik Bhardwaj**  
Role: Person A  
Modules: Authentication, Student Management, Attendance Management, Dashboards

---

## 📝 License

This project is part of an academic assignment.

---

## 🤝 Contributing

This is an individual academic project. For any queries, please contact the developer.

---

## 📞 Support

For any issues or questions:
- Check the documentation above
- Review the code comments
- Ensure MongoDB is running
- Check environment variables
- Verify all dependencies are installed

---

**Made with ❤️ by Swastik Bhardwaj**
