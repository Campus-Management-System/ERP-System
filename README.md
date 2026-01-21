# SMART CAMPUS MANAGEMENT SYSTEM

Full Stack Development Project (MERN Stack)

## Team Members

- **Person A**: Swastik Bhardwaj (Academic & Core Student Systems)
- **Person B**: Athar Imam (Faculty, Administration & Communication Systems)

## Architecture

- **Stack**: MERN (MongoDB, Express.js, React.js, Node.js)
- **Authentication**: JWT-based authentication
- **API Communication**: RESTful APIs with JSON responses
- **Role-Based Access Control**: Admin, Faculty, Student
- **Integration Method**: Axios with JWT token interception

## Person A - Modules (Swastik Bhardwaj)

### Module 1: Authentication and Authorization
- User authentication schema (Admin, Faculty, Student roles)
- Secure login APIs using JWT tokens
- Authorization middleware for role-based access
- Login interface for all user roles
- Token storage and session handling
- Role-based routing

### Module 2: Student Management System
- Student database schema
- CRUD APIs for student records
- CSV upload functionality for bulk student import
- Student profile and listing pages
- Forms for adding and updating student data

### Module 3: Attendance Management System
- Attendance schema linked with students and subjects
- APIs to mark, update, and fetch attendance records
- Attendance marking UI for faculty
- Student attendance viewing dashboard

### Module 4: Student Dashboard
- Aggregation APIs for attendance percentage and performance metrics
- Interactive dashboard with charts and summary cards
- Visual display of attendance and academic insights

## API Response Standard

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

## Project Structure

```
smart-campus-management/
│
├── backend/
│   ├── modules/
│   │   ├── auth/
│   │   ├── students/
│   │   ├── attendance/
│   │   ├── faculty/
│   │   ├── marks/
│   │   └── notices/
│   └── server.js
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── App.js
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```
