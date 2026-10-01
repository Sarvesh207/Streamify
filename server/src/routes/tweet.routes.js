import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    getTweetFeed,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";
import {
    optionalVerifyJWT,
    verifyJWT,
} from "../middlewares/auth.middelware.js";

const router = Router();

router.route("/").post(verifyJWT, createTweet);
router.route("/feed").get(verifyJWT, getTweetFeed);
// Channel community tabs are public
router.route("/user/:userId").get(optionalVerifyJWT, getUserTweets);
router
    .route("/:tweetId")
    .patch(verifyJWT, updateTweet)
    .delete(verifyJWT, deleteTweet);

export default router;
