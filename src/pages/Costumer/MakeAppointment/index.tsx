import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Content,
  ContentStep,
  Button,
  ContentNavigationButton,
  ButtonNavigation,
} from './styles';
import User from '../../../models/User';
import Service from '../../../models/Service';
import api from '../../../services/api';
import { FaArrowRight, FaArrowLeft, FaCalendarCheck } from 'react-icons/fa';
import { addMinutes, format, addDays } from 'date-fns';
import { useAuth } from '../../../hooks/auth';
import { useToast, ToastMessage } from '../../../hooks/toast';
import { useHistory } from 'react-router-dom';
import Calendar from '../../../components/Calendar';
import DayPicker from 'react-day-picker';
import { zonedTimeToUtc } from 'date-fns-tz';
import getTimeZone from '../../../utils/getTimeZone';
const MakeAppointment: React.FC = (props) => {
  const [service, setService] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>();
  const [step, setStep] = useState(1);
  const [barber, setBarber] = useState<number | null>();
  const [barbers, setBarbers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<number[] | null>(null);
  const [appointment, setappointment] = useState<number | null>();

  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  useEffect(() => {
    async function getServices() {
      const { data } = await api.get<Service[]>('/service');
      setServices(data);
    }
    async function getBarbers() {
      const { data } = await api.get<User[]>(`service/${service}/barber`);
      setBarbers(data);
    }
    async function getAvailableAppointmentTimes() {
      const { data } = await api.get<number[]>(
        `barber/${barber}/available-time`,
        {
          params: {
            date: format(selectedDay, 'yyyy-MM-dd'),
          },
        },
      );
      setAppointments(data);
    }
    switch (step) {
      case 1:
        getServices();
        break;
      case 2:
        getBarbers();
        break;
      case 4:
        getAvailableAppointmentTimes();
        break;
    }
    getServices();
  }, [service, step, barber, selectedDay]);
  const { user } = useAuth();
  const toast = useToast();
  const history = useHistory();
  const handleNextStep = () => {
    setStep(step + 1);
  };
  const handlePreviousStep = () => {
    setStep(step - 1);
  };
  const availableTimes = useMemo(() => {
    const today = new Date();

    return appointments?.map((a) => {
      return {
        hour: format(
          addMinutes(
            new Date(today.getFullYear(), today.getMonth(), today.getDay()),
            a,
          ),
          'k:mm',
        ),
        minutes: a,
      };
    });
  }, [appointments]);
  const makeAppointment = async () => {
    try {
      await api.post('/appointment', {
        barberId: barber,
        serviceId: service,
        costumerId: user.id,
        date: format(
          zonedTimeToUtc(new Date(), getTimeZone()),
          'yyyy-MM-dd hh:mm:ss',
        ),
        time: appointment && appointment,
      });
      const t: ToastMessage = {
        id: '1',
        title: 'Sucesso',
        description: 'Horário marcado com sucesso',
        type: 'success',
      };
      toast.addToast(t);
      history.push('/costumer/dashboard');
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
  };
  return (
    <Container>
      <h1>Marcar um horário</h1>
      <Content>
        {step === 1 && services?.length && (
          <ContentStep>
            {services.map((s) => (
              <Button
                key={s.id}
                value={s.id}
                onClick={() =>
                  service === s.id ? setService(null) : setService(s.id)
                }
                active={service === s.id}
              >
                {s.name}
              </Button>
            ))}
            <ContentNavigationButton>
              {service && (
                <ButtonNavigation onClick={handleNextStep}>
                  <p>Escolher barbeiro</p>
                  <FaArrowRight />
                </ButtonNavigation>
              )}
            </ContentNavigationButton>
          </ContentStep>
        )}

        {step === 2 && (
          <ContentStep>
            {barbers?.length ? (
              barbers.map((b) => (
                <Button
                  key={b.id}
                  value={b.id}
                  onClick={() =>
                    barber === b.id ? setBarber(null) : setBarber(b.id)
                  }
                  active={barber === b.id}
                >
                  <img src={b.perfilImageURL} alt="" />
                  {b.name}
                </Button>
              ))
            ) : (
              <strong>Nenhum barbeiro disponivel</strong>
            )}

            <ContentNavigationButton>
              <ButtonNavigation onClick={handlePreviousStep}>
                <FaArrowLeft /> Escolher Serviço
              </ButtonNavigation>
              {barber && (
                <ButtonNavigation onClick={handleNextStep}>
                  Escolher Dia <FaArrowRight />
                </ButtonNavigation>
              )}
            </ContentNavigationButton>
          </ContentStep>
        )}
        {step === 3 && (
          <ContentStep>
            <Calendar>
              <DayPicker
                selectedDays={selectedDay}
                disabledDays={[
                  {
                    after: addDays(new Date(), 7),
                    before: new Date(),
                  },
                  { daysOfWeek: [0, 6] },
                ]}
                onDayClick={(day) => setSelectedDay(day)}
              />
            </Calendar>

            <ContentNavigationButton>
              <ButtonNavigation onClick={handlePreviousStep}>
                <FaArrowLeft />
                <p>Escolher barbeiro</p>
              </ButtonNavigation>
              {selectedDay && (
                <ButtonNavigation onClick={handleNextStep}>
                  Escolher Horário <FaArrowRight />
                </ButtonNavigation>
              )}
            </ContentNavigationButton>
          </ContentStep>
        )}
        {step === 4 && (
          <ContentStep>
            {availableTimes?.length &&
              availableTimes.map((a) => (
                <Button
                  key={a.minutes}
                  value={a.minutes}
                  onClick={() =>
                    appointment === a.minutes
                      ? setappointment(null)
                      : setappointment(a.minutes)
                  }
                  active={appointment === a.minutes}
                >
                  {a.hour}
                </Button>
              ))}
            <ContentNavigationButton>
              <ButtonNavigation onClick={handlePreviousStep}>
                <FaArrowLeft />
                <p>Escolher Dia</p>
              </ButtonNavigation>
              {selectedDay && (
                <ButtonNavigation onClick={makeAppointment}>
                  Marcar Horário <FaCalendarCheck />
                </ButtonNavigation>
              )}
            </ContentNavigationButton>
          </ContentStep>
        )}
      </Content>
    </Container>
  );
};

export default MakeAppointment;
