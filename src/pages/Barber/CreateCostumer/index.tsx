import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FiArrowLeft, FiMail, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import Button from '../../../components/Button';
import Input from '../../../components/Input';

import { Container, Content } from './styles';
import { useAuth } from '../../../hooks/auth';
import Select, { SelectOption } from '../../../components/Select';
import { COSTUMER } from '../../../constants/userTypes';
// import { FaTransgenderAlt } from 'react-icons/fa';

export interface ProfileFormData {
  name: string;
  email: string;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
}
export interface CostumerFormData {
  name: string;
  email: string;
  genderId: number;
  userTypeId?: number;
}

export interface GenderData {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
const CreateCostumer: React.FC = () => {
  const [genders, setGenders] = useState<SelectOption[] | undefined>(undefined);

  const { addToast } = useToast();
  const { user } = useAuth();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    async function getGenders() {
      const { data } = await api.get<GenderData[]>('/gender');
      setGenders(
        data.map((gender) => ({ value: gender.id, label: gender.name })),
      );
    }
    getGenders();
  }, []);
  const handleSubmit = useCallback(
    async (data: CostumerFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape<CostumerFormData>({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail valido'),
          genderId: Yup.number()
            .required('Gênero obrigatório')
            .typeError('Escolha um gênero'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
        data.userTypeId = COSTUMER;
        await api.post(`/barber/${user.id}/costumer`, data);

        addToast({
          type: 'success',
          title: 'Cliente cadastrado!',
          description: `${data.name} agora faz parte da barbearia.`,
        });

        history.push('/barber/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }
        if (error?.response) {
          error?.response?.data?.forEach((err: any) => {
            addToast({
              type: 'error',
              title: 'Ops !',
              description: err,
            });
          });
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na atualização 🥴',
          description:
            '😣️ Ocorreu um erro ao atualizar perfil, tente novamente. 🤔️',
        });
      }
    },
    [addToast, history, user.id],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/barber/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Adicionar novo cliente</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Select
            // icon = {FaTransgenderAlt}
            name="genderId"
            options={genders}
            placeholder="Selecione o gênero"
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default CreateCostumer;
