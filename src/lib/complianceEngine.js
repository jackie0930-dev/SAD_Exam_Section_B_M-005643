/**
 * Core Policy Engine for SAD Scholarship Monitoring System
 * Handles academic compliance checks against dynamic program thresholds.
 */

export const PROGRAM_POLICIES = {
  EXCELLENCE: {
    code: 'EXCELLENCE',
    name: 'Excellence Scholar',
    maxGwa: 2.00,
    minUnits: 18,
    maxFailed: 0,
    maxInc: 0,
    maxDropped: 0,
    deadlineISO: '2026-11-06T17:00:00+08:00'
  },
  ACCESS: {
    code: 'ACCESS',
    name: 'Access Scholar',
    maxGwa: 2.50,
    minUnits: 15,
    maxFailed: 0,
    maxInc: 0,
    maxDropped: 1,
    deadlineISO: '2026-11-06T17:00:00+08:00'
  }
};

/**
 * Evaluates academic submission against program policy rules.
 * @param {Object} submission 
 * @param {Object} policy 
 * @returns {Object} { status: 'Compliant'|'With Deficiency', reasons: Array<string> }
 */
export function evaluateCompliance(submission, policy) {
  const reasons = [];

  if (!submission || !policy) {
    return {
      status: 'With Deficiency',
      reasons: ['Invalid submission or missing program policy threshold record.']
    };
  }

  // Verification Gate Check
  if (submission.verification_status !== 'Verified') {
    return {
      status: 'Pending',
      reasons: ['Submission evidence is not verified yet.']
    };
  }

  // 1. GWA Check (1.00 best, 5.00 fail -> GWA <= maxGwa)
  const gwa = parseFloat(submission.gwa);
  if (isNaN(gwa) || gwa > policy.maxGwa) {
    reasons.push(`GWA of ${submission.gwa} exceeds program maximum allowed limit of ${policy.maxGwa.toFixed(2)}.`);
  }

  // 2. Minimum Enrolled Units
  const units = parseInt(submission.enrolled_units, 10);
  if (isNaN(units) || units < policy.minUnits) {
    reasons.push(`Enrolled units (${submission.enrolled_units}) is below required minimum of ${policy.minUnits}.`);
  }

  // 3. Failed Subjects
  const failed = parseInt(submission.failed_count, 10);
  if (isNaN(failed) || failed > policy.maxFailed) {
    reasons.push(`Failed subjects count (${submission.failed_count}) exceeds allowed limit of ${policy.maxFailed}.`);
  }

  // 4. Incomplete Grades
  const inc = parseInt(submission.inc_count, 10);
  if (isNaN(inc) || inc > policy.maxInc) {
    reasons.push(`Incomplete subjects (${submission.inc_count}) exceeds allowed limit of ${policy.maxInc}.`);
  }

  // 5. Dropped Subjects
  const dropped = parseInt(submission.dropped_count, 10);
  if (isNaN(dropped) || dropped > policy.maxDropped) {
    reasons.push(`Dropped subjects (${submission.dropped_count}) exceeds allowed limit of ${policy.maxDropped}.`);
  }

  // 6. Deadline Timestamp Check (Asia/Manila time)
  const submittedAt = new Date(submission.submitted_at);
  const deadline = new Date(policy.deadlineISO);

  if (submittedAt > deadline) {
    reasons.push(`Submission timestamp is after deadline (2026-11-06 17:00 PHT).`);
  }

  const isCompliant = reasons.length === 0;

  return {
    status: isCompliant ? 'Compliant' : 'With Deficiency',
    reasons: reasons
  };
}

export function validateSubmissionInputs(formData, existingSubmissions = [], currentScholarId) {
  const errors = [];

  const gwa = parseFloat(formData.gwa);
  if (isNaN(gwa) || gwa < 1.00 || gwa > 5.00) {
    errors.push("Valid GWA input must be between 1.00 and 5.00 inclusive.");
  }

  const units = parseInt(formData.enrolled_units, 10);
  if (isNaN(units) || units < 0) {
    errors.push("Enrolled units must be a non-negative integer.");
  }

  const failed = parseInt(formData.failed_count, 10);
  if (isNaN(failed) || failed < 0) {
    errors.push("Failed subjects count must be a non-negative integer.");
  }

  const inc = parseInt(formData.inc_count, 10);
  if (isNaN(inc) || inc < 0) {
    errors.push("Incomplete count must be a non-negative integer.");
  }

  const dropped = parseInt(formData.dropped_count, 10);
  if (isNaN(dropped) || dropped < 0) {
    errors.push("Dropped count must be a non-negative integer.");
  }

  if (!formData.evidence_reference || !formData.evidence_reference.trim()) {
    errors.push("Grade document reference URL or proof link is required.");
  }

  // Duplicate Check
  const isDuplicate = existingSubmissions.some(s => 
    s.scholar_id === currentScholarId &&
    s.academic_year === formData.academic_year &&
    s.semester === formData.semester &&
    s.id !== formData.id
  );

  if (isDuplicate) {
    errors.push(`A record for ${formData.academic_year} ${formData.semester} already exists for this scholar.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
