import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useParams
} from "react-router-dom";
import { useEffect, useState } from "react";
import BeekeeperList from "./components/BeekeeperList";
import BeekeeperForm from "./components/BeekeeperForm";
import BeekeeperHivesPage from "./components/BeekeeperHivesPage";
import { createBeekeeper, updateBeekeeper, getAllBeekeepers } from "./services/api";
import BeeSpeciesPage from "./components/BeeSpeciesPage";
import LocationPage from "./components/LocationPage";
import EnvironmentPage from "./components/EnvironmentPage";
import PlantsPage from "./components/PlantsPage";
import HoneyProductionPage from "./components/HoneyProductionPage";

function AddBeekeeperPage() {
  const navigate = useNavigate();
  const handleAddBeekeeper = async (data) => {
    await createBeekeeper(data);
    navigate("/beekeepers");
  };
  return <BeekeeperForm onSubmit={handleAddBeekeeper} />;
}

function EditBeekeeperPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    getAllBeekeepers().then(beeks => {
      const found = beeks.find(bk => String(bk.BeekeeperID) === String(id));
      setInitialData(found);
    });
  }, [id]);

  const handleUpdate = async (data) => {
    await updateBeekeeper(id, data);
    navigate("/beekeepers");
  };

  if (!initialData) return <div>Loading...</div>;

  return <BeekeeperForm initialData={initialData} onSubmit={handleUpdate} />;
}

function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Smart Beekeeper Database</h1>
      </header>
      <nav>
        <NavLink to="/beekeepers" className="nav-item">
          Beekeepers
        </NavLink>
        <NavLink to="/beekeepers/add" className="nav-item">
          + Add Beekeeper
        </NavLink>
        <NavLink to="/species" className="nav-item">
          Bee Species
        </NavLink>
        <NavLink to="/locations" className="nav-item">
          Locations
        </NavLink>
        <NavLink to="/environment" className="nav-item">
          Environment
        </NavLink>
        <NavLink to="/plants" className="nav-item">
          Plants
        </NavLink>
        <NavLink to="/honey" className="nav-item">
          Honey Production
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/beekeepers" />} />
        <Route path="/beekeepers" element={<BeekeeperList />} />
        <Route path="/beekeepers/add" element={<AddBeekeeperPage />} />
        <Route path="/beekeepers/:id/hives" element={<BeekeeperHivesPage />} />
        <Route path="/beekeepers/:id/edit" element={<EditBeekeeperPage />} />
        <Route path="/species" element={<BeeSpeciesPage />} />
        <Route path="/locations" element={<LocationPage />} />
        <Route path="/environment" element={<EnvironmentPage />} />
        <Route path="/plants" element={<PlantsPage />} />
        <Route path="/honey" element={<HoneyProductionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
