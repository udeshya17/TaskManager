const AuthService = require("../services/auth.service");
const AuthServiceInstance = new AuthService();

const postSignup = async (req, res) => {
  try {
    const newUser = await AuthServiceInstance.create(req.body);

    // Generate JWT token for the newly created user
    const token = AuthServiceInstance.generateToken({ userId: newUser._id });

    // Send response with user data and token
    res.status(201).send({
      ...newUser.toObject(),   // Spread the user object (converts mongoose document to plain object)
      token: token,           
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const postLogin = async (req, res) => {
  try {
    const { isLoggedIn, userId, username } = await AuthServiceInstance.login(req.body);
    if (!isLoggedIn)
      return res.status(401).send({ message: "Invalid credentials" });

    res
      .status(200)
      .cookie(
        "remember_user_token",
        AuthServiceInstance.generateToken({ userId }),
        {
          httpOnly: true,
          maxAge: 20 * 1000,
        }
      )
      .send({ 
        isLoggedIn, 
        userId,
        username,
      });
  } catch (error) {
    if (error.message === "User not found")
      return res.status(401).send({ message: error.message });
    res.status(500).send({ message: error.message });
  }
};



module.exports = { postSignup, postLogin};