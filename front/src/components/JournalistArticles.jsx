import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticlesByJournalist } from "../services/api";

export default function JournalistArticles() {
    const { journalistName } = useParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const data = await getArticlesByJournalist(journalistName);
                setArticles(data);
                setError("");
            } catch (err) {
                console.error(err);
                setError("Failed to load articles");
            } finally {
                setLoading(false);
            }
        };

        if (journalistName) {
            fetchArticles();
        }
    }, [journalistName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!articles.length) return <div>No articles found for {journalistName}</div>;

    return (
        <div className="journalist-page">
            <h2 className="journalist-title">{journalistName}</h2>
            <div className="article-grid">
                {articles.map((article) => (
                    <div key={article.id} className="article-card">
                        <div className="article-header">
                            <h3 className="article-title">{article.title}</h3>
                            <p className="journalist-byline">
                                By <span className="journalist-name">{journalistName}</span>
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