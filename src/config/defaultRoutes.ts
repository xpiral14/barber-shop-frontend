import { UserType } from "../models/User";

const baseUserRoute = {
  [UserType.BARBER.toString()]: '/barber/dashboard',
  [UserType.COSTUMER.toString()]: '/costumer/dashboard',
};
export default baseUserRoute;
