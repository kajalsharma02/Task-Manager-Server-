const express = require("express");
const router = express.Router();
const User = require("../schema/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

router.get("/", (req, res) => {
  res.send("login page");
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hash
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.json({
      email: user.email,
      token
    });
  } catch (err) {
    return new Error(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).send({ message: "User doesn't exist" });
    }

    const valPassword = bcrypt.compareSync(password, userExists.password); // Check if the password is valid
    if (!valPassword) {
      return res.status(400).send({ message: "Invalid Password" });
    }

    const token = jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET); // Generate JWT token

    res.json({
      name: userExists.name,
      email: userExists.email,
      token
    });
  } catch (err) {
    return new Error(err.message);
  }
});

// router.post("/updatePassword", async (req, res) => {
//   try {
//     const { name, email, password, newPassword } = req.body;
//     const userExists = await User.findOne({ email });
//     if (!userExists) {
//       return res.status(400).send("Email or password is wrong.");
//     }

//     const authHeader = req.headers["authorization"]; // Check if authorization header is present
//     if (!authHeader) {
//       return res.status(401).send("No token provided...");
//     }
//     const token = authHeader.split(" ")[1]; // Extract token from the header

//     const validPass = bcrypt.compareSync(password, userExists.password); // Verify password
//     if (!validPass) {
//       return res.status(400).send("Email or password is wrong.");
//     }

//     const verifyToken = jwt.verify(token, process.env.TOKEN_SECRET); // Verify the token
//     const userId = userExists._id.toString();

//     if (verifyToken._id !== userId) {
//       return res.status(401).send("Unauthorized");
//     }

//     const salt = bcrypt.genSaltSync(saltRounds);
//     const hash = bcrypt.hashSync(newPassword, salt);

//     await User.findOneAndUpdate(
//       { email: userExists.email },
//       { password: hash }
//     );
//     res.json({ message: "Password changed successfully." });
//   } catch (err) {
//     throw new Error(err.message);
//   }
// });
router.post("/updatePassword", async (req, res) => {
  console.log("server122");
  try {
    console.log("server1");
    const { name, email, password, newPassword } = req.body;
    const token = req.headers["authorization"];
    console.log(token);
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).send("email or password is wrong");
    }

    const validPass = bcrypt.compareSync(password, userExists.password);
    if (!validPass) {
      return res.status(400).send("email or password is wrong");
    }

    const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = userExists._id.toString();

    if (verifiedToken._id !== userId) {
      return res.status(401).send("Unauthorized");
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(newPassword, salt);
    await User.findOneAndUpdate(
      { email: userExists.email },
      { password: hash }
    );
    res.json({
      message: "Password updated successfully"
    });
  } catch (e) {
    throw new Error(e.message);
  }
});
module.exports = router;
