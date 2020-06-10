import React, { useState, useEffect, useMemo } from 'react';
import { isAfter, parseISO, isBefore } from 'date-fns';
import 'react-day-picker/lib/style.css';

import { Container, Content, Schedule, Section, Appointment } from './styles';

import { useAuth } from '../../../hooks/auth';
import api from '../../../services/api';
import AppointmentModel from '../../../models/Appointment';
import { addMinutes, subDays, addDays } from 'date-fns/esm';
import { ptBR } from 'date-fns/locale';
import { useToast } from '../../../hooks/toast';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import getTimeZone from '../../../utils/getTimeZone';
import { utcToZonedTime } from 'date-fns-tz/esm';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [appointments, setAppointments] = useState<AppointmentModel[] | null>(
    null,
  );
  useEffect(() => {
    async function getAppointments() {
      try {
        const appointments = await api.get<AppointmentModel[]>(
          `/costumer/${user.id}/appointment`,
          {
            params: {
              from: format(subDays(new Date(), 7), 'yyyy-MM-dd', {
                timeZone: getTimeZone(),
              }),
              // froms: format(new Date(), 'yyyy-MM-dd'),
              to: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
            },
          },
        );
        console.log(appointments.data);
        setAppointments(appointments.data);
      } catch (error) {
        if (error?.response?.data) {
          error.response.data.forEach((err: string) => {
            toast.addToast({
              title: 'Erro',
              description: err,
              type: 'error',
            });
          });
        }
      }
    }
    getAppointments();
  }, [user.id, toast]);
  const appointmentsFormatted = useMemo(() => {
    return appointments?.map((appointment) => {
      let dateTime = addMinutes(
        parseISO(appointment.date),
        appointment.time + 180,
      );

      return {
        ...appointment,
        dateTime,
        formattedDate: format(dateTime, "dd 'de' MMMM ', às' hh:mm'h'", {
          locale: ptBR,
        }),
      };
    });
  }, [appointments]);

  const nextAppointment = useMemo(
    () =>
      appointmentsFormatted?.find((appointment) =>
        isAfter(appointment.dateTime, new Date()),
      ),
    [appointmentsFormatted],
  );

  const sectionAppointment = useMemo(() => {
    return {
      nextAppointments: appointmentsFormatted?.filter(
        (appointment) =>
          isAfter(appointment.dateTime, new Date()) &&
          nextAppointment?.id !== appointment.id,
      ),
      previousAppointments: appointmentsFormatted?.filter((appointment) =>
        isBefore(appointment.dateTime, new Date()),
      ),
    };
  }, [appointmentsFormatted, nextAppointment]);
  return (
    <Container>
      <Content>
        <Schedule>
          <h1>Horários marcados</h1>
          {nextAppointment !== undefined && (
            <Section>
              <strong>Próximo encontro</strong>
              <Appointment>
                <span>{nextAppointment.formattedDate}</span>

                <div>
                  <img src={nextAppointment.barber.perfilImageURL} alt="" />
                  <strong>{nextAppointment.barber.name}</strong>
                  <span>{nextAppointment.service.name}</span>
                </div>
              </Appointment>
            </Section>
          )}
          {sectionAppointment.nextAppointments?.length && (
            <Section>
              <strong>Próximo horários marcados</strong>

              {sectionAppointment?.nextAppointments.map((appointment) => (
                <Appointment>
                  <span>{appointment.formattedDate}</span>

                  <div>
                    <img src={appointment.barber.perfilImageURL} alt="" />
                    <strong>{appointment.barber.name}</strong>
                    <span>{appointment.service.name}</span>
                  </div>
                </Appointment>
              ))}
            </Section>
          )}
          {sectionAppointment.previousAppointments?.length && (
            <Section>
              <strong>Os últimos horários marcados</strong>

              {sectionAppointment.previousAppointments.map((appointment) => (
                <Appointment>
                  <span>{appointment.formattedDate}</span>

                  <div>
                    <img src={appointment.barber.perfilImageURL} alt="" />
                    <strong>{appointment.barber.name}</strong>
                    <span>{appointment.service.name}</span>
                  </div>
                </Appointment>
              ))}
            </Section>
          )}
        </Schedule>
      </Content>
    </Container>
  );
};

export default Dashboard;
