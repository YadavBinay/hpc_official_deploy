const userRouterV1 = require("./routes/userRouteV1.js");
const childRouterV1 = require("./routes/childRouteV1.js");
// const imageRouterV1 = require("./routes/imageRouteV1");
const appointmentRouterV1 = require("./routes/appointmentRouteV1.js");
const doctorRouterV1 = require("./routes/doctorRouteV1.js");
const documentRouterV1 = require("./routes/documentRouterV1.js");
const paymentRouterV1 = require("./routes/paymentRouteV1.js");
const subscriptionRouterV1 = require("./routes/subscriptionRouterV1.js");
const messageRouterV1 = require("./routes/messageRouteV1.js");
// const reportRouterV1 = require("./routes/reportRoute");

const otpRouteV1 = require("./routes/otpRouteV1.js");
const {
  checkForAuthenticationToken,
} = require("./middlewares/authentication.js");

function configureRoutes(app) {
  // User routes (authentication not needed for signup/login)
  app.use("/api/v1/user", userRouterV1);
  app.use("/api/v1/otp", otpRouteV1);

  // Protected routes
  app.use("/api/v1/child", checkForAuthenticationToken(), childRouterV1);
  // app.use("/api/v1/image", checkForAuthenticationToken(), imageRouterV1);
  app.use(
    "/api/v1/appointment",
    checkForAuthenticationToken(),
    appointmentRouterV1
  );
  app.use("/api/v1/doctor", doctorRouterV1); // Note: Assuming this doesn't require auth, adjust as needed
  app.use("/api/v1/document", checkForAuthenticationToken(), documentRouterV1);
  app.use("/api/v1/payment", checkForAuthenticationToken(), paymentRouterV1);
  app.use(
    "/api/v1/subscription",
    checkForAuthenticationToken(),
    subscriptionRouterV1
  );
  // app.use("/api/v1/report", checkForAuthenticationToken(), reportRouterV1);
  app.use("/api/v1/chat", checkForAuthenticationToken(), messageRouterV1);
}

module.exports = configureRoutes;
