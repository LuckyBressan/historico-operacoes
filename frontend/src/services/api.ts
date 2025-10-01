import axios from "axios";

const api = axios.create({
    baseURL: `http://127.0.0.1:${import.meta.env.VITE_PORT_BACKEND}/`,

})
export default api;
