import express from "express";
import { approveUser, dailySignups, dashboardStats, listPending, rejectUser } from "../controllers/admin.js";
import { allowRoles, protect } from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.get("/pending-users", protect, allowRoles("ADMIN"), listPending);
adminRouter.put("/approve-user/:id", protect, allowRoles("ADMIN"), approveUser);
adminRouter.put("/reject-user/:id", protect, allowRoles("ADMIN"), rejectUser);
adminRouter.get( "/dashboard-stats",protect,allowRoles("ADMIN"),dashboardStats);
adminRouter.get("/daily-signups", protect, allowRoles("ADMIN"), dailySignups);
export default adminRouter;