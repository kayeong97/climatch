// In a real application, this would be a backend service.
// For this demo, we're simulating bcrypt functionality in the frontend.
// Note: In a production app, NEVER do password hashing in the frontend.
// This is purely for demonstration purposes.

// Simulate bcrypt hash function (this is NOT real bcrypt!)
const simulateBcryptHash = async (password, saltRounds = 10) => {
  // This is a very simplified hash function for demo only!
  // It does NOT provide any security and should NEVER be used in production.
  // In a real app, the backend would handle password hashing with bcrypt.
  
  // Create a simple "salt"
  const salt = Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 36).toString(36)
  ).join('');
  
  // Combine password and salt, then convert to base64
  const combined = password + salt;
  const hash = btoa(combined); // Simplified "hash" using base64 encoding
  
  // Format to look like a bcrypt hash (for visual purposes only)
  return `$2b$${saltRounds}$${salt}${hash}`;
};

// Simulate bcrypt compare function
const simulateBcryptCompare = async (password, hash) => {
  // Extract the salt from the hash (this is a simplified approach)
  const parts = hash.split('$');
  if (parts.length !== 4) return false;
  
  const salt = parts[3].substring(0, 16);
  const storedHash = parts[3].substring(16);
  
  // Combine password and extracted salt, then convert to base64
  const combined = password + salt;
  const compareHash = btoa(combined);
  
  // Compare the computed hash with the stored hash
  return compareHash === storedHash;
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    // In a real app, we would send this data to a backend API
    const { password, ...otherData } = userData;
    
    // Simulate bcrypt hashing
    const hashedPassword = await simulateBcryptHash(password);
    
    // Store in localStorage for demo purposes
    // In a real app, this would be stored in a database on the server
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (existingUsers.some(u => u.userId === userData.userId)) {
      throw new Error('이미 존재하는 아이디입니다.');
    }
    
    const newUser = {
      ...otherData,
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    return { success: true, user: { ...otherData } };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (userId, password) => {
  try {
    // In a real app, we would send this data to a backend API
    
    // Get users from localStorage for demo purposes
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.userId === userId);
    
    if (!user) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    
    // Compare passwords
    const isPasswordValid = await simulateBcryptCompare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    
    // Generate a dummy token
    const token = btoa(`${userId}:${Date.now()}`);
    
    // Extract user data without password hash
    const { passwordHash, ...userData } = user;
    
    return { 
      success: true, 
      user: userData, 
      token 
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser
}; 