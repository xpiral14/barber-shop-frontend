import Address from "./Address";
import Phone from "./Phone";

export default interface BarberShop{
    id: number;
    fantyasyName: string;
    logo: string;
    cnpj: string;
    email:string;
    passwordHash?:string;
    addresses?:Address,
    companyPhones: Phone;
    
}