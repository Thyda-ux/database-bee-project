import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";

import ArticleList from "./components/ArticleList";
import ArticleForm from "./components/ArticleForm";
import ArticlePage from "./components/ArticlePage";
import JournalistArticles from "./components/JournalistArticles";
import CategoryArticles from "./components/CategoryArticles";

function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Article App</h1>
      </header>

      <nav>
        <NavLink
          to="/articles"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          All Articles
        </NavLink>
        <NavLink
          to="/articles/add"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          + Add Article
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/articles" />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/journalist/:journalistName" element={<JournalistArticles />} />
        <Route path="/category/:categoryName" element={<CategoryArticles />} />
        <Route path="/articles/add" element={<ArticleForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
