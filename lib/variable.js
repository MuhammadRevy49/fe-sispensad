export const variable = {
  login: "/api/users/login",
  users: "/api/users",
  getMe: "/api/users/getMe",
  register: "/api/users/register",
  otp: "/api/otp",
  otpVerify: "/api/otp/check",
  updatePassword: "/api/users/",
  totalSoldier: "/api/soldier/count",
  historyYear: "/api/history/soldier",
  history: "/api/history",
  userId: (id) => `/api/users/${id}`
};