import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllArticles } from "../services/api";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleJournalistClick = (journalistName) => {
    navigate(`/journalist/${encodeURIComponent(journalistName)}`);
  };

  return (
    <div className="article-grid">
      {articles.map((article) => (
        <div key={article.id} className="article-card">
          <div className="article-header">
            <h3 className="article-title">{article.title}</h3>
            <p className="journalist-byline">
              By{" "}
              <span
                className="journalist-link"
                onClick={() => handleJournalistClick(article.journalist_name)}
              >
                {article.journalist_name}
              </span>
            </p>
          </div>
          <div className="content">{article.content}</div>
          <Link to={`/articles/${article.id}`} className="view-button">
            View
          </Link>
        </div>
      ))}
    </div>
  );
}
