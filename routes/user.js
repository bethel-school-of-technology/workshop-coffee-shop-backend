const express = require('express')
const router = express.Router()
const User = require('../models/user')
const authService = require("../services/auth");

async function getUser(req, res, next) {
  let user = null

  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(400).json({ message: 'Cant find user' })
    }
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }

  res.user = user
  next()
}

function getToken(req) {
  console.log("getToken function called")
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
  }

  return (token) ? token : null
}
// GET ALL USERS
router.get('/', async (req, res) => {
  console.log("Get All Users function called")
  let token = getToken(req)

  if (token) {
    let user = await authService.verifyUser(token);
    if (user) {
      try {
        const users = await User.find()
        res.json(users)
      } catch (err) {
        res.status(400).json({ message: err.message })
      }
    } else {
      res.status(404).json({ message: "Page Not Found" })
    }
  }
  else {
    res.status(404).json({ message: "Page Not Found" })
  }
})

router.get('/profile', async (req, res) => {
  console.log("Get Profile function called")

  let token = getToken(req)

  if (token) {
    let user = await authService.verifyUser(token)
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ msg: "Page Not Found" })
    }
  } else {
    res.status(404).json({ msg: "Page Not Found" })
  }

})

// GET SINGLE USER
router.get('/:id', getUser, async (req, res) => {
  console.log("Get Single User function called")

  let token = getToken(req)

  if (token) {
    let user = await authService.verifyUser(token)
    if (user) {
      let foundUser = await User.findById(req.params.id)
      res.json(foundUser);
    } else {
      res.status(404).json({ msg: "Page Not Found" })
    }
  } else {
    res.status(404).json({ msg: "Page Not Found" })
  }
})

// CREATE A USER
router.post('/add', async (req, res) => {
  console.log("Add User function called")

  let token = getToken(req)

  if (token) {
    let user = await authService.verifyUser(token)
    if (user) {
      let username = req.body.username
      let password = req.body.password
      let admin = (req.body.admin) ? req.body.admin : false

      if (username == '') {
        res.send(400).json({ msg: "Username is required." })
        return
      }

      if (password == '') {
        res.send(400).json({ msg: "Password is required." })
        return
      }

      password = authService.hashPassword(password)

      let user = new User({
        username: username,
        password: password,
        admin: admin,
      })

      try {
        const newUser = await user.save()
        res.staus(200).json(newUser)
      } catch (err) {
        res.status(400).json({ message: err.message })
      }
    } else {
      res.status(404).json({ message: "Page Not Found" })
    }
  } else {
    res.status(404).json({ message: "Page Not Found" })
  }

})

//UPDATE A USER
router.put('/:id', getUser, async (req, res) => {
  console.log("Update User function called")

  let token = getToken(req)

  if (token) {
    let user = authService.verifyUser(token)
    if (user) {
      if (req.body.username != null) {
        res.user.username = req.body.username
      }

      if (req.body.password != null) {
        res.user.password = authService.hashPassword(req.body.password);
      }

      if (req.body.admin != null) {
        res.user.admin = req.body.admin
      }

      console.log(req.body)

      try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
      } catch {
        res.status(400).json({ message: err.message })
      }
    } else {
      res.status(404).json({ message: "Page Not Found" })
    }

  } else {
    res.status(404).json({ message: "Page Not Found" })
  }

})

router.post('/login', async function (req, res) {
  console.log("Login function called")

  let user = await User.findOne({ username: req.body.username })

  if (!user) {
    console.log('User not found')
    return res.json({
      status: 400,
      message: "Login Failed"
    });
  }

  let passwordMatch = authService.comparePasswords(req.body.password, user.password);
  if (passwordMatch) {
    let token = authService.signUser(user);
    res.json({ 
      token,
      status: 200,
     })
  } else {
    console.log('Wrong password');
    res.send('Wrong password');
  }
})

router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'Deleted This User' })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})


module.exports = router