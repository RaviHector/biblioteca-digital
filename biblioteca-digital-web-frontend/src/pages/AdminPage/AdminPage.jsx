import { useState } from "react";
import { toast } from "react-toastify";
import { useSearchEvents } from "../../hooks/query/events";
import { useSearchEditions } from "../../hooks/query/editions";
import { useSearchArticle } from "../../hooks/query/article";
import {
  Card,
  Container,
  Grid,
  Line,
  LoaderWrapper,
  SearchInput,
  Title,
  ButtonContainer,
  SearchTypeButton,
  CardContent,
  CardActions,
  EditButton,
  DeleteButton,
} from "./Styles";
import { PropagateLoader } from "react-spinners";
import { CalendarDays, Building2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/query/useDebounce";
import { EventEditForm, Popup } from "../../components/common";
import { useDeleteEvent, useUpdateEvent } from "../../hooks/query/events";
import { useDeleteEdition } from "../../hooks/query/editions";
import { useDeleteArticle } from "../../hooks/query/article";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("eventos");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();
  // Hooks de busca (Queries)
  const { data: events, isLoading: isLoadingEvents } = useSearchEvents({
    name: searchType === "eventos" ? debouncedSearchTerm : "",
    onError: (err) => toast.error(`Erro ao buscar eventos: ${err.message}`),
  });

  const { data: editions, isLoading: isLoadingEditions } = useSearchEditions({
    name: searchType === "edicoes" ? debouncedSearchTerm : "",
    onError: (err) => toast.error(`Erro ao buscar edições: ${err.message}`),
  });

  const { data: article, isLoading: isLoadingArticles } = useSearchArticle({
    name: searchType === "artigos" ? debouncedSearchTerm : "",
    onError: (err) => toast.error(`Erro ao buscar artigos: ${err.message}`),
  });
  console.log(article);

  // Hooks de Ação (Mutations) com a lógica de sucesso centralizada
  const { mutate: deleteEvent } = useDeleteEvent({
    onSuccess: () => toast.success("Evento deletado"),
    onError: (err) => toast.error(`Erro ao deletar evento: ${err.message}`),
  });

  const { mutate: updateEvent } = useUpdateEvent({
    onSuccess: () => {
      toast.success("Evento atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["Events"] });
      setOpenPopup(false); // Efeito colateral de UI agora está aqui
    },
    onError: (err) => toast.error(`Erro ao atualizar evento: ${err.message}`),
  });

  const { mutate: deleteEdition } = useDeleteEdition({
    onSuccess: () => toast.success("Edição deletada"),
    onError: (err) => toast.error(`Erro ao deletar edição: ${err.message}`),
  });

  const { mutate: deleteArticle } = useDeleteArticle({
    onSuccess: () => toast.success("Artigo deletado"),
    onError: (err) => toast.error(`Erro ao deletar artigo: ${err.message}`),
  });

  const handleSaveEvent = (newData) => {
    updateEvent({
      _id: selectedEvent._id,
      newEventData: newData,
    });
  };

  const renderContent = () => {
    if (searchType === "artigos") {
      if (isLoadingArticles)
        return (
          <LoaderWrapper>
            <PropagateLoader color="#38bdf8" />
          </LoaderWrapper>
        );
      return (
        <Grid>
          {article?.map((item, index) => (
            <Card
              onHoverStart={() => console.log(item)}
              key={item?._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardContent onClick={() => navigate(`/article/${item?._id}`)}>
                <Line>
                  <strong>{item?.title || `Artigo ${index + 1}`}</strong>
                </Line>
                <Line>
                  Autor:{" "}
                  {item?.author?.map((author) => (
                    <span key={author}>{author}</span>
                  ))}
                </Line>
                <Line>Publicado: {item?.year || "—"}</Line>
              </CardContent>
              <CardActions>
                <DeleteButton onClick={() => deleteArticle(item?._id)}>
                  Deletar
                </DeleteButton>
              </CardActions>
            </Card>
          ))}
        </Grid>
      );
    }
    if (searchType === "edicoes") {
      if (isLoadingEditions)
        return (
          <LoaderWrapper>
            <PropagateLoader color="#38bdf8" />
          </LoaderWrapper>
        );
      return (
        <Grid>
          {editions?.map((item, index) => (
            <Card
              key={item?._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardContent onClick={() => navigate(`/edition/${item?._id}`)}>
                <Line>
                  <strong>{item?.event?.sigla || `Edição ${index + 1}`}</strong>
                </Line>
                <Line>
                  <Building2 size={18} /> {item?.place}
                </Line>
                <Line>Ano: {item?.year || "—"}</Line>
              </CardContent>
              <CardActions>
                <DeleteButton onClick={() => deleteEdition(item?._id)}>
                  Deletar
                </DeleteButton>
              </CardActions>
            </Card>
          ))}
        </Grid>
      );
    }
    if (isLoadingEvents)
      return (
        <LoaderWrapper>
          <PropagateLoader color="#38bdf8" />
        </LoaderWrapper>
      );
    return (
      <Grid>
        {events?.map((item, index) => (
          <Card
            key={item?._id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CardContent onClick={() => navigate(`/event/${item?._id}`)}>
              <Line>
                <CalendarDays size={18} /> <strong>{item?.name}</strong>
              </Line>
              <Line>
                <Building2 size={18} /> {item?.entity}
              </Line>
              <Line>Sigla: {item?.sigla}</Line>
            </CardContent>
            <CardActions>
              <EditButton
                onClick={() => {
                  setSelectedEvent(item);
                  setOpenPopup(true);
                }}
              >
                Editar
              </EditButton>
              <DeleteButton onClick={() => deleteEvent(item?._id)}>
                Deletar
              </DeleteButton>
            </CardActions>
          </Card>
        ))}
      </Grid>
    );
  };

  return (
    <Container>
      <Title>Busca Administrativa</Title>
      <ButtonContainer>
        <SearchTypeButton
          type="button"
          onClick={() => setSearchType("artigos")}
          active={searchType === "artigos"}
        >
          Artigos
        </SearchTypeButton>
        <SearchTypeButton
          type="button"
          onClick={() => setSearchType("edicoes")}
          active={searchType === "edicoes"}
        >
          Edições
        </SearchTypeButton>
        <SearchTypeButton
          type="button"
          onClick={() => setSearchType("eventos")}
          active={searchType === "eventos"}
        >
          Eventos
        </SearchTypeButton>
      </ButtonContainer>
      <SearchInput>
        <Search size={20} color="#9ca3af" />
        <input
          type="text"
          placeholder={
            searchType === "artigos"
              ? "Buscar por título, autor ou resumo..."
              : searchType === "edicoes"
              ? "Buscar por edição, volume ou ano..."
              : "Buscar por nome, sigla ou entidade..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchInput>

      {renderContent()}

      <Popup
        title={selectedEvent ? `Editar: ${selectedEvent?.name}` : "Editar"}
        openPopup={openPopup}
        setOpenPopup={(v) => {
          setOpenPopup(v);
          if (!v) setSelectedEvent(null);
        }}
      >
        {selectedEvent && (
          <EventEditForm
            initialData={selectedEvent}
            onCancel={() => setOpenPopup(false)}
            onSave={handleSaveEvent}
          />
        )}
      </Popup>
    </Container>
  );
}
