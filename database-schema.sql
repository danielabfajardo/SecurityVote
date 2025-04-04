-- Create tables for SecureGov AI

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Whistleblower reports
CREATE TABLE whistleblower_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  agency TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('unverified', 'investigating', 'verified', 'rejected')),
  is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
  submitter_email TEXT,
  submitter_name TEXT,
  submitter_phone TEXT,
  submitter_organization TEXT,
  evidence_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget transactions
CREATE TABLE budget_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  agency TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('approved', 'flagged', 'rejected')),
  risk TEXT NOT NULL CHECK (risk IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approval requests
CREATE TABLE approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  agency TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  approvals JSONB NOT NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fraud alerts
CREATE TABLE fraud_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  agency TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('high', 'medium', 'low')),
  pattern TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public reports
CREATE TABLE public_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('financial', 'audit', 'sustainability')),
  agency TEXT NOT NULL,
  format TEXT NOT NULL,
  size TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE whistleblower_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_reports ENABLE ROW LEVEL SECURITY;

-- Admin can see everything
CREATE POLICY admin_all_access ON users 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all_access ON whistleblower_reports 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all_access ON budget_transactions 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all_access ON approval_requests 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all_access ON fraud_alerts 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all_access ON public_reports 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Users can only see public reports
CREATE POLICY user_read_public ON public_reports 
  FOR SELECT USING (true);

-- Users can submit whistleblower reports
CREATE POLICY user_insert_reports ON whistleblower_reports 
  FOR INSERT WITH CHECK (true);

-- Users can view their own reports by tracking ID
CREATE POLICY user_read_own_reports ON whistleblower_reports 
  FOR SELECT USING (
    (is_anonymous = true) OR 
    (submitter_email = auth.jwt() ->> 'email')
  );

-- Insert sample data
INSERT INTO users (email, name, role) VALUES
('admin@securegovai.org', 'Admin User', 'admin'),
('user@example.com', 'Regular User', 'user');

-- Sample whistleblower reports
INSERT INTO whistleblower_reports (title, description, category, agency, status, is_anonymous) VALUES
('Suspicious contract award', 'Contract awarded to company with ties to agency director without proper bidding process', 'contract', 'Border Patrol', 'investigating', true),
('Ghost workers on payroll', 'Multiple employees receiving salary but not working', 'payroll', 'Cyber Defense', 'investigating', true),
('Inflated equipment prices', 'Equipment purchased at 3x market value', 'procurement', 'Intelligence', 'verified', true),
('Misappropriation of funds', 'Funds allocated for training diverted to personal accounts', 'funds', 'Police Force', 'unverified', true),
('Bribery for contract', 'Vendor paid bribe to secure communication equipment contract', 'bribery', 'Emergency Response', 'investigating', true);

-- Sample budget transactions
INSERT INTO budget_transactions (description, date, amount, agency, status, risk) VALUES
('Border Security Equipment', '2023-09-15', 1250000, 'Border Patrol', 'approved', 'low'),
('Cybersecurity Training Program', '2023-09-12', 750000, 'Cyber Defense', 'approved', 'low'),
('Intelligence Software Licenses', '2023-09-10', 2100000, 'Intelligence', 'flagged', 'high'),
('Vehicle Fleet Maintenance', '2023-09-08', 450000, 'Police Force', 'approved', 'low'),
('Communication Equipment', '2023-09-05', 1800000, 'Emergency Response', 'flagged', 'medium');

-- Sample approval requests with JSON approvals
INSERT INTO approval_requests (description, date, amount, agency, status, approvals) VALUES
('Border Security Equipment', '2023-09-15', 1250000, 'Border Patrol', 'pending', 
 '[{"role": "Auditor", "status": "approved", "name": "John Adebayo"}, 
   {"role": "Anti-Corruption", "status": "pending", "name": "Sarah Okafor"}, 
   {"role": "AI Verification", "status": "approved", "name": "SecureGov AI"}]'),
('Cybersecurity Training Program', '2023-09-12', 750000, 'Cyber Defense', 'pending', 
 '[{"role": "Auditor", "status": "approved", "name": "John Adebayo"}, 
   {"role": "Anti-Corruption", "status": "approved", "name": "Sarah Okafor"}, 
   {"role": "AI Verification", "status": "pending", "name": "SecureGov AI"}]'),
('Intelligence Software Licenses', '2023-09-10', 2100000, 'Intelligence', 'rejected', 
 '[{"role": "Auditor", "status": "approved", "name": "John Adebayo"}, 
   {"role": "Anti-Corruption", "status": "approved", "name": "Sarah Okafor"}, 
   {"role": "AI Verification", "status": "rejected", "name": "SecureGov AI"}]');

-- Sample fraud alerts
INSERT INTO fraud_alerts (description, date, amount, agency, risk_score, status, pattern) VALUES
('Duplicate payment detected', '2023-09-15', 1250000, 'Border Patrol', 85, 'high', 'duplicate'),
('Unusual payment amount', '2023-09-12', 750000, 'Cyber Defense', 65, 'medium', 'unusual'),
('Inflated contract pricing', '2023-09-10', 2100000, 'Intelligence', 92, 'high', 'inflated'),
('Potential ghost project', '2023-09-08', 450000, 'Police Force', 78, 'high', 'ghost'),
('Vendor with political connections', '2023-09-05', 1800000, 'Emergency Response', 60, 'medium', 'political');

-- Sample public reports
INSERT INTO public_reports (title, date, type, agency, format, size, file_url) VALUES
('Security Budget Quarterly Report', '2023-09-30', 'financial', 'All Agencies', 'PDF', '2.4 MB', 'https://example.com/reports/budget-q3-2023.pdf'),
('Security Budget Quarterly Report', '2023-06-30', 'financial', 'All Agencies', 'PDF', '2.1 MB', 'https://example.com/reports/budget-q2-2023.pdf'),
('Security Budget Quarterly Report', '2023-03-31', 'financial', 'All Agencies', 'PDF', '2.3 MB', 'https://example.com/reports/budget-q1-2023.pdf'),
('Annual Audit Report', '2023-01-15', 'audit', 'All Agencies', 'PDF', '4.7 MB', 'https://example.com/reports/audit-2023.pdf'),
('Sustainability Impact Report', '2023-02-28', 'sustainability', 'All Agencies', 'PDF', '3.2 MB', 'https://example.com/reports/sustainability-2023.pdf');

