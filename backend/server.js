require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const app =
  express();

app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://fund-insight-tracker.vercel.app"
    ],
    credentials: true
  }));

app.use(
  express.json()
);

app.get(
  "/",
  (req, res) => {
    res.send(
      "Supabase Backend Running"
    );
  }
);

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/watchlist",
  require("./routes/watchlistRoutes")
);

app.use(
  "/api/funds",
  require("./routes/fundRoutes")
);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});
const PORT =
  process.env.PORT ||
  5000;

app.listen(PORT, () =>
  console.log(
    `Server running on port ${PORT}`
  )
);