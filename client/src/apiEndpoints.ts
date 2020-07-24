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

// Program-specific (these requires /program/edition/ before)

const classCatalogEndpoint = "catalog/";

// studentreg
const studentRegEndpoint = "student/";
const studentRemoveClassesEndpoint = "student/classes/remove/";

const emergencyInfoEndpoint = "student/emergency_info/";
const medicalLiabilityEndpoint = "student/medliab/";
const liabilityWaiverEndpoint = "student/waiver/";
const studentAvailabilityEndpoint = "student/availability/";
const studentScheduleEndpoint = "student/schedule/";

export {
  loginEndpoint,
  tokenRefreshEndpoint,
  userDataEndpoint,
  studentSignupEndpoint,
  studentDashboardEndpoint,
  teacherDashboardEndpoint,
  classCatalogEndpoint,
  studentRegEndpoint,
  emergencyInfoEndpoint,
  studentProfileEndpoint,
  medicalLiabilityEndpoint,
  liabilityWaiverEndpoint,
  studentAvailabilityEndpoint,
  studentScheduleEndpoint,
  studentRemoveClassesEndpoint,
};
