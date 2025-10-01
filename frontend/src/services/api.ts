import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:${import.meta.env.VITE_PORT_BACKEND}/`,
})
export default api;
