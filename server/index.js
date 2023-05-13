import express from 'express';
const app = express();
import bcrypt from 'bcrypt';
import cors from 'cors';
import { pool } from './db.js';

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//ACCOUNT USER ROUTES//

//create a user
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const saltRounds = 5;
        var hashPass = await bcrypt.hash(password, saltRounds);
        const newAccount = await pool.query(
            'INSERT INTO account (username, hashPass) VALUES($1, $2) RETURNING username',
             [username, hashPass]
             );

        res.json(newAccount);
    } catch (error) {
        error.constraint != undefined && res.json("User with that name already exists!");
    }
})
//validate user login
app.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM account WHERE username= $1', [username]);
        if(result.rowCount == 0){
            throw new Error("Incorrect username!")
        }
        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.hashpass);
        if(!match){
            throw new Error("Incorrect password!");
        }
        res.json(user);
    } catch (error) {
        res.json(error.message);    
    }
})

//ACCOUNT POST ROUTES//

//create a post

app.post('/post', async (req, res) => {
    try {
        const dateTime = new Date(Date.now()).toISOString();
        const {content, userId} = req.body;
        const post = await pool.query(
            'INSERT INTO post(content, post_datetime, user_id) VALUES($1, $2, (SELECT user_id FROM account WHERE user_id=$3)) RETURNING *',
            [content, dateTime, userId]
            );
        res.json(post.rows);
    } catch (error) {
        console.log(error.message);
    }
});

//get all user posts
app.get('/posts/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const allPosts = await pool.query('SELECT * FROM post WHERE user_id=$1', [userId]);
        res.json(allPosts.rows);
    } catch (error) {
        res.json(error.message);
    }
});
//get a post
app.get('/post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await pool.query('SELECT * FROM post WHERE post_id=$1', [postId]);
        res.json(post.rows);
    } catch (error) {
        req.json(error.message)
    }
});
//update a post
app.patch('/post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const updatedPost = await pool.query('UPDATE post SET content=$1 WHERE post_id=$2 RETURNING *', [content, postId]);
        res.json(updatedPost.rows);
    } catch (error) {
        res.json(error.message);
    }
});
//delete a post
app.delete('/post/:postId', async(req, res) => {
    try {
        const { postId } = req.params;
        const deletedPost = await pool.query('DELETE FROM post WHERE post_id=$1', [postId]);
        res.json(deletedPost.rows);
    } catch (error) {
        res.json(error.message);
    }
});
app.listen(3001, () => {
    console.log("Server has started on port 3001");
});