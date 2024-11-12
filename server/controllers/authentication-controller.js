import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';
import passport from '../config/passport.js';

//API Handlers for authentication

// Register account in database
export const register_account = async(req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json('Username and password fields cannot be empty');
        }
        const saltRounds = 5;
        var hashPass = await bcrypt.hash(password, saltRounds);
        const newAccount = await pool.query(
            'INSERT INTO account (username, hashPass) VALUES($1, $2) RETURNING *',
             [username, hashPass]
             );
             const newUser = newAccount.rows[0];
        return res.status(200).json({username: newUser.username, userId: newUser.user_id});
    } catch (error) {
        if(error.constraint){
            return res.status(400).json({message: 'User with that name already exists!'});
        }
        return res.status(500).json({message: 'An unexpected error occured:'});
    }
}

// Register or Login google account
export const google_strategy = async(accessToken, refreshToken, profile, done) => {
    try {
        let user = await pool.query('SELECT * FROM account WHERE google_id = $1', [profile.id]);

        if (!user.rows.length) {
          user = await pool.query(
            'INSERT INTO account (google_id, username) VALUES ($1, $2) RETURNING *',
            [profile.id, profile.displayName]
          );
        }
        user = user.rows[0];
        user = {user_id: user.user_id, username: user.username};
        return done(null, user);
      } catch (err) {
        return done(err);
      }
}

// callback for google register/login
export const callback_google_account = async(req, res) => {
    if(!req.user){
        return res.status(400).json({error: 'User not retrieved'})
    }
    const user = JSON.stringify(req.user);
    res.redirect(`http://localhost:5173/home?user=${encodeURIComponent(user)}`);
}

// Verify account in database
export const login_account = async(username, password, done) => {
    try {
        const result = await pool.query('SELECT * FROM account WHERE username= $1', [username]);
        if(result.rowCount == 0){
            return done(null, false, {message: "Username does not exist!"})
        }
        const user = result.rows[0];
        
        const match = await bcrypt.compare(password, user.hashpass);
        if(!match){
            return done(null, false, {message: "Incorrect password!"})
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}

export const handleAuthentication = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            return res.status(500).json({ message: info.message });
        }

        if(!user){
            return res.status(401).json({ message: info.message })
        }

        req.logIn(user, (err) => {
            if(err){
                return res.status(500).json({message: 'Failed to log in user.' });
            }
            return res.status(200).json({username: user.username, userId: user.user_id});
        });

    })(req, res, next);
}

export const logout = async(req, res) => {
        req.logout(err => {
            if(err) return res.status(500).json({ message : 'Logout failed' });
    
            req.session.destroy();
            return res.redirect('http://localhost:5173');
        });
}