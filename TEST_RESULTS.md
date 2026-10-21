# MANDATORY FUNCTIONAL TEST RESULTS (TC01 - TC10)

Examination Coverage: Academic Year 2026–2027 Semester 1  
Deadline Threshold: `2026-11-06 17:00:00 PHT` (`Asia/Manila`)

| Test ID | Scenario | Input Setup | Expected Result | Actual Result | Pass/Fail | Evidence Reference |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC01** | Valid boundary check | Record B01: Excellence, GWA 2.00, Units 18, Fail 0, INC 0, Drop 0. Submitted at deadline. | Compliant | Compliant | PASS | `EVID_TC01_B01_PASS` |
| **TC02** | GWA above limit | Record B02: Excellence, GWA 2.01, Units 18, Fail 0, INC 0, Drop 0. | With Deficiency | With Deficiency (GWA > 2.00) | PASS | `EVID_TC02_B02_PASS` |
| **TC03** | Program variation | Record B03: Access, GWA 2.50, Units 15, Fail 0, INC 0, Drop 1. | Compliant | Compliant (1 drop allowed) | PASS | `EVID_TC03_B03_PASS` |
| **TC04** | Multiple deficiencies | Record B04: Access, GWA 2.50, Units 14, Fail 0, INC 1, Drop 0. | With Deficiency | With Deficiency (Units & INC) | PASS | `EVID_TC04_B04_PASS` |
| **TC05** | Failure and lateness | Record B05: Excellence, GWA 1.75, Units 18, Fail 1, INC 0, Drop 0. Submitted +1 min. | With Deficiency | With Deficiency (Fail & Late) | PASS | `EVID_TC05_B05_PASS` |
| **TC06** | Verification gate | Record B06: Access, GWA 2.25. Verification status: Pending verification. | Block Evaluation | Evaluation Blocked | PASS | `EVID_TC06_B06_PASS` |
| **TC07** | Duplicate & invalid input | Attempt GWA 0.50 or duplicate AY 2026-2027 Semester 1 entry. | Form Validation Error | Validation Blocked | PASS | `EVID_TC07_PASS` |
| **TC08** | Role isolation | Scholar B01 attempts reading Scholar B02 records or triggering verification API. | HTTP 403 / RLS Deny | Access Denied | PASS | `EVID_TC08_PASS` |
| **TC09** | Persistence & correction | Return B01, edit document link, resubmit, refresh browser. | Pending Verification | Preserved State & Logged | PASS | `EVID_TC09_PASS` |
| **TC10** | Renewal authority | Staff approves compliant B01 and holds deficient B02. | Staff Control Enforced | Scholar Cannot Edit | PASS | `EVID_TC10_PASS` |
