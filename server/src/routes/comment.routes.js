import { Router } from "express";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";
import {
    optionalVerifyJWT,
    verifyJWT,
} from "../middlewares/auth.middelware.js";

const router = Router();

// Guests can read comments; writing requires login
router
    .route("/:videoId")
    .get(optionalVerifyJWT, getVideoComments)
    .post(verifyJWT, addComment);
router
    .route("/c/:commentId")
    .delete(verifyJWT, deleteComment)
    .patch(verifyJWT, updateComment);

export default router;
