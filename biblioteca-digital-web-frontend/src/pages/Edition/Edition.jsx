import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetEditionById } from "../../hooks/query/editions";
import { useSearchArticle } from "../../hooks/query/article";
import { PropagateLoader } from "react-spinners";
import { BookOpen, Calendar, Users, ArrowLeft } from "lucide-react";
import {
  Container,
  Header,
  BackButton,
  Title,
  EditionInfo,
  InfoItem,
  LoaderWrapper,
  Grid,
  Card,
  CardTitle,
  CardInfo,
  NoDataMessage,
} from "./Styles";

export default function Edition() {
  const { _id: editionId } = useParams();
  const navigate = useNavigate();

  // Verificar se o ID é válido (MongoDB ObjectId tem 24 caracteres hexadecimais)
  const isValidObjectId = (id) => {
    return id && /^[0-9a-fA-F]{24}$/.test(id);
  };

  const isValidId = isValidObjectId(editionId);

  // Buscar dados da edição
  const { data: edition, isLoading: isLoadingEdition } = useGetEditionById({
    _id: editionId,
    onError: (err) => {
      console.error("Erro ao buscar edição:", err);
      toast.error(
        `Erro ao buscar dados da edição: ${err.message || "Erro desconhecido"}`
      );
    },
    enabled: isValidId, // Só executa se o ID for válido
  });

  // Buscar artigos da edição
  const { data: allArticles, isLoading: isLoadingArticles } = useSearchArticle({
    name: "",
    onError: (err) => {
      toast.error("Erro ao buscar artigos");
      console.error(err);
    },
  });

  if (!isValidId) {
    return (
      <Container>
        <NoDataMessage>
          <BookOpen size={48} />
          <h3>ID de edição inválido</h3>
          <p>O ID fornecido não é válido.</p>
          <BackButton onClick={() => navigate("/events")}>
            Voltar aos Eventos
          </BackButton>
        </NoDataMessage>
      </Container>
    );
  }

  // Filtrar artigos desta edição
  const editionArticles =
    allArticles?.filter((article) => {
      // Como a edição está populada, comparamos com o _id da edição
      const articleEditionId = article.edition?._id || article.edition;
      return articleEditionId === editionId;
    }) || [];

  console.log("🔍 Debug Artigos:");
  console.log("📝 Edition ID:", editionId);
  console.log("📚 Total de artigos:", allArticles?.length);
  console.log("🎯 Artigos filtrados:", editionArticles.length);
  console.log("📖 Exemplo de artigo:", allArticles?.[0]);
  if (allArticles?.[0]) {
    console.log("📖 Edition do artigo:", allArticles[0].edition);
  }

  if (isLoadingEdition || isLoadingArticles) {
    return (
      <LoaderWrapper>
        <PropagateLoader color="#38bdf8" />
      </LoaderWrapper>
    );
  }
  console.log("📚 Dados da edição:", edition);
  if (!edition) {
    return (
      <Container>
        <NoDataMessage>
          <BookOpen size={48} />
          <h3>Edição não encontrada</h3>
          <p>A edição solicitada não existe ou foi removida.</p>
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
        <BackButton
          onClick={() =>
            navigate(`/event/${edition.event?._id || edition.event}`)
          }
        >
          <ArrowLeft size={20} />
          Voltar ao Evento
        </BackButton>

        <Title>{edition.event?.name || "Evento"}</Title>

        <EditionInfo>
          <InfoItem>
            <Calendar size={18} />
            <span>
              <strong>Ano:</strong> {edition.year}
            </span>
          </InfoItem>
          {edition.place && (
            <InfoItem>
              <span>
                <strong>Local:</strong> {edition.place}
              </span>
            </InfoItem>
          )}
          {edition.volume && (
            <InfoItem>
              <span>
                <strong>Volume:</strong> {edition.volume}
              </span>
            </InfoItem>
          )}
        </EditionInfo>
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
          Artigos da Edição
        </h2>

        {editionArticles.length === 0 ? (
          <NoDataMessage>
            <BookOpen size={48} />
            <h3>Nenhum artigo cadastrado</h3>
            <p>Esta edição ainda não possui artigos cadastrados.</p>
          </NoDataMessage>
        ) : (
          <Grid>
            {editionArticles.map((article, index) => (
              <Card
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CardTitle>{article.title}</CardTitle>
                <CardInfo>
                  <div>
                    <Users size={16} />
                    <span>
                      <strong>Autor(es):</strong>{" "}
                      {Array.isArray(article.author)
                        ? article.author.join(", ")
                        : article.author || "Não informado"}
                    </span>
                  </div>

                  <div>
                    <Calendar size={16} />
                    <span>
                      <strong>Ano:</strong> {article.year || "Não informado"}
                    </span>
                  </div>

                  {article.first_page && article.last_page && (
                    <div>
                      <BookOpen size={16} />
                      <span>
                        <strong>Páginas:</strong> {article.first_page} -{" "}
                        {article.last_page}
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
