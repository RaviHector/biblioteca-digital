import { useForm } from "react-hook-form";
import { useGetEvents } from "../../../hooks/query/events";
import { useGetEditions } from "../../../hooks/query/editions";
import { FormContainer, Input, ErrorMsg, Actions, Button } from "./EditionCreateFormStyles";
import { useState, useEffect } from "react";

export default function EditionCreateForm({ onSubmit, onCancel }) {
  const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm();
  const [conflictError, setConflictError] = useState("");
  
  const eventsQuery = useGetEvents({});
  const events = eventsQuery.data || [];
  const isLoading = eventsQuery.isLoading;
  
  const editionsQuery = useGetEditions({});
  const editions = editionsQuery.data || [];
  
  const selectedEvent = watch("event");
  const selectedYear = watch("year");

  // Check for duplicate editions when event or year changes
  useEffect(() => {
    if (selectedEvent && selectedYear) {
      const conflict = editions.find(
        edition => 
          edition.event._id === selectedEvent && 
          edition.year.toString() === selectedYear.toString()
      );
      
      if (conflict) {
        setConflictError(`An edition for year ${selectedYear} already exists for this event`);
      } else {
        setConflictError("");
        clearErrors("duplicate");
      }
    } else {
      setConflictError("");
      clearErrors("duplicate");
    }
  }, [selectedEvent, selectedYear, editions, clearErrors]);

  const handleFormSubmit = (data) => {
    // Final validation before submission
    if (conflictError) {
      setError("duplicate", {
        type: "manual",
        message: conflictError
      });
      return;
    }
    
    onSubmit(data);
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <h2>Cadastrar Edição</h2>
      <Input {...register("year", { required: true })} placeholder="Ano" />
      {errors.year && <ErrorMsg>Ano é obrigatório</ErrorMsg>}
      <Input {...register("place", { required: true, maxLength: 100 })} placeholder="Local (máx. 100 caracteres)" />
      {errors.place && <ErrorMsg>Local é obrigatório e até 100 caracteres</ErrorMsg>}
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
      
      {/* Show duplicate conflict error */}
      {conflictError && <ErrorMsg style={{ color: 'red', fontWeight: 'bold' }}>{conflictError}</ErrorMsg>}
      {errors.duplicate && <ErrorMsg>{errors.duplicate.message}</ErrorMsg>}
      
      <Actions>
        <Button type="button" onClick={onCancel} backgroundcolor="#ccc">
          Cancelar
        </Button>
        <Button 
          type="submit" 
          backgroundcolor={conflictError ? "#ccc" : "#1976d2"}
          style={{
            cursor: conflictError ? 'not-allowed' : 'pointer',
            opacity: conflictError ? 0.6 : 1
          }}
          disabled={conflictError}
        >
          Cadastrar
        </Button>
      </Actions>
    </FormContainer>
  );
}
