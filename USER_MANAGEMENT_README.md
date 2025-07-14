# User Management System

This document describes the complete user management system for the Smart Beekeeper Database application, including user authentication, role-based access control, and permission management.

## Features

- **User Authentication**: Secure login with JWT tokens
- **Role-Based Access Control**: Three roles (admin, manager, user)
- **Granular Permissions**: Fine-grained permissions for each module
- **User Management**: Create, read, update, delete users
- **Password Security**: Bcrypt hashing with salt rounds
- **Account Status**: Active/inactive user accounts
- **Permission Management**: Grant/revoke specific permissions

## Database Setup

### 1. Run the Database Setup Script

Execute the SQL script to create the necessary tables:

```bash
mysql -u your_username -p your_database_name < back/database_setup.sql
```

This will create:
- `Users` table for user accounts
- `UserPermissions` table for user-specific permissions
- `UsersWithPermissions` view for easy querying
- Default admin user (username: `admin`, password: `admin123`)

### 2. Default Admin User

The setup script creates a default admin user:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@beekeeper.com
- **Role**: admin
- **Permissions**: All permissions granted

## Backend Setup

### 1. Install Dependencies

The required packages are already installed:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

### 2. Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
```

### 3. API Endpoints

#### Public Endpoints (No Authentication Required)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

#### Protected Endpoints (Authentication Required)
- `GET /api/users` - Get all users (requires `user:read` permission)
- `GET /api/users/:id` - Get user by ID (requires `user:read` permission)
- `GET /api/users/permissions` - Get all available permissions

#### Admin Endpoints (Require Specific Permissions)
- `POST /api/users` - Create user (requires `user:create` permission)
- `PUT /api/users/:id` - Update user (requires `user:update` permission)
- `PUT /api/users/:id/password` - Update password (requires `user:update` permission)
- `DELETE /api/users/:id` - Delete user (requires `user:delete` permission)

## Frontend Setup

### 1. User Management Pages

The frontend includes:
- **User List** (`/users`) - View and manage all users
- **Add User** (`/users/add`) - Create new users
- **Edit User** (`/users/:id/edit`) - Edit existing users

### 2. Navigation

A "Users" link has been added to the main navigation bar.

## Permission System

### Available Permissions

The system supports granular permissions for each module:

#### User Management
- `user:create` - Create new users
- `user:read` - View user information
- `user:update` - Update user details
- `user:delete` - Delete users

#### Beekeeper Management
- `beekeeper:create` - Create beekeepers
- `beekeeper:read` - View beekeeper information
- `beekeeper:update` - Update beekeeper details
- `beekeeper:delete` - Delete beekeepers

#### Hive Management
- `hive:create` - Create hives
- `hive:read` - View hive information
- `hive:update` - Update hive details
- `hive:delete` - Delete hives

#### Species Management
- `species:create` - Create bee species
- `species:read` - View species information
- `species:update` - Update species details
- `species:delete` - Delete species

#### Environment Management
- `environment:create` - Create environment records
- `environment:read` - View environment data
- `environment:update` - Update environment records
- `environment:delete` - Delete environment records

#### Plant Management
- `plant:create` - Create plant records
- `plant:read` - View plant information
- `plant:update` - Update plant details
- `plant:delete` - Delete plants

#### Honey Management
- `honey:create` - Create honey production records
- `honey:read` - View honey production data
- `honey:update` - Update honey production records
- `honey:delete` - Delete honey production records

### Role-Based Permission Templates

#### Admin Role
- All permissions granted
- Full system access

#### Manager Role
- Limited user management (read only)
- Full access to operational data
- Can create/update most records

#### User Role
- Read-only access to most data
- No user management permissions
- Limited to viewing information

## Usage Guide

### 1. Creating Users

1. Navigate to `/users/add`
2. Fill in the user details:
   - Username (required, minimum 3 characters)
   - Email (required, valid format)
   - Password (required, minimum 6 characters)
   - Role (user, manager, or admin)
   - Account status (active/inactive)
3. Select permissions (role-based defaults are provided)
4. Click "Create User"

### 2. Managing Users

1. Navigate to `/users` to view all users
2. Use filters to search by username, email, role, or status
3. Click "Edit" to modify user details
4. Click "Delete" to remove users (with confirmation)

### 3. Customizing Permissions

1. When creating or editing a user, scroll to the "Permissions" section
2. Check/uncheck specific permissions as needed
3. Permissions are grouped by module for easy management
4. Role selection provides default permissions that can be customized

### 4. Authentication

1. Users can register at `/api/users/register`
2. Users can login at `/api/users/login`
3. JWT tokens are stored in localStorage
4. Tokens expire after 24 hours

## Security Features

### Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Passwords must be at least 6 characters
- Password confirmation is required

### JWT Authentication
- Tokens expire after 24 hours
- Tokens include user ID, username, and role
- Middleware validates tokens on protected routes

### Permission Validation
- Each protected endpoint checks for specific permissions
- Users can only access features they have permission for
- Role-based defaults with customization options

## API Examples

### Register a New User
```javascript
const response = await fetch('/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'newuser',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    permissions: ['beekeeper:read', 'hive:read']
  })
});
```

### Login
```javascript
const response = await fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});
const { token, user } = await response.json();
localStorage.setItem('token', token);
```

### Get All Users (with authentication)
```javascript
const response = await fetch('/api/users', {
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}` 
  }
});
const users = await response.json();
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Permission Denied Errors**
   - Check if user has required permissions
   - Verify JWT token is valid
   - Ensure token hasn't expired

3. **Password Hashing Issues**
   - Ensure bcryptjs is properly installed
   - Check salt rounds configuration

4. **Frontend Authentication Issues**
   - Clear localStorage and re-login
   - Check browser console for errors
   - Verify API endpoints are accessible

### Logs and Debugging

- Backend logs are printed to console
- Check browser developer tools for frontend errors
- Database queries can be logged by enabling MySQL query logging

## Production Considerations

1. **Security**
   - Use a strong JWT secret
   - Enable HTTPS
   - Implement rate limiting
   - Add input validation

2. **Performance**
   - Add database indexes
   - Implement caching
   - Use connection pooling

3. **Monitoring**
   - Add logging
   - Monitor failed login attempts
   - Track permission usage

4. **Backup**
   - Regular database backups
   - Version control for configuration
   - Document user management procedures 