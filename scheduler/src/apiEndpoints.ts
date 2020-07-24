// Accounts
export const loginEndpoint = "/token/";
export const tokenRefreshEndpoint = "/token/refresh/";

// Program-specific (these requires /program/edition/ before)
export const timeslotEndpoint = "timeslots/";
export const classroomEndpoint = "classrooms/";
export const sectionsEndpoint = "sections/";

// scheduling endpoints (followed by section id)
export const scheduleSectionEndpoint = "schedule";
export const unscheduleSectionEndpoint = "unschedule";
