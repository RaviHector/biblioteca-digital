import { useForm } from "react-hook-form";
import { useGetEditions } from "../../../hooks/query/editions";
import { useGetEvents } from "../../../hooks/query/events";
import { FormContainer, Input, ErrorMsg, Actions, Button, Label, ContainerWrapper, TextArea } from "./ArticleCreateFormStyles";
import { useEffect } from "react";

export default function ArticleCreateForm({ onSave, onCancel }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({ 
    defaultValues: {
      title: "",
      author: "",
      event: "",
      edition: "",
      year: "",
      first_page: "",
      last_page: ""
    }
  });
  
  const editionsQuery = useGetEditions({});
  const editions = editionsQuery.data || [];
  const isLoadingEditions = editionsQuery.isLoading;
  
  const eventsQuery = useGetEvents({});
  const events = eventsQuery.data || [];
  const isLoadingEvents = eventsQuery.isLoading;

  // Monitorar mudanças no campo event
  const selectedEvent = watch("event");
  const selectedEdition = watch("edition");
  
  // Filtrar edições baseadas no evento selecionado
  const filteredEditions = selectedEvent ? 
    editions.filter(edition => {
      // Verificar se o evento existe e comparar tanto _id quanto string
      const eventId = edition.event?._id || edition.event;
      return eventId === selectedEvent || String(eventId) === String(selectedEvent);
    }) : 
    [];

  // Limpar seleção de edição quando o evento mudar (mas manter o ano)
  useEffect(() => {
    if (selectedEvent) {
      const currentEdition = watch("edition");
      if (currentEdition) {
        const editionExists = filteredEditions.some(ed => ed._id === currentEdition);
        if (!editionExists) {
          setValue("edition", "");
        }
      }
    } else {
      setValue("edition", "");
    }
  }, [selectedEvent, filteredEditions, setValue, watch]);

  const handleFormSubmit = (data) => {
    // Converter autor de string para array
    const formattedData = {
      ...data,
      author: data.author.split(",").map(author => author.trim()).filter(author => author !== "")
    };
    onSave(formattedData);
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <h2>Cadastrar Artigo</h2>
      
      <ContainerWrapper>
        <Label>Título</Label>
        <Input {...register("title", { required: true })} placeholder="Digite o título do artigo" />
        {errors.title && <ErrorMsg>Título é obrigatório</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Autores</Label>
        <TextArea 
          {...register("author", { required: true })} 
          placeholder="Digite os autores (separados por vírgula)&#10;Exemplo:&#10;João Silva, Maria Santos,&#10;Pedro Oliveira, Ana Costa"
          rows={4}
        />
        {errors.author && <ErrorMsg>Autor é obrigatório</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Evento</Label>
        <select {...register("event", { required: true })} id="event">
          <option value="" disabled>Selecione o evento</option>
          {isLoadingEvents && <option>Carregando eventos...</option>}
          {events && events.length > 0 && events.map(event => (
            <option key={event._id} value={event._id}>
              {event.name} ({event.sigla})
            </option>
          ))}
          {!isLoadingEvents && events.length === 0 && (
            <option>Nenhum evento encontrado</option>
          )}
        </select>
        {errors.event && <ErrorMsg>Evento é obrigatório</ErrorMsg>}
      </ContainerWrapper>

      <ContainerWrapper>
        <Label>Edição</Label>
        <select {...register("edition", { required: true })} id="edition">
          <option value="" disabled>
            {selectedEvent ? "Selecione a edição do evento" : "Selecione a edição (escolha o evento primeiro)"}
          </option>
          {isLoadingEditions && <option>Carregando edições...</option>}
          {!isLoadingEditions && !selectedEvent && (
            <option>Selecione um evento primeiro</option>
          )}
          {!isLoadingEditions && selectedEvent && editions.length === 0 && (
            <option>Nenhuma edição cadastrada no sistema</option>
          )}
          {!isLoadingEditions && selectedEvent && editions.length > 0 && filteredEditions.length === 0 && (
            <option>Nenhuma edição encontrada para este evento</option>
          )}
          {filteredEditions && filteredEditions.length > 0 && filteredEditions.map(ed => (
            <option key={ed._id} value={ed._id}>
              {ed.year} - {ed.place}
            </option>
          ))}
        </select>
        {errors.edition && <ErrorMsg>Edição é obrigatória</ErrorMsg>}
      </ContainerWrapper>

      <ContainerWrapper>
        <Label>Ano</Label>
        <Input 
          {...register("year", { required: true })} 
          placeholder="Digite o ano do artigo" 
          type="number"
        />
        {errors.year && <ErrorMsg>Ano é obrigatório</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Página inicial</Label>
        <Input {...register("first_page", { required: true })} placeholder="Digite a página inicial" />
        {errors.first_page && <ErrorMsg>Página inicial é obrigatória</ErrorMsg>}
      </ContainerWrapper>
      
      <ContainerWrapper>
        <Label>Página final</Label>
        <Input {...register("last_page", { required: true })} placeholder="Digite a página final" />
        {errors.last_page && <ErrorMsg>Página final é obrigatória</ErrorMsg>}
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