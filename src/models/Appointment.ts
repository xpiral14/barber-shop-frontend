import User from './User';

export default interface Appointment {
  id: number;
  companyId: number;
  serviceId: number;
  barberId: number;
  costumerId: number;
  appointmentAt: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
  barber: User;
  costumer: User;
}
