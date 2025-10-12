import { useForm } from "react-hook-form";
import { useGetEditions } from "../../../hooks/query/editions";
import { useGetEvents } from "../../../hooks/query/events";
import { FormContainer, Input, ErrorMsg, Actions, Button, Label, ContainerWrapper, TextArea } from "./ArticleCreateFormStyles";
import { useEffect, useState } from "react";

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
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  
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

  // Função para lidar com seleção de arquivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");
    
    if (file) {
      // Validar tipo de arquivo
      if (file.type !== 'application/pdf') {
        setFileError("Por favor, selecione apenas arquivos PDF");
        setSelectedFile(null);
        return;
      }
      
      // Validar tamanho do arquivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB em bytes
      if (file.size > maxSize) {
        setFileError("O arquivo deve ter no máximo 10MB");
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleFormSubmit = (data) => {
    // Converter autor de string para array
    const authorsArray = data.author.split(",").map(author => author.trim()).filter(author => author !== "");
    
    const formData = new FormData();
    
    // Adicionar todos os campos do formulário
    formData.append('title', data.title);
    formData.append('author', JSON.stringify(authorsArray));
    formData.append('event', data.event);
    formData.append('edition', data.edition);
    formData.append('year', data.year);
    formData.append('first_page', data.first_page);
    formData.append('last_page', data.last_page);
    
    // Adicionar arquivo PDF se selecionado
    if (selectedFile) {
      formData.append('pdf_file', selectedFile);
    }
    
    onSave(formData);
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
      
      <ContainerWrapper>
        <Label>Arquivo PDF (opcional)</Label>
        <Input 
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          style={{ padding: "8px" }}
        />
        {fileError && <ErrorMsg>{fileError}</ErrorMsg>}
        {selectedFile && (
          <div style={{ color: "green", fontSize: "14px", marginTop: "4px" }}>
            Arquivo selecionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
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