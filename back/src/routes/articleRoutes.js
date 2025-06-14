import { Router } from "express";
import * as articleRepository from "../repositories/sqlArticleRepository.js";
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle, getArticlesByJournalist } from "../controllers/articleController.js";

const articleRouter = Router();

// Order matters - put specific routes before parameter routes
articleRouter.get("/journalist/:journalistName", getArticlesByJournalist);
articleRouter.get('/category/:categoryName', async (req, res) => {
    try {
        const articles = await articleRepository.getArticlesByCategory(req.params.categoryName);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching category articles:', error);
        res.status(500).json({ message: "Failed to fetch category articles" });
    }
});

// Generic CRUD routes
articleRouter.get("/", getAllArticles);
articleRouter.post("/", createArticle);
articleRouter.get("/:id", getArticleById);
articleRouter.put("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);

export default articleRouter;
