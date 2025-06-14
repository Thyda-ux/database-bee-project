import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../services/api";

export default function ArticleForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    journalist_name: "",
    category_name: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createArticle(formData);
      navigate("/articles");
    } catch (err) {
      console.error("Failed to create article:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="journalist_name">Journalist Name:</label>
        <input
          type="text"
          id="journalist_name"
          name="journalist_name"
          value={formData.journalist_name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="category_name">Category:</label>
        <input
          type="text"
          id="category_name"
          name="category_name"
          value={formData.category_name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="button primary">Create Article</button>
    </form>
  );
}
