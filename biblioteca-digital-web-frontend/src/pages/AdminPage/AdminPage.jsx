import { useState } from "react";
import { toast } from "react-toastify";
import { useSearchEvents } from "../../hooks/query/events";
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

export default function AdminPage() {
  // Estado para controlar o valor do input de busca
  const [searchTerm, setSearchTerm] = useState("");

  // O hook de busca agora usa o 'searchTerm' diretamente.
  // A busca será refeita a cada caractere digitado.
//   const { data: events, isLoading: isLoadingEvents } = useSearchEvents({
//     searchTerm: searchTerm,
//     onError: (err) => {
//       toast.error("Erro ao buscar eventos", err);
//     },
//   });
  // 5. O debounce evita chamadas excessivas à API enquanto o usuário digita
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms de espera

  // 6. Use o novo hook com o valor "debounced"
  const { data: events, isLoading: isLoadingEvents } = useSearchEvents({
    searchTerm: debouncedSearchTerm,
    onError: (err) => {
      toast.error("Erro ao buscar eventos", err);
    },
  });

  const navigate = useNavigate();

  return (
    <Container>
      <Title>Eventos Recentes</Title>

      <SearchInput>
        <Search size={20} color="#9ca3af" />
        <input
          type="text"
          placeholder="Buscar por nome, sigla ou entidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchInput>

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