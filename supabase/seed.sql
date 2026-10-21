-- Seed Data for SAD Examination Section B
INSERT INTO public.scholarship_programs 
(id, program_code, program_name, max_gwa, min_units, max_failed, max_inc, max_dropped, submission_deadline) 
VALUES
('a0000000-0000-0000-0000-000000000001', 'EXCELLENCE', 'Excellence Scholar', 2.00, 18, 0, 0, 0, '2026-11-06 17:00:00+08'),
('a0000000-0000-0000-0000-000000000002', 'ACCESS', 'Access Scholar', 2.50, 15, 0, 0, 1, '2026-11-06 17:00:00+08')
ON CONFLICT (program_code) DO NOTHING;

-- PROFILES
INSERT INTO public.profiles (id, student_id, full_name, email, role) VALUES
('11111111-1111-1111-1111-111111111111', 'STAFF01', 'Scholarship Admin Staff', 'staff@university.edu.ph', 'Staff'),
('22222222-2222-2222-2222-222222222201', 'B01', 'Juan Dela Cruz', 'b01@scholar.edu.ph', 'Scholar'),
('22222222-2222-2222-2222-222222222202', 'B02', 'Maria Clara', 'b02@scholar.edu.ph', 'Scholar'),
('22222222-2222-2222-2222-222222222203', 'B03', 'Crisostomo Ibarra', 'b03@scholar.edu.ph', 'Scholar'),
('22222222-2222-2222-2222-222222222204', 'B04', 'Elias Salome', 'b04@scholar.edu.ph', 'Scholar'),
('22222222-2222-2222-2222-222222222205', 'B05', 'Sisa Basilio', 'b05@scholar.edu.ph', 'Scholar'),
('22222222-2222-2222-2222-222222222206', 'B06', 'Jose Rizal', 'b06@scholar.edu.ph', 'Scholar')
ON CONFLICT (student_id) DO NOTHING;

-- SCHOLAR PROGRAM ASSIGNMENTS
INSERT INTO public.scholar_assignments (scholar_id, program_id, academic_year) VALUES
('22222222-2222-2222-2222-222222222201', 'a0000000-0000-0000-0000-000000000001', '2026-2027'),
('22222222-2222-2222-2222-222222222202', 'a0000000-0000-0000-0000-000000000001', '2026-2027'),
('22222222-2222-2222-2222-222222222203', 'a0000000-0000-0000-0000-000000000002', '2026-2027'),
('22222222-2222-2222-2222-222222222204', 'a0000000-0000-0000-0000-000000000002', '2026-2027'),
('22222222-2222-2222-2222-222222222205', 'a0000000-0000-0000-0000-000000000001', '2026-2027'),
('22222222-2222-2222-2222-222222222206', 'a0000000-0000-0000-0000-000000000002', '2026-2027')
ON CONFLICT DO NOTHING;

-- SEMESTER SUBMISSIONS (AY 2026-2027 Semester 1)
INSERT INTO public.semester_submissions 
(id, scholar_id, academic_year, semester, gwa, enrolled_units, failed_count, inc_count, dropped_count, evidence_reference, submitted_at, verification_status, compliance_status, deficiency_reasons, renewal_decision) VALUES
('c0000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222201', '2026-2027', 'Semester 1', 2.00, 18, 0, 0, 0, 'https://drive.google.com/grades/b01.pdf', '2026-11-06 17:00:00+08', 'Verified', 'Compliant', '[]'::jsonb, 'Approved'),
('c0000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222202', '2026-2027', 'Semester 1', 2.01, 18, 0, 0, 0, 'https://drive.google.com/grades/b02.pdf', '2026-11-05 10:00:00+08', 'Verified', 'With Deficiency', '["GWA of 2.01 exceeds program maximum allowed limit of 2.00."]'::jsonb, 'Held'),
('c0000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222203', '2026-2027', 'Semester 1', 2.50, 15, 0, 0, 1, 'https://drive.google.com/grades/b03.pdf', '2026-11-05 10:00:00+08', 'Verified', 'Compliant', '[]'::jsonb, 'Approved'),
('c0000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222204', '2026-2027', 'Semester 1', 2.50, 14, 0, 1, 0, 'https://drive.google.com/grades/b04.pdf', '2026-11-05 10:00:00+08', 'Verified', 'With Deficiency', '["Enrolled units (14) is below required minimum of 15.", "Incomplete subjects (1) exceeds allowed limit of 0."]'::jsonb, 'Held'),
('c0000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222205', '2026-2027', 'Semester 1', 1.75, 18, 1, 0, 0, 'https://drive.google.com/grades/b05.pdf', '2026-11-06 17:01:00+08', 'Verified', 'With Deficiency', '["Failed subjects count (1) exceeds allowed limit of 0.", "Submission timestamp is after deadline (2026-11-06 17:00 PHT)."]'::jsonb, 'Held'),
('c0000000-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222206', '2026-2027', 'Semester 1', 2.25, 15, 0, 0, 0, 'https://drive.google.com/grades/b06.pdf', '2026-11-05 10:00:00+08', 'Pending verification', 'Pending', '[]'::jsonb, 'Pending')
ON CONFLICT (scholar_id, academic_year, semester) DO NOTHING;
