import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const baseRoutePaths = {
  barber: "/barber",
  costumer: "/costumer",
  admin: "/admin"
}
const {barber} = baseRoutePaths
export const apiRoutes = {
  barber:{
    appointmentAt: (barberId:number) => `${barber}/${barberId}/appointment`,
    shouAvailableTime: (barberId: number) => `${barber}/${barberId}/available-time`,
  }
}
export default api;
