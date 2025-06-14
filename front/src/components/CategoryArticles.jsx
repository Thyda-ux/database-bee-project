import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticlesByCategory } from "../services/api";

export default function CategoryArticles() {
    const { categoryName } = useParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const data = await getArticlesByCategory(categoryName);
                setArticles(data);
                setError("");
            } catch (err) {
                console.error(err);
                setError("Failed to load articles");
            } finally {
                setLoading(false);
            }
        };

        if (categoryName) {
            fetchArticles();
        }
    }, [categoryName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!articles.length) return <div>No articles found in {categoryName}</div>;

    return (
        <div className="category-page">
            <h2 className="category-title">{categoryName}</h2>
            <div className="article-grid">
                {articles.map((article) => (
                    <div key={article.id} className="article-card">
                        <div className="article-header">
                            <h3 className="article-title">{article.title}</h3>
                            <p className="journalist-byline">
                                By <span className="journalist-name">{article.journalist_name}</span>
                            </p>
                        </div>
                        <Link to={`/articles/${article.id}`} className="view-button">
                            View
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}