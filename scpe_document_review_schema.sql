-- PostgreSQL Database Schema for SCPE Document Review System

-- =========================================
-- 1. Ministries Table
-- =========================================
CREATE TABLE ministries (
    ministry_id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 2. Users Table (Authentication & Roles)
-- =========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Admin', 'Reviewer', 'MinistryUser')),
    ministry_id INT REFERENCES ministries(ministry_id),
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- =========================================
-- 3. Documents Table
-- =========================================
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    ministry_id INT REFERENCES ministries(ministry_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Report', 'Script')),
    file_path TEXT NOT NULL,
    submitted_by INT REFERENCES users(user_id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Submitted' CHECK (
        status IN ('Submitted', 'Under Review', 'Accepted', 'Denied', 'Revised')
    ),
    reviewed_by INT REFERENCES users(user_id),
    reviewed_at TIMESTAMP,
    last_feedback TEXT
);

-- =========================================
-- 4. Reviews Table
-- =========================================
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    document_id INT REFERENCES documents(document_id) ON DELETE CASCADE,
    reviewer_id INT REFERENCES users(user_id),
    quality_score INT CHECK (quality_score BETWEEN 1 AND 10),
    comments TEXT,
    decision VARCHAR(50) CHECK (decision IN ('Accepted', 'Under Review', 'Denied')),
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 5. Feedback Table
-- =========================================
CREATE TABLE feedback (
    feedback_id SERIAL PRIMARY KEY,
    document_id INT REFERENCES documents(document_id) ON DELETE CASCADE,
    reviewer_id INT REFERENCES users(user_id),
    feedback_text TEXT,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_required BOOLEAN DEFAULT FALSE
);

-- =========================================
-- 6. Revisions Table
-- =========================================
CREATE TABLE revisions (
    revision_id SERIAL PRIMARY KEY,
    document_id INT REFERENCES documents(document_id) ON DELETE CASCADE,
    old_version_path TEXT,
    new_version_path TEXT,
    revised_by INT REFERENCES users(user_id),
    revised_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- =========================================
-- 7. Activity Logs Table
-- =========================================
CREATE TABLE activity_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    action VARCHAR(100),
    document_id INT REFERENCES documents(document_id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- =========================================
-- 8. Notifications Table
-- =========================================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 9. Dashboard Summary View
-- =========================================
CREATE VIEW dashboard_summary AS
SELECT
    COUNT(*) AS total_submissions,
    COUNT(*) FILTER (WHERE status = 'Under Review') AS under_review,
    COUNT(*) FILTER (WHERE status = 'Accepted') AS accepted,
    COUNT(*) FILTER (WHERE status = 'Denied') AS denied
FROM documents;

-- End of Schema File
