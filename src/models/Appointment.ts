import User from './User';
import Service from './Service';

export default interface Appointment {
  id: number;
  companyId: number;
  serviceId: number;
  barberId: number;
  costumerId: number;
  date: string;
  time: number;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
  barber: User;
  service: Service;
  costumer: User;
  dateTime: Date;
  hourFormatted?:string
}
