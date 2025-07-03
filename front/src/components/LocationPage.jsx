import { useEffect, useState } from "react";
import { getAllHives } from "../services/api";

function extractBuilding(location) {
  // Extracts "Building X" from "Rooftop Y, Building X"
  const match = location.match(/Building\s+\w+/i);
  return match ? match[0] : "Other";
}

export default function LocationPage() {
  const [hives, setHives] = useState([]);
  useEffect(() => { getAllHives().then(setHives); }, []);

  // Group by building
  const grouped = hives.reduce((acc, hive) => {
    const building = extractBuilding(hive.Location);
    acc[building] = acc[building] || [];
    acc[building].push(hive);
    return acc;
  }, {});

  return (
    <div>
      <h2>Locations & Buildings</h2>
      {Object.entries(grouped).map(([building, hives]) => (
        <div key={building}>
          <h3>{building}</h3>
          {hives.map(hive => (
            <div key={hive.HiveID} className="card">
              <div><b>Location:</b> {hive.Location}</div>
              <div><b>Status:</b> {hive.Status}</div>
              <div><b>Beekeeper:</b> {hive.BeekeeperName}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}