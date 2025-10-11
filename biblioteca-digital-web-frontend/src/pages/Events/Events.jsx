import { toast } from "react-toastify";
import { useSearchByNameEvents } from "../../hooks/query/events";
import { Card, Container, Grid, Line, LoaderWrapper, Title } from "./Styles";
import { PropagateLoader } from "react-spinners";
import { CalendarDays, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const { data: events, isLoading: isLoadingEvents } = useSearchByNameEvents({
    name: "",
    onError: (err) => {
      toast.error("Erro ao buscar eventos", err);
    },
  });
  const navigate = useNavigate();
  return (
    <Container>
      <Title>Eventos Recentes</Title>

      {isLoadingEvents ? (
        <LoaderWrapper>
          <PropagateLoader color="#38bdf8" />
        </LoaderWrapper>
      ) : (
        <Grid>
          {events?.map((event, index) => (
            <Card
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/event/${event?._id}`)}
            >
              <Line>
                <CalendarDays size={18} /> <strong>{event?.name}</strong>
              </Line>
              <Line>
                <Building2 size={18} /> {event?.entity}
              </Line>
              <Line>Sigla: {event?.sigla}</Line>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
}

// import { toast } from "react-toastify";
// import { useSearchByNameEvents } from "../../hooks/query/events";
// import { Column, Container, Line } from "./Styles";
// import { PropagateLoader } from "react-spinners";
// export default function Events() {
//     Backend calls
//     const { data: events, isLoading: isLoadingEvents } = useSearchByNameEvents({ name: "",
//     onError: (err) => { toast.error("error fetching events", err); }, });
//      return (
//      <Container>
//         {isLoadingEvents ?
//      ( <PropagateLoader /> ) :
//      ( events?.map((event) => (
//     <Column>
//     <Line>{event?.name}</Line>
//      <Line>{event?.sigla}</Line>
//     <Line>{event?.entity}</Line>
//      </Column> )) )}
//     </Container> ); }
