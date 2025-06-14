import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, getArticlesByJournalist } from "../services/api";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [journalistArticles, setJournalistArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleData = await getArticleById(id);
        setArticle(articleData);

        const articles = await getArticlesByJournalist(articleData.journalist_name);
        setJournalistArticles(articles.filter(a => a.id !== id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className="article-page">
      <div className="article-card">
        <div className="article-header">
          <h2 className="article-title">{article.title}</h2>
          <p className="journalist-byline">
            By{" "}
            <span
              className="journalist-link"
              onClick={() => navigate(`/journalist/${encodeURIComponent(article.journalist_name)}`)}
            >
              {article.journalist_name}
            </span>
          </p>
        </div>
        <div className="content">{article.content}</div>
        {article.category_name && (
          <div 
              className="category-tag" 
              onClick={() => navigate(`/category/${encodeURIComponent(article.category_name)}`)}
              style={{ cursor: 'pointer' }}
          >
              {article.category_name}
          </div>
        )}
      </div>

      {journalistArticles.length > 0 && (
        <div className="journalist-articles">
          <h3>Other articles by this journalist</h3>
          <div className="article-grid">
            {journalistArticles.map(article => (
              <div key={article.id} className="article-card">
                <h3>{article.title}</h3>
                <div className="content">{article.content}</div>
                <Link to={`/articles/${article.id}`} className="view-button">View</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
