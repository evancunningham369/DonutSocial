import express from 'express';
const app = express();
import cors from 'cors';
import * as account_controller from './controllers/account-controller.js';
import * as user_controller from './controllers/user-controller.js';
import * as post_controller from './controllers/post-controller.js';

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//ACCOUNT ACTION ROUTES//

//create an account
app.post('/register', account_controller.register_account);

//login an account
app.post('/login', account_controller.login_account);

//get an account
app.get('/:userId', account_controller.get_account);

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

//get all user posts
app.get('/posts/:userId', post_controller.get_user_posts);

//get all posts from users that the current account is following
app.get('/followed-user-posts/:userId', post_controller.get_user_following_posts);

//get all liked posts by the current account
app.get('/liked-post/:userId', post_controller.get_user_liked_posts);

//get a post
app.get('/post/:postId', post_controller.get_post);

//update a post
app.patch('/post/:postId', post_controller.update_post);

//delete a post
app.delete('/post/:postId', post_controller.delete_post);

app.listen(3001, () => {
    console.log("Server has started on port 3001");
});