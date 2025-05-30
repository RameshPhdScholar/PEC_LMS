# Leave Management System

A comprehensive leave management system built with Next.js, Material-UI, and MySQL. This system provides role-based access control for employees, HODs, principals, and administrators to manage leave applications efficiently.

## 🚀 Features

### User Roles
- **Employee**: Apply for leaves, view leave history
- **HOD (Head of Department)**: Approve/reject department leaves, view department analytics
- **Principal**: Final approval for leaves, view all department reports
- **Admin**: Manage users, leave allocations, system configuration
- **Super Admin**: Full system access and user management

### Leave Management
- **6 Leave Types**: Casual Leave, On Duty Leave, Compensatory Casual Leave, Sick Leave, Maternity Leave, Vacation Leave
- **Approval Workflow**: Employee → HOD → Principal
- **Advanced Filtering**: Filter by department, leave type, status, date range
- **Real-time Analytics**: Dashboard with leave statistics and trends
- **Export Functionality**: Export leave reports to CSV

### System Features
- **10 Departments**: CSE, CSD, CSC, CSM, CE, EEE, ECE, H&S, MBA, Admin
- **6-Day Work Week**: Automatic holiday calculation with second Saturday off
- **Individual Leave Allocation**: Admin can set leave balances per user
- **Automatic Leave Assignment**: 12 casual leaves per year for all users
- **Rich UI**: Modern Material-UI design with advanced analytics

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Backend**: Next.js API Routes
- **Database**: MySQL 8.0
- **Authentication**: NextAuth.js
- **Styling**: Material-UI with custom themes
- **Charts**: Recharts for analytics
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/leave-management-system.git
   cd leave-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE leave_management;

   # Import schema
   mysql -u root -p leave_management < src/db/schema.sql

   # Import real employee data
   mysql -u root -p leave_management < src/db/real_credentials_import.sql
   ```

4. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=leave_management

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 👥 Default Login Credentials

### Administrative Users
- **Super Admin**: superadmin@pallaviengineeringcollege.ac.in / password123
- **Admin**: admin@pallaviengineeringcollege.ac.in / password123
- **Principal**: principal@pallaviengineeringcollege.ac.in / password123

### HOD Credentials
- **CSE HOD**: cse.hod@pallaviengineeringcollege.ac.in / password123
- **EEE HOD**: eee.hod@pallaviengineeringcollege.ac.in / password123
- **ECE HOD**: ece.hod@pallaviengineeringcollege.ac.in / password123
- (And more for each department)

### Employee Access
Employees can be added through the admin panel with department-specific employee IDs (e.g., CSE001, EEE001, etc.)

## 🎯 Key Features Implemented

### Advanced Filtering
- Department-wise filtering
- Leave type filtering
- Status-based filtering
- Date range filtering
- Real-time search

### Analytics Dashboard
- Leave statistics by department
- Monthly leave trends
- Employee leave utilization
- Approval workflow metrics

### Role-Based Access Control
- Hierarchical approval system
- Department-specific access for HODs
- Comprehensive admin controls
- Secure authentication

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Update `.env.local` with production database credentials and secure secrets.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- Next.js team for the amazing React framework
- All contributors who helped improve this system
