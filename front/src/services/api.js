// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

export const getAllBeekeepers = async () => {
  const response = await axios.get(`${API_BASE_URL}/beekeepers`);
  return response.data;
};

export const createBeekeeper = async (beekeeper) => {
  const response = await axios.post(`${API_BASE_URL}/beekeepers`, beekeeper);
  return response.data;
};

export const getBeekeeperById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/beekeepers/${id}`);
  return response.data;
};

export const updateBeekeeper = async (id, beekeeper) => {
  const response = await axios.put(`${API_BASE_URL}/beekeepers/${id}`, beekeeper);
  return response.data;
};

export const deleteBeekeeper = async (id) => {
  await axios.delete(`${API_BASE_URL}/beekeepers/${id}`);
};

export const getHivesByBeekeeper = async (beekeeperId) => {
  const response = await axios.get(`${API_BASE_URL}/beekeepers/${beekeeperId}/hives`);
  return response.data;
};

export const getAllBeeSpecies = async () => (await axios.get(`${API_BASE_URL}/beespecies`)).data;
export const getHivesBySpecies = async (speciesId) => (await axios.get(`${API_BASE_URL}/hives/species/${speciesId}`)).data;
export const getAllHives = async () => (await axios.get(`${API_BASE_URL}/hives`)).data;
export const getAllEnvironmentData = async () => (await axios.get(`${API_BASE_URL}/environment`)).data;
export const getAllPlants = async () => (await axios.get(`${API_BASE_URL}/plants`)).data;
export const getAllHoneyProduction = async () => {
  const response = await axios.get(`${API_BASE_URL}/honey`);
  return response.data;
};
