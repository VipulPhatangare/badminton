const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { connectDB } = require("./database/db");

const session = require("express-session");
const MongoStore = require("connect-mongo"); // <-- import MongoStore

connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware with MongoDB
app.use(session({
  secret: process.env.session_secret_key,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, // from .env
    collectionName: "sessions",       // collection name in DB
    ttl: 5 * 24 * 60 * 60             // 5 days (in seconds)
  }),
  cookie: {
    secure: false, // set true if using HTTPS
    maxAge: 5 * 24 * 60 * 60 * 1000   // 5 days (in ms)
  }
}));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.redirect("/player");
  } else {
    res.render("index");
  }
});

app.get('/refree',(req, res)=>{
  res.render('refree');
});

app.get('/scorecard',(req, res)=>{
  res.render('scorecard');
});

app.get("/player", (req, res) => {
  res.render("player");
});

app.get("/dashboard", (req, res)=>{
  res.render("dashboard");
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const signupDataRoutes = require("./routes/signupData");
app.use("/signupData", signupDataRoutes);

const playerRoutes = require("./routes/playerroute");
app.use("/player", playerRoutes);

const registerRoutes = require("./routes/registrationroute");
app.use("/register", registerRoutes);

const dashboardRoutes = require("./routes/dashboardroute");
app.use("/dashboard", dashboardRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
