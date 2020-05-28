import Gender from './Gender';
import UserType from './UserType';
import BarberShop from './BarberShop';

export default interface User {
  id: string;
  userTypeId: number;
  companyId: number;
  userType: UserType;
  gender: Gender;
  address?: [];
  phones?: [];
  company: BarberShop;
  passwordHash?: string
  avatar_url?: string;
  name: string;
  email: string;
}
