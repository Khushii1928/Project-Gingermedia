import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:3000", 
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));

const dbURI = "mongodb://localhost:27017/myLoginRegisterDB";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("DB connected");
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: String, 
  dob: String, 
  contact: String, 
});

const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
  res.send("Welcome to the login and register backend");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      if (password === user.password) {
        
        console.log("Login Successful for user:", user);
        return res.send({ message: "Login Successful", user: user });
      } else {
        
        console.log("Password didn't match for user:", user);
        return res.send({ message: "Password didn't match" });
      }
    } else {
      
      console.log("User not registered with email:", email);
      return res.send({ message: "User not registered" });
    }
  } catch (err) {
    
    console.error("Error during login:", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});


app.post("/register", async (req, res) => {
  const { name, email, password, age, dob, contact } = req.body; // Extract age, dob, and contact from req.body

  console.log("Received registration request:", name, email);

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      console.log("User already registered:", existingUser);
      return res.send({ message: "User already registered" });
    }

    const newUser = new User({
      name,
      email,
      password,
      age,
      dob,
      contact,
    });

    await newUser.save();

    console.log("User successfully registered:", newUser);
    return res.send({ message: "Successfully Registered, Please login now." });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).send({ message: "Registration failed" });
  }
});

app.put("/updateUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { age, dob, contact } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found for update:", userId);
      return res.status(404).send({ message: "User not found" });
    }

    user.age = age;
    user.dob = dob;
    user.contact = contact;

    await user.save();

    console.log("User details updated successfully:", user);
    return res.send({ message: "User details updated successfully", user });
  } catch (err) {
    console.error("Error updating user details:", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});


app.listen(9002, () => {
  console.log("BE started at port 9002");
});
