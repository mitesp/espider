// Accounts
const loginEndpoint = "/token/";
const tokenRefreshEndpoint = "/token/refresh/";
const userDataEndpoint = "/user/";
const studentSignupEndpoint = "/account/student/";

// Profile
const studentProfileEndpoint = "/profile/student/";

// Dashboards
const studentDashboardEndpoint = "/dashboard/student/";
const teacherDashboardEndpoint = "/dashboard/teacher/";

// studentreg (these requires /program/edition/ before)
const studentRegEndpoint = "student/";
const emergencyInfoEndpoint = "student/emergency_info/";
const medicalLiabilityEndpoint = "student/medliab/";
const liabilityWaiverEndpoint = "student/waiver/";
const studentAvailabilityEndpoint = "student/availability/";

export {
  loginEndpoint,
  tokenRefreshEndpoint,
  userDataEndpoint,
  studentSignupEndpoint,
  studentDashboardEndpoint,
  teacherDashboardEndpoint,
  studentRegEndpoint,
  emergencyInfoEndpoint,
  studentProfileEndpoint,
  medicalLiabilityEndpoint,
  liabilityWaiverEndpoint,
  studentAvailabilityEndpoint,
};
