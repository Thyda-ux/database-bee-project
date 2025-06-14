//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//
import { pool } from "../utils/database.js";

export async function getAllArticles() {
    const query = `
        SELECT 
            id,
            title,
            content,
            journalist_name,
            category_name
        FROM article
        ORDER BY id DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
}

export async function createArticle(article) {
    const query = `
        INSERT INTO article 
        (title, content, journalist_name, category_name) 
        VALUES (?, ?, ?, ?)
    `;
    const { title, content, journalist_name, category_name } = article;
    const [result] = await pool.query(query, [title, content, journalist_name, category_name]);
    return { id: result.insertId, ...article };
}

export async function getArticleById(id) {
    const query = `
        SELECT 
            id,
            title,
            content,
            journalist_name,
            category_name
        FROM article 
        WHERE id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
}

export async function updateArticle(id, updatedData) {
    const query = "UPDATE article SET title = ?, content = ?, journalist_id = ?, category_id = ? WHERE id = ?";
    const { title, content, journalist_id, category_id } = updatedData;
    await pool.query(query, [title, content, journalist_id, category_id, id]);
    return { id, ...updatedData };
}

export async function deleteArticle(id) {
    const query = "DELETE FROM article WHERE id = ?";
    await pool.query(query, [id]); 
    return { id };
}

export async function getArticlesByJournalist(journalistName) {
    const query = `
        SELECT 
            id,
            title,
            content,
            journalist_name,
            category_name
        FROM article 
        WHERE journalist_name = ?
        ORDER BY id DESC
    `;
    const [rows] = await pool.query(query, [journalistName]);
    return rows;
}

export async function getArticlesByCategory(categoryName) {
    const query = `
        SELECT 
            id,
            title,
            content,
            journalist_name,
            category_name
        FROM article 
        WHERE category_name = ?
        ORDER BY id DESC
    `;
    const [rows] = await pool.query(query, [categoryName]);
    return rows;
}
