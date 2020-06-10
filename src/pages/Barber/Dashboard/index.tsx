import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  isToday,
  format,
  parseISO,
  isAfter,
  addMinutes,
  addDays,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock } from 'react-icons/fi';
import {
  Container,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
} from './styles';

import Calendar from '../../../components/Calendar';
import { useAuth } from '../../../hooks/auth';
import api from '../../../services/api';
import AppointmentModel from '../../../models/Appointment';
import { useToast } from '../../../hooks/toast';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);

  const { user } = useAuth();
  const toast = useToast();
  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  useEffect(() => {
    async function getAppointments() {
      const { data } = await api.get<AppointmentModel[]>(
        `/barber/${user.id}/appointment`,
        {
          params: {
            date: format(selectedDate, 'yyyy-MM-dd'),
          },
        },
      );

      const appointmentsFormatted = data.map((appointment) => {
        let dateTime = addMinutes(parseISO(appointment.date), appointment.time + 180);
        return {
          ...appointment,
          dateTime,
          hourFormatted: format(dateTime, 'HH:mm'),
        };
      });

      setAppointments(appointmentsFormatted);
    }
    try {
      getAppointments();
    } catch (error) {
      error?.response?.data.forEach((err: string) => {
        toast.addToast({
          title: 'Erro',
          type: 'error',
          description: err,
        });
      });
    }
  }, [selectedDate, user.id, toast]);

  const selectedDateAsText = useMemo(() => {
    return {
      day: format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR }),
      week: format(selectedDate, 'cccc', { locale: ptBR }),
    };
  }, [selectedDate]);

  const sectionAppointments = useMemo(() => {
    return {
      morning: appointments.filter((appointment) => {
        return appointment.dateTime?.getHours() < 12;
      }),
      afternoon: appointments.filter((appointment) => {
        return appointment.dateTime.getHours() >= 12;
      }),
    };
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) =>
      isAfter(appointment.dateTime, new Date()),
    );
  }, [appointments]);

  return (
    <Container>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText.day}</span>
            <span>{selectedDateAsText.week}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.costumer.perfilImageURL || ''}
                  alt={nextAppointment.costumer.name}
                />

                <strong>{nextAppointment.costumer.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {!sectionAppointments.morning.length ? (
              <p>Nenhum agendamento neste período</p>
            ) : (
              sectionAppointments.morning.map((appointment) => {
                return (
                  <Appointment key={appointment.id}>
                    <span>
                      <FiClock />
                      {appointment.hourFormatted}
                    </span>

                    <div>
                      <div>
                        <img
                          src={appointment.costumer.perfilImageURL || ''}
                          alt={appointment.costumer.name}
                        />

                        <strong>{appointment.costumer.name}</strong>
                      </div>
                      <strong>{appointment.service.name}</strong>
                    </div>
                  </Appointment>
                );
              })
            )}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {sectionAppointments.afternoon.length === 0 ? (
              <p>Nenhum agendamento neste período</p>
            ) : (
              sectionAppointments.afternoon.map((appointment) => {
                return (
                  <Appointment key={appointment.id}>
                    <span>
                      <FiClock />
                      {appointment.hourFormatted}
                    </span>

                    <div>
                      <img
                        src={appointment.costumer.perfilImageURL}
                        alt={appointment.costumer.name}
                      />

                      <strong>{appointment.costumer.name}</strong>
                    </div>
                  </Appointment>
                );
              })
            )}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[
              { daysOfWeek: [0, 6], after: addDays(new Date(), 7) },
            ]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5, 6] } }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
