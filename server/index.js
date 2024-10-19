import cors from 'cors';
import express from 'express';
const app = express();
import passport from './config/passport.js';
import session from 'express-session';

import * as authentication_controller from './controllers/authentication-controller.js'
import * as account_controller from './controllers/account-controller.js';
import * as user_controller from './controllers/user-controller.js';
import * as post_controller from './controllers/post-controller.js';

//middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

//ROUTES//

//ACCOUNT ACTION ROUTES//

//create an account
app.post('/register', authentication_controller.register_account);

//register a google account
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

//google authentication callback
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    authentication_controller.callback_google_account);

//login an account
app.post('/login', authentication_controller.login_account);

//get an account
app.get('/:userId', account_controller.get_account);

//upload account profile picture
app.post('/upload-profile-picture', account_controller.upload_profile_picture);

//get account profile picture
app.get('/profile-picture/:userId', account_controller.get_profile_picture);

//remove account profile picture
app.post('/delete-profile-picture/:userId', account_controller.delete_profile_picture);

app.get('/profile-info/:userId', account_controller.get_profile_info);

//ACCOUNT USER ACTION ROUTES

//follow user
app.patch('/follow-user/', user_controller.follow_user);

//unfollow user
app.patch('/unfollow-user/', user_controller.unfollow_user)

//like post
app.patch('/like-post/', user_controller.like_post);

//unlike post
app.patch('/unlike-post/', user_controller.unlike_post);

//ACCOUNT POST ROUTES//

//create a post
app.post('/post', post_controller.create_post);

//get a post
app.get('/post/:postId', post_controller.get_post);

//get all posts
app.get('/posts/all-posts', post_controller.get_all_posts);

//get all user posts
app.get('/posts/:userId', post_controller.get_user_posts);

//get all posts from users that the current account is following
app.get('/followed-user-posts/:userId', post_controller.get_user_following_posts);

//get all liked posts by the current account
app.get('/liked-posts/:userId', post_controller.get_user_liked_posts);

//get all liked posts by post_id by the current account
app.get('/liked-posts-id/:userId', post_controller.get_user_liked_posts_id);

//update a post
app.patch('/post/:postId', post_controller.update_post);

//delete a post
app.delete('/post/:postId', post_controller.delete_post);

// ACCOUNT CHECK ROUTES
app.post('/user-following/', account_controller.is_user_following);

app.listen(3001, () => {
    console.log("Server has started on port 3001");
});