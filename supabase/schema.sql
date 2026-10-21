-- SAD Laboratory Examination Section B - Schema & RLS Setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Scholar', 'Staff')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCHOLARSHIP PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS public.scholarship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_code VARCHAR(50) UNIQUE NOT NULL,
    program_name VARCHAR(100) NOT NULL,
    max_gwa NUMERIC(3,2) NOT NULL,
    min_units INT NOT NULL,
    max_failed INT NOT NULL,
    max_inc INT NOT NULL,
    max_dropped INT NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL
);

-- 3. SCHOLAR ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.scholar_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholar_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.scholarship_programs(id),
    academic_year VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_scholar_academic_year UNIQUE (scholar_id, academic_year)
);

-- 4. SEMESTER SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.semester_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholar_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    gwa NUMERIC(3,2) NOT NULL CHECK (gwa BETWEEN 1.00 AND 5.00),
    enrolled_units INT NOT NULL CHECK (enrolled_units >= 0),
    failed_count INT NOT NULL CHECK (failed_count >= 0),
    inc_count INT NOT NULL CHECK (inc_count >= 0),
    dropped_count INT NOT NULL CHECK (dropped_count >= 0),
    evidence_reference TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verification_status VARCHAR(30) DEFAULT 'Pending verification' 
        CHECK (verification_status IN ('Pending verification', 'Verified', 'Returned')),
    verification_notes TEXT,
    compliance_status VARCHAR(30) DEFAULT 'Pending' 
        CHECK (compliance_status IN ('Pending', 'Compliant', 'With Deficiency')),
    deficiency_reasons JSONB DEFAULT '[]'::jsonb,
    renewal_decision VARCHAR(20) DEFAULT 'Pending' 
        CHECK (renewal_decision IN ('Pending', 'Approved', 'Held')),
    decision_notes TEXT,
    CONSTRAINT unique_scholar_semester UNIQUE (scholar_id, academic_year, semester)
);

-- 5. EVALUATION AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.evaluation_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES public.semester_submissions(id) ON DELETE CASCADE,
    performed_by UUID NOT NULL REFERENCES public.profiles(id),
    action_type VARCHAR(50) NOT NULL,
    previous_state TEXT,
    new_state TEXT,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semester_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Staff Check Function
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Staff'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES FOR SEMESTER SUBMISSIONS
DROP POLICY IF EXISTS "Scholars can view own submissions" ON public.semester_submissions;
CREATE POLICY "Scholars can view own submissions" 
ON public.semester_submissions FOR SELECT 
USING (auth.uid() = scholar_id OR public.is_staff());

DROP POLICY IF EXISTS "Scholars can insert own submissions" ON public.semester_submissions;
CREATE POLICY "Scholars can insert own submissions" 
ON public.semester_submissions FOR INSERT 
WITH CHECK (auth.uid() = scholar_id);

DROP POLICY IF EXISTS "Scholars can update own returned submissions" ON public.semester_submissions;
CREATE POLICY "Scholars can update own returned submissions" 
ON public.semester_submissions FOR UPDATE 
USING (
    auth.uid() = scholar_id AND verification_status = 'Returned'
) 
WITH CHECK (
    auth.uid() = scholar_id AND verification_status = 'Pending verification'
);

DROP POLICY IF EXISTS "Staff can update any submission" ON public.semester_submissions;
CREATE POLICY "Staff can update any submission" 
ON public.semester_submissions FOR UPDATE 
USING (public.is_staff());
