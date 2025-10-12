import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetEventById } from "../../hooks/query/events";
import { useSearchByNameEditions } from "../../hooks/query/editions";
import { PropagateLoader } from "react-spinners";
import { CalendarDays, Building2, BookOpen, ArrowLeft } from "lucide-react";
import {
  Container,
  Header,
  BackButton,
  Title,
  Description,
  EventInfo,
  InfoItem,
  LoaderWrapper,
  Grid,
  Card,
  CardTitle,
  CardInfo,
  NoDataMessage,
} from "./Styles";

export default function Event() {
  const { _id: eventId } = useParams();
  const navigate = useNavigate();

  // Buscar dados do evento
  const { data: event, isLoading: isLoadingEvent } = useGetEventById({
    _id: eventId,
    onError: (err) => {
      toast.error("Erro ao buscar dados do evento");
      console.error(err);
    },
  });

  // Buscar todas as edições para filtrar por evento
  const { data: allEditions, isLoading: isLoadingEditions } =
    useSearchByNameEditions({
      name: "",
      onError: (err) => {
        toast.error("Erro ao buscar edições");
        console.error(err);
      },
    });

  // Filtrar edições deste evento
  const eventEditions =
    allEditions?.filter(
      (edition) => edition.event?._id === eventId || edition.event === eventId
    ) || [];

  if (isLoadingEvent || isLoadingEditions) {
    return (
      <LoaderWrapper>
        <PropagateLoader color="#38bdf8" />
      </LoaderWrapper>
    );
  }

  if (!event) {
    return (
      <Container>
        <NoDataMessage>
          <CalendarDays size={48} />
          <h3>Evento não encontrado</h3>
          <p>O evento solicitado não existe ou foi removido.</p>
          <BackButton onClick={() => navigate("/events")}>
            Voltar aos Eventos
          </BackButton>
        </NoDataMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/events")}>
          <ArrowLeft size={20} />
          Voltar aos Eventos
        </BackButton>

        <Title>{event.name}</Title>

        {event.description && <Description>{event.description}</Description>}

        <EventInfo>
          <InfoItem>
            <Building2 size={18} />
            <span>
              <strong>Entidade:</strong> {event.entity}
            </span>
          </InfoItem>
          {event.sigla && (
            <InfoItem>
              <span>
                <strong>Sigla:</strong> {event.sigla}
              </span>
            </InfoItem>
          )}
        </EventInfo>
      </Header>

      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#f8fafc",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Edições do Evento
        </h2>

        {eventEditions.length === 0 ? (
          <NoDataMessage>
            <BookOpen size={48} />
            <h3>Nenhuma edição cadastrada</h3>
            <p>Este evento ainda não possui edições cadastradas.</p>
          </NoDataMessage>
        ) : (
          <Grid>
            {eventEditions.map((edition, index) => (
              <Card
                key={edition._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/edition/${edition._id}`)}
              >
                <CardTitle>
                  {edition.title || `Edição ${edition.year || index + 1}`}
                </CardTitle>
                <CardInfo>
                  <div>
                    <CalendarDays size={16} />
                    <span>
                      <strong>Ano:</strong> {edition.year || "Não informado"}
                    </span>
                  </div>

                  {edition.place && (
                    <div>
                      <Building2 size={16} />
                      <span>
                        <strong>Local:</strong> {edition.place}
                      </span>
                    </div>
                  )}

                  {edition.volume && (
                    <div>
                      <BookOpen size={16} />
                      <span>
                        <strong>Volume:</strong> {edition.volume}
                      </span>
                    </div>
                  )}
                </CardInfo>
              </Card>
            ))}
          </Grid>
        )}
      </div>
    </Container>
  );
}
