import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter, addMinutes } from 'date-fns';
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
  Calendar,
} from './styles';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import AppointmentModel from '../../models/Appointment';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);

  const { user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<AppointmentModel[]>(`/barber/${user.id}/appointment`, {
        params: {
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => {
          let dateTime = addMinutes(
            parseISO(appointment.date),
            appointment.time,
          );
          return {
            ...appointment,
            dateTime,
            hourFormatted: format(dateTime, 'HH:mm'),
          };
        });

        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate, user.id]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

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
            disabledDays={[{ daysOfWeek: [0] }, ...disabledDays]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5, 6] } }}
            onMonthChange={handleMonthChange}
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
