import { useForm } from "react-hook-form";
import { useGetEvents } from "../../../hooks/query/events";
import { Button } from "../../../pages/Login/Styles";
import { FormContainer, Input, ErrorMsg, Actions } from "./EditionCreateFormStyles";

export default function EditionCreateForm({ onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const eventsQuery = useGetEvents({});
  const events = eventsQuery.data;
  const isLoading = eventsQuery.isLoading;

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <h2>Cadastrar Edição</h2>
      <Input {...register("year", { required: true })} placeholder="Ano" />
      {errors.year && <ErrorMsg>Ano é obrigatório</ErrorMsg>}
      <Input {...register("place", { required: true })} placeholder="Local" />
      {errors.place && <ErrorMsg>Local é obrigatório</ErrorMsg>}
      <div style={{ margin: '8px 0' }}>
        <label htmlFor="event">Evento:</label>
        <select {...register("event", { required: true })} id="event" defaultValue="">
          <option value="" disabled>Selecione o evento</option>
          {isLoading && <option>Carregando eventos...</option>}
          {events && events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.name} ({ev.sigla})</option>
          ))}
        </select>
        {errors.event && <ErrorMsg>Evento é obrigatório</ErrorMsg>}
      </div>
      <Actions>
        <Button type="submit">Cadastrar</Button>
        <Button type="button" onClick={onCancel} style={{ background: '#ef4444' }}>Cancelar</Button>
      </Actions>
    </FormContainer>
  );
}
