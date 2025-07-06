import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllBeekeepers, deleteBeekeeper } from "../services/api";

export default function BeekeeperList() {
  const [beekeepers, setBeekeepers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBeekeepers().then(setBeekeepers);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this beekeeper?")) {
      await deleteBeekeeper(id);
      setBeekeepers(beekeepers.filter(bk => bk.BeekeeperID !== id));
    }
  };

  return (
    <div className="beekeeper-list">
      <h2>🧑‍🌾 Beekeepers</h2>
      {beekeepers.map(bk => (
        <div key={bk.BeekeeperID} className="beekeeper-item">
          <NavLink to={`/beekeepers/${bk.BeekeeperID}/hives`} className="beekeeper-name">
            🧑‍🌾 {bk.Name}
          </NavLink>
          <div className="beekeeper-info">
            <div>📧 {bk.Email}</div>
            <div>📞 {bk.Phone}</div>
          </div>
          <div className="beekeeper-actions">
            <button onClick={() => navigate(`/beekeepers/${bk.BeekeeperID}/edit`)}>✏️ Edit</button>
            <button onClick={() => handleDelete(bk.BeekeeperID)} style={{marginLeft: "8px"}}>🗑️ Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}