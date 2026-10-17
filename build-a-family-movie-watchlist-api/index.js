import express from "express";
import helmet from "helmet";

import watchlistRoutes from "./routes/watchlist.js";
import adminRoutes from "./routes/admin.js";

const PORT = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

app.use("/api/watchlist", watchlistRoutes);
app.use("/api/auth",adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
