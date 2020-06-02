import Gender from './Gender';
import UserTypeModel from './UserType';
import BarberShop from './BarberShop';

export enum UserType {
  BARBER = 1,
  COSTUMER = 2,
}
export default interface User {
  id: string;
  userTypeId: UserType;
  companyId: number;
  userType: UserTypeModel;
  gender: Gender;
  address?: [];
  phones?: [];
  company: BarberShop;
  passwordHash?: string;
  perfilImageURL?: string;
  name: string;
  email: string;
}
