import { useEffect, useState } from "react";
import { getAllHoneyProduction } from "../services/api";

export default function HoneyProductionPage() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => { getAllHoneyProduction().then(setRecords); }, []);

  const filtered = records.filter(r =>
    String(r.HiveID).includes(query) ||
    (r.Location && r.Location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <h2>Honey Production</h2>
      <input
        type="text"
        placeholder="Search by Hive or Location..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="bee-species-input"
        style={{ marginBottom: "1em" }}
      />
      {filtered.map(rec => (
        <div key={rec.RecordID} className="card">
          <div><b>Hive:</b> {rec.HiveID}</div>
          <div><b>Location:</b> {rec.Location}</div>
          <div><b>Harvest Date:</b> {rec.HarvestDate}</div>
          <div><b>Weight:</b> {rec.WeightKG} kg</div>
        </div>
      ))}
    </div>
  );
}