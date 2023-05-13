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
        const {content, userId} = req.body;
        
        console.log(req.body);

    } catch (error) {
        console.log(error.message);
    }
})

//get all posts

//get a post

//update a post

//delete a post

app.listen(3001, () => {
    console.log("Server has started on port 3001");
});