import express from "express"

import { loginUser, registerUser,getUserById} from "../controller/usercontroller.js";

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get("/:userId",getUserById)

 export default userRouter;
