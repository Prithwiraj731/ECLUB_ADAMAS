/**
 * E-Club Admin Backend Server
 * Handles admin authentication, events, and notices management
 */

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://prithwi1016_db_user:Kf5xM816Llk1oo3F@cluster0.ry88yis.mongodb.net/?appName=Cluster0';
const DB_NAME = 'eclub';

let db;

// Connect to MongoDB with retry logic
async function connectDB(retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🔄 Attempting MongoDB connection (attempt ${attempt}/${retries})...`);
            const client = new MongoClient(MONGODB_URI, {
                tls: true,
                tlsAllowInvalidCertificates: false,
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000,
                retryWrites: true,
                retryReads: true
            });
            await client.connect();
            db = client.db(DB_NAME);
            console.log('✅ Connected to MongoDB');
            return;
        } catch (error) {
            console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);
            if (attempt === retries) {
                console.error('❌ All connection attempts failed. Please check:');
                console.error('   1. Your internet connection');
                console.error('   2. MongoDB Atlas cluster status');
                console.error('   3. IP whitelist on MongoDB Atlas (add your current IP)');
                console.error('   4. Database credentials');
                process.exit(1);
            }
            // Wait before retrying
            console.log(`⏳ Waiting 3 seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve static files from parent directory

// ===== AUTH ROUTES =====

// Admin Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const admin = await db.collection('admins').findOne({ username, password });

        if (admin) {
            res.json({ success: true, message: 'Login successful', admin: { username: admin.username, role: admin.role } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ===== EVENTS ROUTES =====

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await db.collection('events').find({}).sort({ created_at: -1 }).toArray();
        res.json({ success: true, events });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create event
app.post('/api/events', async (req, res) => {
    try {
        const { title, description, date, location, image_url, is_featured } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Title and description required' });
        }

        const event = {
            title,
            description,
            date: date || '',
            location: location || '',
            image_url: image_url || '',
            is_featured: is_featured || false,
            created_at: new Date().toISOString()
        };

        const result = await db.collection('events').insertOne(event);
        res.json({ success: true, message: 'Event created', event: { ...event, _id: result.insertedId } });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
    try {
        const result = await db.collection('events').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount > 0) {
            res.json({ success: true, message: 'Event deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Event not found' });
        }
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ===== NOTICES ROUTES =====

// Get active notice
app.get('/api/notices/active', async (req, res) => {
    try {
        const notice = await db.collection('notices').findOne({ is_active: true });
        res.json({ success: true, notice });
    } catch (error) {
        console.error('Get notice error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all notices
app.get('/api/notices', async (req, res) => {
    try {
        const notices = await db.collection('notices').find({}).sort({ created_at: -1 }).toArray();
        res.json({ success: true, notices });
    } catch (error) {
        console.error('Get notices error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create notice
app.post('/api/notices', async (req, res) => {
    try {
        const { title, content, is_active } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content required' });
        }

        // If this notice is active, deactivate all others
        if (is_active) {
            await db.collection('notices').updateMany({}, { $set: { is_active: false } });
        }

        const notice = {
            title,
            content,
            is_active: is_active || false,
            created_at: new Date().toISOString()
        };

        const result = await db.collection('notices').insertOne(notice);
        res.json({ success: true, message: 'Notice created', notice: { ...notice, _id: result.insertedId } });
    } catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update notice (toggle active)
app.patch('/api/notices/:id', async (req, res) => {
    try {
        const { is_active } = req.body;

        // If setting active, deactivate all others first
        if (is_active) {
            await db.collection('notices').updateMany({}, { $set: { is_active: false } });
        }

        const result = await db.collection('notices').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { is_active } }
        );

        if (result.matchedCount > 0) {
            res.json({ success: true, message: 'Notice updated' });
        } else {
            res.status(404).json({ success: false, message: 'Notice not found' });
        }
    } catch (error) {
        console.error('Update notice error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete notice
app.delete('/api/notices/:id', async (req, res) => {
    try {
        const result = await db.collection('notices').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount > 0) {
            res.json({ success: true, message: 'Notice deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Notice not found' });
        }
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 E-Club Server running on http://localhost:${PORT}`);
        console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    });
});
