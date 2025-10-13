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
import useDebounce from "../../hooks/query/useDebounce";
import { EventEditForm, Popup, ArticleEditForm, ArticleCreateForm, BulkUploadForm } from "../../components/common";
import EventCreateForm from "../../components/common/EventCreateForm/EventCreateForm";
import { useDeleteEvent, useUpdateEvent, useCreateEvent } from "../../hooks/query/events";
import EditionCreateForm from "../../components/common/EditionCreateForm/EditionCreateForm";
import { useCreateEdition, useUpdateEdition } from "../../hooks/query/editions";
import { useDeleteEdition } from "../../hooks/query/editions";
import EditionEditForm from "../../components/common/EditionEditForm/EditionEditForm";
import { useDeleteArticle, useUpdateArticle, useCreateArticle, useGetArticle } from "../../hooks/query/article";

import { useQueryClient } from "@tanstack/react-query";

export default function AdminPage() {
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [openEditEdition, setOpenEditEdition] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openEditArticle, setOpenEditArticle] = useState(false);
  const [openCreateArticle, setOpenCreateArticle] = useState(false);
  const { mutate: updateArticle } = useUpdateArticle({
    onSuccess: () => {
      toast.success("Artigo atualizado com sucesso!");
      setOpenEditArticle(false);
      setSelectedArticle(null);
      queryClient.invalidateQueries(["Articles"]);
    },
    onError: (err) => toast.error(`Erro ao atualizar artigo: ${err.message}`),
  });
  const { mutate: createArticle } = useCreateArticle({
    onSuccess: () => {
      toast.success("Artigo criado com sucesso!");
      setOpenCreateArticle(false);
      queryClient.invalidateQueries(["Articles"]);
    },
    onError: (err) => toast.error(`Erro ao criar artigo: ${err.message}`),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("eventos");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openCreateEvent, setOpenCreateEvent] = useState(false);
  const [openCreateEdition, setOpenCreateEdition] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);

  const { mutate: createEdition } = useCreateEdition({
    onSuccess: () => {
      toast.success("Edição cadastrada com sucesso!");
      setOpenCreateEdition(false);
      queryClient.invalidateQueries(["Editions"]);
    },
    onError: (err) => toast.error(`Erro ao cadastrar edição: ${err.message}`),
  });

  const { mutate: updateEdition } = useUpdateEdition({
    onSuccess: () => {
      toast.success("Edição atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["Editions"] });
      setOpenEditEdition(false);
      setSelectedEdition(null);
    },
    onError: (err) => toast.error(`Erro ao atualizar edição: ${err.message}`),
  });
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

  // Buscar todos os artigos quando tipo for "artigos" e não houver busca
  const { data: allArticles, isLoading: isLoadingAllArticles } = useGetArticle({
    filters: {},
    enabled: searchType === "artigos" && !debouncedSearchTerm,
    onError: (err) => toast.error(`Erro ao buscar artigos: ${err.message}`),
  });

  // Buscar artigos por nome quando houver termo de busca
  const { data: searchedArticles, isLoading: isLoadingSearchedArticles } = useSearchArticle({
    name: debouncedSearchTerm,
    enabled: searchType === "artigos" && Boolean(debouncedSearchTerm),
    onError: (err) => toast.error(`Erro ao buscar artigos: ${err.message}`),
  });



  // Determinar quais artigos mostrar
  const article = searchType === "artigos" ? 
    (debouncedSearchTerm ? searchedArticles : allArticles) : 
    null;
  const isLoadingArticles = searchType === "artigos" ? 
    (debouncedSearchTerm ? isLoadingSearchedArticles : isLoadingAllArticles) : 
    false;

  // Hooks de Ação (Mutations) com a lógica de sucesso centralizada
  const { mutate: deleteEvent } = useDeleteEvent({
    onSuccess: () => {
      toast.success("Evento deletado com sucesso! Todas as edições e artigos relacionados foram removidos.");
      // Invalidar todas as queries relacionadas quando um evento é deletado
      queryClient.invalidateQueries(["Events"]);
      queryClient.invalidateQueries(["Editions"]);
      queryClient.invalidateQueries(["Articles"]);
    },
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
    onSuccess: () => {
      toast.success("Edição deletada com sucesso! Todos os artigos relacionados foram removidos.");
      // Invalidar queries relacionadas quando uma edição é deletada
      queryClient.invalidateQueries(["Editions"]);
      queryClient.invalidateQueries(["Articles"]);
    },
    onError: (err) => toast.error(`Erro ao deletar edição: ${err.message}`),
  });

  const { mutate: deleteArticle } = useDeleteArticle({
    onSuccess: () => {
      toast.success("Artigo deletado");
      queryClient.invalidateQueries(["Articles"]);
    },
    onError: (err) => toast.error(`Erro ao deletar artigo: ${err.message}`),
  });

  const { mutate: createEvent } = useCreateEvent({
    onSuccess: () => {
      toast.success("Evento cadastrado com sucesso!");
      setOpenCreateEvent(false);
      queryClient.invalidateQueries(["Events"]);
    },
    onError: (err) => toast.error(`Erro ao cadastrar evento: ${err.message}`),
  });





  const handleSaveEvent = (newData) => {
    updateEvent({
      _id: selectedEvent._id,
      newEventData: newData,
    });
  };

  const handleSaveArticle = (newData) => {
    updateArticle({
      _id: selectedArticle._id,
      newArticleData: newData,
    });
  };

  const handleCreateArticle = (newData) => {
    createArticle(newData);
  };

  const handleCreateEvent = (newData) => {
    createEvent(newData);
  };

  const handleCreateEdition = (newData) => {
    createEdition(newData);
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
              <CardContent>
                <Line>
                  <strong>{item?.title || `Artigo ${index + 1}`}</strong>
                </Line>
                <Line>
                  Autores:{" "}
                  {item?.author?.length > 0 ? (
                    item.author.map((author, idx) => (
                      <span key={author}>
                        {author}{idx < item.author.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    "Não informado"
                  )}
                </Line>
                <Line>Publicado: {item?.year || "—"}</Line>
                <Line>Edição: {item?.edition?.event?.name || item?.edition?.event?.sigla || "—"} - {item?.edition?.year || "—"}</Line>
                <Line>Páginas: {item?.first_page || "—"} - {item?.last_page || "—"}</Line>
                {item?.pdf_file && (
                  <Line>
                    <a 
                      href={`http://localhost:3333${item.pdf_file}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: "#1976d2", textDecoration: "underline" }}
                    >
                      📄 Ver PDF
                    </a>
                  </Line>
                )}
              </CardContent>
              <CardActions>
                <EditButton
                  onClick={() => {
                    setSelectedArticle(item);
                    setOpenEditArticle(true);
                  }}
                >
                  Editar
                </EditButton>
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
                <EditButton
                  onClick={() => {
                    setSelectedEdition(item);
                    setOpenEditEdition(true);
                  }}
                >
                  Editar
                </EditButton>
                <DeleteButton onClick={() => deleteEdition(item?._id)}>
                  Deletar
                </DeleteButton>
      {/* O Popup de edição de edição deve ficar fora do loop dos cards */}
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
      <div style={{ marginBottom: 16 }}>
        {searchType === "eventos" && (
          <button
            onClick={() => setOpenCreateEvent(true)}
            style={{
              background: "#22c55e",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cadastrar Evento
          </button>
        )}
        {searchType === "edicoes" && (
          <button
            onClick={() => setOpenCreateEdition(true)}
            style={{
              background: "#22c55e",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              marginLeft: searchType === "eventos" ? 8 : 0,
            }}
          >
            Cadastrar Edição
          </button>
        )}
        {searchType === "artigos" && (
          <button
            onClick={() => setOpenCreateArticle(true)}
            style={{
              background: "#22c55e",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              marginLeft: searchType === "eventos" ? 8 : 0,
            }}
          >
            Cadastrar Artigo
          </button>
        )}
        
        {searchType === "artigos" && (
          <button
            onClick={() => setOpenBulkUpload(true)}
            style={{
              padding: "10px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: 8,
            }}
          >
            📂 Upload em Massa
          </button>
        )}

      </div>
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

      {/* Popup de edição de artigo */}
      <Popup
        title={selectedArticle ? `Editar: ${selectedArticle?.title}` : "Editar Artigo"}
        openPopup={openEditArticle}
        setOpenPopup={(v) => {
          setOpenEditArticle(v);
          if (!v) setSelectedArticle(null);
        }}
      >
        {selectedArticle && (
          <ArticleEditForm
            initialData={selectedArticle}
            onCancel={() => setOpenEditArticle(false)}
            onSave={handleSaveArticle}
          />
        )}
      </Popup>

      {/* Popup de edição de edição */}
      <Popup
        title={selectedEdition ? `Editar: ${selectedEdition?.event?.sigla || selectedEdition?.event?.name}` : "Editar Edição"}
        openPopup={openEditEdition}
        setOpenPopup={(v) => {
          setOpenEditEdition(v);
          if (!v) setSelectedEdition(null);
        }}
      >
        {selectedEdition && (
          <EditionEditForm
            initialData={selectedEdition}
            onSave={(data) => updateEdition({ _id: selectedEdition._id, newEditionData: data })}
            onCancel={() => setOpenEditEdition(false)}
          />
        )}
      </Popup>

      {/* Popup de criação de artigo */}
      <Popup
        title="Cadastrar Artigo"
        openPopup={openCreateArticle}
        setOpenPopup={(v) => {
          setOpenCreateArticle(v);
        }}
      >
        <ArticleCreateForm
          onSave={handleCreateArticle}
          onCancel={() => setOpenCreateArticle(false)}
        />
      </Popup>

      {/* Popup de criação de evento */}
      <Popup
        title="Cadastrar Evento"
        openPopup={openCreateEvent}
        setOpenPopup={(v) => {
          setOpenCreateEvent(v);
        }}
      >
        <EventCreateForm
          onSave={handleCreateEvent}
          onCancel={() => setOpenCreateEvent(false)}
        />
      </Popup>

      {/* Popup de criação de edição */}
      <Popup
        title="Cadastrar Edição"
        openPopup={openCreateEdition}
        setOpenPopup={(v) => {
          setOpenCreateEdition(v);
        }}
      >
        <EditionCreateForm
          onSave={handleCreateEdition}
          onCancel={() => setOpenCreateEdition(false)}
        />
      </Popup>

      {/* Popup de upload em massa */}
      <Popup
        title="Upload em Massa de Artigos"
        openPopup={openBulkUpload}
        setOpenPopup={(v) => {
          setOpenBulkUpload(v);
        }}
      >
        <BulkUploadForm
          onClose={() => {
            setOpenBulkUpload(false);
            // Invalidar queries para atualizar a lista
            queryClient.invalidateQueries(["Articles"]);
            queryClient.invalidateQueries(["Events"]);
            queryClient.invalidateQueries(["Editions"]);
          }}
        />
      </Popup>




    </Container>
  );
}
