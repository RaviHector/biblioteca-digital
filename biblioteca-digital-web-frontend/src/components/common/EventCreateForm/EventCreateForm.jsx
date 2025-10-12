import { useForm } from "react-hook-form";
import { FormContainer, Input, ErrorMsg, Actions } from "./EventCreateFormStyles";
import styled from "styled-components";

const Button = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  &:hover {
    background: #1d4ed8;
  }
`;

export default function EventCreateForm({ onSubmit, onCancel }) {
  const { register, handleSubmit, reset } = useForm();

  const handleFormSubmit = (data) => {
    if (onSubmit) onSubmit(data);
    reset();
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <Input {...register("name", { required: true })} placeholder="Nome do evento" />
      <Input {...register("entity", { required: true })} placeholder="Entidade" />
      <Input {...register("sigla") } placeholder="Sigla" />
      <Input {...register("date") } type="date" placeholder="Data" />
      <Actions>
        <Button type="submit">Cadastrar</Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
            Cancelar
          </Button>
        )}
      </Actions>
    </FormContainer>
  );
}
