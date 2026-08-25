const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabase, isMock, mockStore } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'adamas_eclub_secure_jwt_secret_key_2026';

// Admin Login Handler
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // 1. Direct Environment Fallback Check (e.g. admin / admin123 or from server/.env)
    const envAdminUser = process.env.ADMIN_USERNAME || 'admin';
    const envAdminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const isEnvMatch =
      username.toLowerCase() === envAdminUser.toLowerCase() &&
      password === envAdminPass;

    if (isMock) {
      const admin = mockStore.admins.find(
        (a) => a.username.toLowerCase() === username.toLowerCase()
      );

      if (isEnvMatch || (admin && (admin.password === password || password === 'admin123'))) {
        const token = jwt.sign(
          { id: admin ? admin.id : 'env_admin', username: username, role: 'superadmin' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          admin: { username: username, role: 'superadmin' }
        });
      }

      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // 2. Live Supabase Query (from 'admins' table)
    let adminRecord = null;
    try {
      const { data: dbAdmin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .single();

      if (!error && dbAdmin) {
        adminRecord = dbAdmin;
      }
    } catch (dbErr) {
      console.warn('Could not query admins table from database:', dbErr.message);
    }

    let passwordMatch = false;

    if (adminRecord && adminRecord.password_hash) {
      if (adminRecord.password_hash.startsWith('$2a$') || adminRecord.password_hash.startsWith('$2b$')) {
        passwordMatch = await bcrypt.compare(password, adminRecord.password_hash);
      } else {
        passwordMatch = adminRecord.password_hash === password;
      }
    }

    // Accept if DB password matched OR environment fallback credentials matched
    if (!passwordMatch && !isEnvMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const adminId = adminRecord ? adminRecord.id : 'admin_super';
    const adminRole = adminRecord ? adminRecord.role : 'superadmin';

    const token = jwt.sign(
      { id: adminId, username: username, role: adminRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { username: username, role: adminRole }
    });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ success: false, message: 'Internal server authentication error.' });
  }
};

// Verify Token Handler
exports.verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is expired or invalid.' });
  }
};
