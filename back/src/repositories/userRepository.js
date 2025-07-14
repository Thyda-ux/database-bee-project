import { pool } from "../utils/database.js";

// Get all users
export async function getAllUsers() {
  const [rows] = await pool.query(`
    SELECT 
      UserID,
      Username,
      Email,
      Role,
      IsActive,
      CreatedAt,
      LastLogin
    FROM Users
    ORDER BY CreatedAt DESC
  `);
  return rows;
}

// Get user by ID
export async function getUserById(id) {
  const [rows] = await pool.query(`
    SELECT 
      UserID,
      Username,
      Email,
      Role,
      IsActive,
      CreatedAt,
      LastLogin
    FROM Users 
    WHERE UserID = ?
  `, [id]);
  return rows[0];
}

// Get user by username
export async function getUserByUsername(username) {
  const [rows] = await pool.query(`
    SELECT 
      UserID,
      Username,
      Email,
      PasswordHash,
      Role,
      IsActive,
      CreatedAt,
      LastLogin
    FROM Users 
    WHERE Username = ?
  `, [username]);
  return rows[0];
}

// Get user by email
export async function getUserByEmail(email) {
  const [rows] = await pool.query(`
    SELECT 
      UserID,
      Username,
      Email,
      PasswordHash,
      Role,
      IsActive,
      CreatedAt,
      LastLogin
    FROM Users 
    WHERE Email = ?
  `, [email]);
  return rows[0];
}

// Create new user
export async function createUser(userData) {
  const { username, email, passwordHash, role, permissions } = userData;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Insert user
    const [userResult] = await connection.query(`
      INSERT INTO Users (Username, Email, PasswordHash, Role, IsActive, CreatedAt)
      VALUES (?, ?, ?, ?, 1, NOW())
    `, [username, email, passwordHash, role]);
    
    const userId = userResult.insertId;
    
    // Insert user permissions if provided
    if (permissions && permissions.length > 0) {
      const permissionValues = permissions.map(permission => [userId, permission]);
      await connection.query(`
        INSERT INTO UserPermissions (UserID, Permission)
        VALUES ?
      `, [permissionValues]);
    }
    
    await connection.commit();
    
    // Return the created user (without password)
    return getUserById(userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Update user
export async function updateUser(id, userData) {
  const { username, email, role, isActive, permissions } = userData;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Update user
    await connection.query(`
      UPDATE Users 
      SET Username = ?, Email = ?, Role = ?, IsActive = ?
      WHERE UserID = ?
    `, [username, email, role, isActive, id]);
    
    // Update permissions if provided
    if (permissions !== undefined) {
      // Delete existing permissions
      await connection.query(`
        DELETE FROM UserPermissions WHERE UserID = ?
      `, [id]);
      
      // Insert new permissions
      if (permissions.length > 0) {
        const permissionValues = permissions.map(permission => [id, permission]);
        await connection.query(`
          INSERT INTO UserPermissions (UserID, Permission)
          VALUES ?
        `, [permissionValues]);
      }
    }
    
    await connection.commit();
    
    return getUserById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Update user password
export async function updateUserPassword(id, passwordHash) {
  await pool.query(`
    UPDATE Users 
    SET PasswordHash = ?
    WHERE UserID = ?
  `, [passwordHash, id]);
}

// Delete user
export async function deleteUser(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Delete user permissions first
    await connection.query(`
      DELETE FROM UserPermissions WHERE UserID = ?
    `, [id]);
    
    // Delete user
    await connection.query(`
      DELETE FROM Users WHERE UserID = ?
    `, [id]);
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get user permissions
export async function getUserPermissions(userId) {
  const [rows] = await pool.query(`
    SELECT Permission 
    FROM UserPermissions 
    WHERE UserID = ?
  `, [userId]);
  return rows.map(row => row.Permission);
}

// Get all available permissions
export async function getAllPermissions() {
  const [rows] = await pool.query(`
    SELECT DISTINCT Permission 
    FROM UserPermissions 
    ORDER BY Permission
  `);
  return rows.map(row => row.Permission);
}

// Update last login
export async function updateLastLogin(userId) {
  await pool.query(`
    UPDATE Users 
    SET LastLogin = NOW()
    WHERE UserID = ?
  `, [userId]);
}

// Get users with their permissions
export async function getUsersWithPermissions() {
  const [rows] = await pool.query(`
    SELECT 
      u.UserID,
      u.Username,
      u.Email,
      u.Role,
      u.IsActive,
      u.CreatedAt,
      u.LastLogin,
      GROUP_CONCAT(up.Permission) as Permissions
    FROM Users u
    LEFT JOIN UserPermissions up ON u.UserID = up.UserID
    GROUP BY u.UserID
    ORDER BY u.CreatedAt DESC
  `);
  
  return rows.map(row => ({
    ...row,
    Permissions: row.Permissions ? row.Permissions.split(',') : []
  }));
}