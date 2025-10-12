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
} from "./Styles";
import { PropagateLoader } from "react-spinners";
import { CalendarDays, Building2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/query/useDebounce";
import Popup from "../../components/common/Popup/Popup";
import EventEditForm from "../../components/common/EventEditForm";
import { useDeleteEvent, useUpdateEvent } from "../../hooks/query/events";
import { useDeleteEdition } from "../../hooks/query/editions";
import { useDeleteArticle } from "../../hooks/query/article";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("eventos"); // valores: "artigos", "edicoes", "eventos"

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms de espera

    const { data: events, isLoading: isLoadingEvents } = useSearchEvents({
      searchTerm: searchType === 'eventos' ? debouncedSearchTerm : "",
      onError: (err) => {
        toast.error("Erro ao buscar eventos", err);
      },
    });

    const { data: editions, isLoading: isLoadingEditions } = useSearchEditions({
      searchTerm: searchType === 'edicoes' ? debouncedSearchTerm : "",
      onError: (err) => {
        toast.error("Erro ao buscar edições", err);
      },
    });

    const { data: article, isLoading: isLoadingArticles } = useSearchArticle({
      searchTerm: searchType === 'artigos' ? debouncedSearchTerm : "",
      onError: (err) => {
        toast.error("Erro ao buscar artigos", err);
      },
    });

  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const deleteEventMutation = useDeleteEvent({
    onSuccess: () => {
      toast.success("Evento deletado");
    },
    onError: (err) => {
      toast.error("Erro ao deletar evento", err);
    },
  });

  const updateEventMutation = useUpdateEvent({
    onSuccess: () => {
      toast.success("Evento atualizado");
    },
    onError: (err) => {
      toast.error("Erro ao atualizar evento", err);
    },
  });

  const deleteEditionMutation = useDeleteEdition({
    onSuccess: () => {
      toast.success("Edição deletada");
    },
    onError: (err) => {
      toast.error("Erro ao deletar edição", err);
    },
  });

  const deleteArticleMutation = useDeleteArticle({
    onSuccess: () => {
      toast.success("Artigo deletado");
    },
    onError: (err) => {
      toast.error("Erro ao deletar artigo", err);
    },
  });

  return (
    <Container>
      <Title>Busca Administrativa</Title>

      {/* Botões para seleção do tipo de busca */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setSearchType('artigos')}
          style={{ background: searchType === 'artigos' ? '#38bdf8' : '#e5e7eb', color: searchType === 'artigos' ? '#fff' : '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >Artigos</button>
        <button
          type="button"
          onClick={() => setSearchType('edicoes')}
          style={{ background: searchType === 'edicoes' ? '#38bdf8' : '#e5e7eb', color: searchType === 'edicoes' ? '#fff' : '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >Edições</button>
        <button
          type="button"
          onClick={() => setSearchType('eventos')}
          style={{ background: searchType === 'eventos' ? '#38bdf8' : '#e5e7eb', color: searchType === 'eventos' ? '#fff' : '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >Eventos</button>
      </div>

      <SearchInput>
        <Search size={20} color="#9ca3af" />
        <input
          type="text"
          placeholder={
            searchType === 'artigos'
              ? 'Buscar por título, autor ou resumo...'
              : searchType === 'edicoes'
              ? 'Buscar por edição, volume ou ano...'
              : 'Buscar por nome, sigla ou entidade...'
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchInput>

      {searchType === 'artigos' ? (
        isLoadingArticles ? (
          <LoaderWrapper>
            <PropagateLoader color="#38bdf8" />
          </LoaderWrapper>
        ) : (
          <Grid>
            {article?.map((article, index) => (
              <Card
                key={article?._id || index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/article/${article?._id}`)}>
                  <Line>
                    <strong>{article?.title || `Artigo ${index + 1}`}</strong>
                  </Line>
                  <Line>Autor(es): {Array.isArray(article?.authors) ? article?.authors.join(', ') : article?.authors || '—'}</Line>
                  <Line>Publicado: {article?.year || '—'}</Line>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    onClick={async () => {
                      try {
                        await deleteArticleMutation.mutateAsync(article?._id);
                      } catch (err) {
                        console.error('Erro ao deletar artigo (AdminPage):', err);
                        toast.error('Erro ao deletar artigo: ${err?.message || err}');
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    deletar
                  </button>
                </div>
              </Card>
            ))}
          </Grid>
        )
      ) : searchType === 'edicoes' ? (
        isLoadingEditions ? (
          <LoaderWrapper>
            <PropagateLoader color="#38bdf8" />
          </LoaderWrapper>
        ) : (
          <Grid>
            {editions?.map((edition, index) => (
              <Card key={edition?._id || index} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/edition/${edition?._id}`)}>
                  <Line>
                    <strong>{edition?.title || edition?.name || `Edição ${index + 1}`}</strong>
                  </Line>
                  <Line>
                    <Building2 size={18} /> {edition?.publisher || edition?.entity}
                  </Line>
                  <Line>Ano: {edition?.year || '—'}</Line>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    onClick={async () => {
                      try {
                        await deleteEditionMutation.mutateAsync(edition?._id);
                      } catch (err) {
                        console.error('Erro ao deletar edição (AdminPage):', err);
                        toast.error('Erro ao deletar edição: ${err?.message || err}');
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    deletar
                  </button>
                </div>
              </Card>
            ))}
          </Grid>
        )
      ) : (
        // eventos
        isLoadingEvents ? (
          <LoaderWrapper>
            <PropagateLoader color="#38bdf8" />
          </LoaderWrapper>
        ) : (
          <Grid>
            {events?.map((event, index) => (
              <Card
                key={event?._id || index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/event/${event?._id}`)}>
                  <Line>
                    <CalendarDays size={18} /> <strong>{event?.name}</strong>
                  </Line>
                  <Line>
                    <Building2 size={18} /> {event?.entity}
                  </Line>
                  <Line>Sigla: {event?.sigla}</Line>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setOpenPopup(true);
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#0ea5e9', cursor: 'pointer' }}
                  >
                    editar
                  </button>
                  <button
                    onClick={async () => {
                      // Optimistic UI - remove from list locally
                      try {
                        await deleteEventMutation.mutateAsync(event?._id);
                      } catch (err) {
                        console.error('Erro ao deletar evento (AdminPage):', err);
                        toast.error('Erro ao deletar evento: ${err?.message || err}');
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    deletar
                  </button>
                </div>
              </Card>
            ))}
          </Grid>
        )
      )}

      <Popup title={selectedEvent ? `Editar: ${selectedEvent?.name}` : 'Editar'} openPopup={openPopup} setOpenPopup={(v) => { setOpenPopup(v); if (!v) setSelectedEvent(null); }}>
        {selectedEvent && (
          <EventEditForm
            initialData={selectedEvent}
            onCancel={() => setOpenPopup(false)}
            onSave={async (newData) => {
              try {
                await updateEventMutation.mutateAsync({ _id: selectedEvent._id, newEventData: newData });
                // close popup
                setOpenPopup(false);
              } catch (err) {
                console.error('Erro ao atualizar evento (AdminPage):', err);
                toast.error('Erro ao atualizar evento: ${err?.message || err}');
              }
            }}
          />
        )}
      </Popup>
    </Container>
  );
}