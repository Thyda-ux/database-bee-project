let articles = [
  {
    id: "1",
    title: "React Basics",
    content: "Learn React",
    journalist: "Alice",
    category: "Frontend",
  },
  {
    id: "2",
    title: "Routing",
    content: "React Router",
    journalist: "Bob",
    category: "Frontend",
  },
];

// Helper to simulate async delay (optional)
function delay(ms = 100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get all articles
export async function getArticles() {
  await delay();
  return articles;
}

// Get one article by ID
export async function getArticleById(id) {
  await delay();
  return articles.find((a) => a.id === id) || null;
}

// Create a new article
export async function createArticle(article) {
  const { title, content, journalist, category } = article;
  try {
    const [result] = await pool.query(
      "INSERT INTO articles (title, content, journalist, category) VALUES (?, ?, ?, ?)",
      [title, content, journalist, category]
    );
    // Return the created article with its new ID
    return { id: result.insertId, title, content, journalist, category };
  } catch (error) {
    console.error("Database query failed:", error);
    throw error;
  }
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
  const { title, content, journalist, category } = updatedData;
  try {
    const [result] = await pool.query(
      "UPDATE articles SET title = ?, content = ?, journalist = ?, category = ? WHERE id = ?",
      [title, content, journalist, category, id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    // Return the updated article object
    return { id, title, content, journalist, category };
  } catch (error) {
    console.error("Database query failed:", error);
    throw error;
  }
}

// Delete an article by ID
export async function deleteArticle(id) {
  await delay();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return false;

  articles.splice(index, 1);
  return true;
}

// Component code (e.g., in a React component)
const ArticleComponent = ({ id }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchArticle = async () => {
    try {
      setLoading(true);

      const found = await getArticleById(id); // <-- Add await here
      if (found) {
        setArticle(found);
        setError("");
      } else {
        setArticle(null);
        setError("Article not found.");
      }
    } catch (err) {
      setError("Failed to fetch article.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return null;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <p>
        <strong>Journalist:</strong> {article.journalist}
      </p>
      <p>
        <strong>Category:</strong> {article.category}
      </p>
    </div>
  );
};

export default ArticleComponent;
