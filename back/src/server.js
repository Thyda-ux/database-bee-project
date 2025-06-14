import express from "express";
import cors from "cors";
import articleRouter from "./routes/articleRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/articles", articleRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
