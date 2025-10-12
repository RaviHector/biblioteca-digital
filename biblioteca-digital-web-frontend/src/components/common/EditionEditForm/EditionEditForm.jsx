import { useForm } from "react-hook-form";
import { useGetEvents } from "../../../hooks/query/events";
import { FormContainer, Input, ErrorMsg, Actions, Button, Label, ContainerWrapper } from "./EditionEditFormStyles";

export default function EditionEditForm({ initialData, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    defaultValues: {
      year: initialData?.year || "",
      place: initialData?.place || "",
      event: initialData?.event?._id || initialData?.event || ""
    }
  });
  
  const eventsQuery = useGetEvents({});
  const events = eventsQuery.data;
  const isLoading = eventsQuery.isLoading;

  return (
    <FormContainer onSubmit={handleSubmit(onSave)}>
      <h2>Editar Edição</h2>
      
      <ContainerWrapper>
        <Label>Ano</Label>
        <Input {...register("year", { required: true })} placeholder="Digite o ano da edição" type="number" />
        {errors.year && <ErrorMsg>Ano é obrigatório</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Local</Label>
        <Input {...register("place", { required: true, maxLength: 100 })} placeholder="Digite o local da edição (máx. 100 caracteres)" />
        {errors.place && <ErrorMsg>Local é obrigatório e até 100 caracteres</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Evento</Label>
        <select {...register("event", { required: true })} id="event">
          <option value="" disabled>Selecione o evento</option>
          {isLoading && <option>Carregando eventos...</option>}
          {events && events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.name} ({ev.sigla})</option>
          ))}
        </select>
        {errors.event && <ErrorMsg>Evento é obrigatório</ErrorMsg>}
      </ContainerWrapper>
      <Actions>
        <Button type="button" onClick={onCancel} backgroundcolor="#ccc">
          Cancelar
        </Button>
        <Button type="submit" backgroundcolor="#1976d2">
          Salvar
        </Button>
      </Actions>
    </FormContainer>
  );
}