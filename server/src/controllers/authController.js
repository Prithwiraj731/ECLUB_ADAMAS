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

    if (isMock) {
      const admin = mockStore.admins.find(
        (a) => a.username.toLowerCase() === username.toLowerCase() && a.password === password
      );

      if (admin) {
        const token = jwt.sign(
          { id: admin.id, username: admin.username, role: admin.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          message: 'Login successful (Mock Session)',
          token,
          admin: { username: admin.username, role: admin.role }
        });
      }

      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // Live Supabase query
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    // Compare bcrypt password or plain text match fallback
    let passwordMatch = false;
    if (admin.password_hash.startsWith('$2a$') || admin.password_hash.startsWith('$2b$')) {
      passwordMatch = await bcrypt.compare(password, admin.password_hash);
    } else {
      passwordMatch = admin.password_hash === password;
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { username: admin.username, role: admin.role }
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
