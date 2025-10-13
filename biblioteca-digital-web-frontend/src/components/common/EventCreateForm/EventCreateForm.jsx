import { useForm } from "react-hook-form";
import { FormContainer, Input, ErrorMsg, Actions, ContainerWrapper, Label, Button } from "./EventCreateFormStyles";

export default function EventCreateForm({ onSubmit, onSave, onCancel }) {
  const { register, handleSubmit, reset } = useForm();

  const handleFormSubmit = (data) => {
    if (onSave) onSave(data);
    else if (onSubmit) onSubmit(data);
    reset();
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <ContainerWrapper>
        <Label>Nome do Evento</Label>
        <Input {...register("name", { required: true })} placeholder="Digite o nome do evento" />
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Entidade</Label>
        <Input {...register("entity", { required: true })} placeholder="Digite a entidade" />
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Sigla</Label>
        <Input {...register("sigla")} placeholder="Digite a sigla (opcional)" />
      </ContainerWrapper>
      
      {/* Date field removed per request; rest of the form remains unchanged */}
      
      <Actions>
        <Button type="button" onClick={onCancel} backgroundcolor="#ccc">
          Cancelar
        </Button>
        <Button type="submit" backgroundcolor="#1976d2">
          Cadastrar
        </Button>
      </Actions>
    </FormContainer>
  );
}
