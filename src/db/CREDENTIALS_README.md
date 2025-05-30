# Leave Management System Credentials

This document provides information about the credentials created for the Leave Management System.

## Credentials Overview

The system has 5 roles:
1. **Employee** - Regular staff members who can apply for leave
2. **HOD** - Heads of Departments who approve leave requests first
3. **Principal** - Approves leave requests after HOD approval
4. **Admin** - Manages the system, updates leave balances
5. **Super Admin** - Has full control over the system

## Department Codes

The system uses the following department codes for employee IDs:
1. CSE - Computer Science and Engineering
2. CSD - Computer Science and Engineering – Data Science
3. CSC - Computer Science and Engineering – Cyber Security
4. CSM - Computer Science and Engineering – Artificial Intelligence & Machine Learning
5. CE - Civil Engineering
6. EEE - Electrical and Electronics Engineering
7. ECE - Electronics and Communication Engineering
8. H&S - Humanities and Sciences (H&S)
9. MBA - Master of Business Administration (MBA)
10. ADM - Administration

## Login Information

All users can log in using their email address and the password: `password123`

### Key Administrative Users

| Name | Email | Employee ID | Role | Department |
|------|-------|-------------|------|------------|
| Dr. Sunil Kapoor | sunil.kapoor@example.com | ADM001 | Principal | Administration |
| Rajesh Khanna | rajesh.khanna@example.com | ADM002 | Admin | Administration |
| Kiran Bedi | kiran.bedi@example.com | ADM003 | Super Admin | Administration |

### Department HODs

| Name | Email | Employee ID | Department |
|------|-------|-------------|------------|
| Dr. Rajesh Kumar | rajesh.kumar@example.com | CSE001 | Computer Science and Engineering |
| Dr. Sanjay Mehta | sanjay.mehta@example.com | CSD001 | CSE (Data Science) |
| Dr. Rahul Verma | rahul.verma@example.com | CSC001 | CSE (Cyber Security) |
| Dr. Vivek Sharma | vivek.sharma@example.com | CSM001 | CSE (AI & ML) |
| Dr. Suresh Iyer | suresh.iyer@example.com | CE001 | Civil Engineering |
| Dr. Mohan Krishnan | mohan.krishnan@example.com | EEE001 | Electrical and Electronics Engineering |
| Dr. Prakash Menon | prakash.menon@example.com | ECE001 | Electronics and Communication Engineering |
| Dr. Anil Kumar | anil.kumar@example.com | HSS001 | Humanities and Sciences |
| Dr. Ramesh Iyer | ramesh.iyer@example.com | MBA001 | Master of Business Administration |

## Special Note

The employee "Ramesh Kore" (CSE005) has been added as an Assistant Professor in the Computer Science and Engineering department with a joining date of May 20, 2025, as per the requirements.

## How to Import Credentials

To import these credentials into your database, run the following command:

```bash
mysql -u root -proot leave_management < src/db/credentials_data.sql
```

## Security Note

These are default credentials for testing and initial setup. In a production environment, it is recommended to:
1. Change the default passwords
2. Implement a password policy
3. Enable password reset functionality
4. Consider implementing two-factor authentication for admin roles
