# 🚀 QUICK START GUIDE

## Step-by-Step Instructions to Run the Application

### 1. Prerequisites Check
Make sure you have installed:
- ✅ Node.js (v14 or higher) - Download from https://nodejs.org/
- ✅ MongoDB - Download from https://www.mongodb.com/try/download/community
  OR use MongoDB Atlas (cloud) - https://www.mongodb.com/cloud/atlas

### 2. Start MongoDB
If using local MongoDB:
```bash
# Windows: MongoDB should start automatically as a service
# Or run: mongod

# Mac/Linux:
sudo systemctl start mongod
# Or: brew services start mongodb-community
```

### 3. Backend Setup (Terminal 1)
```bash
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
npm install

# Create .env file from example
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux

# Edit .env file and update:
# - MONGODB_URI (if using Atlas or different port)
# - JWT_SECRET (change to a random string)

# Seed the database with sample data (first time only)
node seed.js

# Start the backend server
npm run dev
```

✅ Backend should now be running on http://localhost:5000

### 4. Frontend Setup (Terminal 2 - New Terminal)
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start the React app
npm start
```

✅ Frontend should automatically open in your browser at http://localhost:3000

### 5. Login to the Application

The application will open at http://localhost:3000

#### Login as Admin:
- Email: `admin@example.com`
- Password: `admin123`

#### Login as Student:
- Email: `amit.student@example.com`
- Password: `stu001`

OR

- Email: `priya.student@example.com`
- Password: `stu002`

### 6. Explore the Features

**As Admin:**
- View total students and statistics
- See department-wise distribution
- Check low attendance alerts
- Navigate to student management
- View attendance reports

**As Student:**
- View personal information
- Check overall attendance percentage
- See subject-wise attendance breakdown
- View attendance charts and graphs

---

## 🔧 Troubleshooting

### Backend won't start:
- ❌ **Error: MongoDB connection failed**
  - ✅ Make sure MongoDB is running
  - ✅ Check MONGODB_URI in .env file
  - ✅ Try: `mongodb://localhost:27017/campus_management`

- ❌ **Error: Port 5000 already in use**
  - ✅ Change PORT in .env file to 5001 or another port
  - ✅ Update frontend API URL accordingly

### Frontend won't start:
- ❌ **Error: Port 3000 already in use**
  - ✅ Stop other React apps
  - ✅ Or choose a different port when prompted

- ❌ **Error: Cannot connect to backend**
  - ✅ Make sure backend is running on port 5000
  - ✅ Check browser console for errors
  - ✅ Verify REACT_APP_API_URL in frontend/.env

### Login issues:
- ❌ **Invalid credentials**
  - ✅ Make sure you ran `node seed.js` in backend
  - ✅ Use exact email and password from above
  - ✅ Check MongoDB has data: `mongo` then `use campus_management` then `db.users.find()`

### No data showing:
- ❌ **Empty dashboards**
  - ✅ Run seed script: `node seed.js` in backend folder
  - ✅ Refresh the browser
  - ✅ Check browser console for API errors

---

## 📝 Quick Commands Reference

### Backend:
```bash
npm install          # Install dependencies
node seed.js         # Seed database
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend:
```bash
npm install          # Install dependencies
npm start            # Start development server
npm run build        # Build for production
```

### Git:
```bash
git pull             # Get latest changes
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push origin main # Push to GitHub
```

---

## 🎯 What to Test

1. **Login Flow**
   - Try logging in as admin
   - Try logging in as student
   - Try wrong password (should show error)
   - Logout and login again

2. **Admin Dashboard**
   - Check if statistics are showing
   - View the pie chart (departments)
   - View the bar chart (years)
   - Check low attendance table

3. **Student Dashboard**
   - View personal information
   - Check attendance percentage
   - View attendance charts
   - Check subject-wise table

4. **Responsive Design**
   - Resize browser window
   - Check on mobile view (F12 → Toggle device toolbar)
   - Test all features in mobile view

---

## 💡 Tips

- Keep both terminals (backend & frontend) running
- Don't close the terminals while using the app
- Use Chrome/Firefox for best experience
- Open browser DevTools (F12) to see any errors
- Check Network tab to see API calls
- MongoDB Compass is useful to view database

---

## 🆘 Still Having Issues?

1. Delete `node_modules` folder in both backend and frontend
2. Run `npm install` again in both folders
3. Make sure MongoDB is running
4. Run `node seed.js` again
5. Restart both servers

---

**Happy Coding! 🎉**

Made with ❤️ by Swastik Bhardwaj
