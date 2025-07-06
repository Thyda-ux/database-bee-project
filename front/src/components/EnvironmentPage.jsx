import { useEffect, useState } from "react";
import { getAllEnvironmentData } from "../services/api";

export default function EnvironmentPage() {
  const [data, setData] = useState([]);
  useEffect(() => { getAllEnvironmentData().then(setData); }, []);

  return (
    <div>
      <h2>🌤️ Environment Data</h2>
      {data.map(row => (
        <div key={row.DataID} className="card">
          <div>🏠 <b>Hive:</b> {row.HiveID}</div>
          <div>📅 <b>Date:</b> {row.Date}</div>
          <div>🌡️ <b>Temperature:</b> {row.Temperature}°C</div>
          <div>💧 <b>Humidity:</b> {row.Humidity}%</div>
        </div>
      ))}
    </div>
  );
}