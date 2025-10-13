import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetEditionById } from "../../hooks/query/editions";
import { useSearchArticle, useGetArticle } from "../../hooks/query/article";
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

  // Buscar artigos específicos da edição
  const { data: editionArticles, isLoading: isLoadingArticles } = useGetArticle({
    filters: { edition: editionId },
    enabled: isValidId && !!editionId,
    onError: (err) => {
      toast.error("Erro ao buscar artigos");
      console.error("Erro buscando artigos:", err);
    },
  });

  // Também buscar todos os artigos como fallback
  const { data: allArticles } = useGetArticle({
    filters: {},
    enabled: isValidId,
    onError: (err) => console.error("Erro buscando todos artigos:", err),
  });

  console.log("🚀 Dados carregados:", {
    isLoadingEdition,
    isLoadingArticles,
    hasEdition: !!edition,
    editionId: editionId,
    directEditionArticles: editionArticles?.length || 0,
    totalArticles: allArticles?.length || 0
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

  // Usar artigos filtrados diretamente da API ou fazer filtro manual
  const finalArticles = (() => {
    // Se temos artigos filtrados diretamente da API, usar eles
    if (editionArticles && editionArticles.length > 0) {
      console.log("✅ Usando artigos filtrados diretamente da API:", editionArticles.length);
      return editionArticles;
    }
    
    // Senão, filtrar manualmente
    if (!allArticles) {
      console.log("❌ Nenhum artigo disponível");
      return [];
    }
    
    console.log("🔄 Fazendo filtro manual de", allArticles.length, "artigos");
    
    const filtered = allArticles.filter((article) => {
      if (!article) return false;
      
      // Múltiplas formas de verificar a edição
      const editionRef = article.edition;
      let articleEditionId = null;
      
      // Se edition é um objeto populado
      if (typeof editionRef === 'object' && editionRef !== null) {
        articleEditionId = editionRef._id;
      } 
      // Se edition é apenas um ID (string)
      else if (typeof editionRef === 'string') {
        articleEditionId = editionRef;
      }
      
      const isMatch = articleEditionId === editionId;
      
      console.log(`🔍 Artigo "${article.title || 'Sem título'}":`, {
        editionRef: editionRef,
        articleEditionId: articleEditionId,
        targetEditionId: editionId,
        editionType: typeof editionRef,
        isMatch: isMatch
      });
      
      return isMatch;
    });
    
    console.log("🔄 Resultado do filtro manual:", filtered.length, "artigos");
    return filtered;
  })();

  console.log("🔍 Debug Final dos Artigos:");
  console.log("📝 Edition ID buscada:", editionId);
  console.log("📚 Artigos diretos da API:", editionArticles?.length || 0);
  console.log("📚 Total de todos artigos:", allArticles?.length || 0);
  console.log("🎯 Artigos finais para exibição:", finalArticles.length);
  
  if (allArticles?.length > 0) {
    console.log("📖 Estrutura dos primeiros artigos:", allArticles.slice(0, 3).map(a => ({
      title: a.title,
      edition: a.edition,
      editionId: a.edition?._id || a.edition
    })));
  }
  
  if (finalArticles.length > 0) {
    console.log("✅ Artigos finais encontrados:", finalArticles.map(a => ({
      title: a.title,
      author: a.author
    })));
  } else {
    console.log("❌ Nenhum artigo encontrado para esta edição");
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
            color: "#1A1A1A",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Artigos da Edição
        </h2>

        {finalArticles.length === 0 ? (
          <NoDataMessage>
            <BookOpen size={48} />
            <h3>Nenhum artigo cadastrado</h3>
            <p>Esta edição ainda não possui artigos cadastrados.</p>
          </NoDataMessage>
        ) : (
          <Grid>
            {finalArticles.map((article, index) => (
              <Card
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/article/${article._id}`)}
                style={{ cursor: 'pointer' }}
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


