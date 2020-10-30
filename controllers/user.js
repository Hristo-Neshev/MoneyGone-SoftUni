const User = require('../models/user');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const createToken = require('../utils/createToken');
const isLoggedIn = require('../utils/isLoggedIn');


async function getLogin(req, res) {
    const loggedIn = await isLoggedIn(req);
    if (loggedIn.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login', {
        title: 'Login'
    });
}

async function getRegister(req, res) {
    const loggedIn = await isLoggedIn(req);
    if (loggedIn.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('register', {
        title: 'Register'
    });
}

function getLogout(req, res) {
    res.clearCookie('x-auth-token');
    res.redirect('/');
}

async function postRegister(req, res) {
    const { username, password, rePassword, amount } = req.body;

    const isUser = await User.findOne({ username });

    if (isUser) {
        return res.render('register', { errorMessage: 'This email is already in use!' })
    }

    if (!username.match(/[a-zA-Z1-9]{3,}/) || username.length < 4) {
        return res.render('register', { errorMessage: 'The username should be at least 4 characters long and should consist only english letters and digits' })
    }

    if (!username || !password || !rePassword) {
        return res.render('register', { errorMessage: 'All fields are required!' });
    };
    if (password.length < 8) {
        return res.render('register', { errorMessage: 'Password length must be at least 8 characters long!' });
    }
    if (password != rePassword) {
        return res.render('register', { errorMessage: "Passwords must match!" });
    }


    bcrypt.genSalt(config.saltRounds, (err, salt) => {
        if (err) {
            return console.log(err);
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return console.log(err);
            }
            const newUser = new User({ username, password: hash, expenses: 0, amount: amount || 0 });
            newUser.save((err) => {
                if (err) {
                    return console.log(err);
                }
            });
        })
    });

    res.redirect('/login');


}

async function postLogin(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!username) {
        res.render('login', { errorMessage: 'Username is required!' });
        return;
    }
    if (!password) {
        res.render('login', { errorMessage: 'Password is required!' });
        return;
    }
    if (!user) {
        res.render('login', { errorMessage: 'Wrong username or password!' });
        return;
    }

    const validUser = await bcrypt.compare(password, user.password);

    if (!validUser) {
        res.render('login', { errorMessage: 'Wrong username or password!' });
        return;
    }

    const token = createToken(user._id);
    res.cookie('x-auth-token', token);
    res.redirect('/');

}

async function getProfile(req, res) {

    const loggedIn = await isLoggedIn(req);
    if (!loggedIn.loggedIn) {
        res.redirect('/');
        return;
    }


    let user = await User.findOne({ _id: loggedIn.userId }).lean();
    user.expenses = user.expenses.toFixed(2);
    
    res.render('profile', {
        title: 'Profile',
        ...user,
        loggedIn: loggedIn.loggedIn,
        username: loggedIn.username


    })
}

async function postRefill(req, res) {

    let user = await User.findOne({ _id: req.params.id }).lean();
    const { refill } = req.body;
    user.amount += Number(refill);

    await User.findOneAndUpdate({ _id: user._id }, user);

    res.redirect('/');
}





module.exports = { getLogin, getRegister, getLogout, postRegister, postLogin, getProfile, postRefill };