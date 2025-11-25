# React Attendance System

A React frontend for employee attendance management with location-based clock-in/out, leave management, and role-based access control.

## Features

### Employee Features
- **Clock In/Out** - Location-based with real-time clock display
- **Dashboard** - Personal attendance statistics and recent records
- **Leave Requests** - Submit and track leave applications
- **Attendance Correction** - Request corrections for past attendance
- **Profile Management** - Update personal information

### Manager Features
- **Approve/Deny Leaves** - Manage team leave requests
- **Correction Requests** - Handle attendance correction requests
- **Location Management** - Configure authorized clock-in locations

### Admin Features
- **User Management** - Create, edit, delete users
- **Bulk Import** - Import users from CSV
- All manager features

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Date Handling**: date-fns
- **Styling**: Bootstrap 5

## Installation

```bash
# Clone the repository
git clone https://github.com/asafarviv55/react-attendance-system.git
cd react-attendance-system

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm start
```

## Environment Variables

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
PORT=3000
```

## Project Structure

```
src/
├── components/
│   ├── SignIn.js              # Login page
│   ├── SignUp.js              # Registration
│   ├── Dashboard.js           # Stats & recent attendance
│   ├── ClockInOut.js          # Clock in/out with location
│   ├── AttendanceReports.js   # View attendance history
│   ├── LeaveRequest.js        # Submit leave requests
│   ├── ManageLeaveRequests.js # Approve/deny leaves
│   ├── ManageUsers.js         # User CRUD (admin)
│   ├── ManageLocations.js     # Location config
│   ├── Profile.js             # User profile
│   └── PrivateRoute.js        # Route protection
├── context/
│   └── AuthContext.js         # Authentication state
├── services/
│   └── api.js                 # Axios configuration
└── App.js                     # Routes & layout
```

## Role-Based Access

| Feature | Employee | Manager | Admin |
|---------|----------|---------|-------|
| Clock In/Out | ✅ | ❌ | ❌ |
| View Dashboard | ✅ | ✅ | ✅ |
| Request Leave | ✅ | ❌ | ❌ |
| Manage Leaves | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Manage Locations | ❌ | ✅ | ✅ |

## Docker

```bash
# Build image
docker build -t react-attendance-system .

# Run container
docker run -p 80:80 react-attendance-system
```

## Business Features

- **Real-time Clock** - Live time display on clock-in page
- **Location Verification** - GPS-based attendance validation
- **Dashboard Statistics** - Present days, leave days, avg hours
- **Recent Attendance** - Quick view of last 5 records
- **Role-based Navigation** - Dynamic menu based on user role
- **Session Management** - Auto-logout on token expiration

## API Integration

Requires backend running at `REACT_APP_API_URL` with endpoints:
- `/auth/signin`, `/auth/signup` - Authentication
- `/attendance/clockin`, `/attendance/clockout` - Attendance
- `/attendance/reports` - Attendance history
- `/leave/requests` - Leave management
- `/users` - User management (admin)

## License

MIT
