const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./db");

const app = express();
const port = 3000;

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/bookings", require("./routes/bookingsRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  if (req.session.user) {
    console.log(`Logged in user: ${req.session.user.username}`);
    res.status(200).send(`Welcome ${req.session.user.username}`);
  } else {
    res.status(401).send("Please log in first");
  }
});

app.listen(port, () => console.log(`Node.js server started on port ${port}`));
