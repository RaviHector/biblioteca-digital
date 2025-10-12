import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { Calendar, BookOpen, Users } from "lucide-react";
import { useSearchByNameArticle } from "../../hooks/query/article";
import {
  Container,
  Title,
  Message,
  YearSection,
  YearTitle,
  ArticlesList,
  ArticleCard,
  ArticleTitle,
  ArticleDetails,
  ArticleInfo,
  LoaderWrapper,
  AuthorStats,
  StatItem,
} from "./Styles";

export default function Author() {
  const { authorName } = useParams();
  const [groupedArticles, setGroupedArticles] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Decodifica o nome do autor da URL
  const decodedAuthorName = decodeURIComponent(authorName || "");

  // Hook para buscar artigos por nome do autor
  const { data: articles, isLoading: isLoadingArticles } =
    useSearchByNameArticle({
      name: decodedAuthorName,
      onError: (err) => {
        toast.error("Erro ao buscar artigos do autor", err);
        setIsLoading(false);
      },
    });

  // Efeito para agrupar artigos por ano quando os dados chegarem
  useEffect(() => {
    if (!isLoadingArticles) {
      setIsLoading(false);

      if (articles && articles.length > 0) {
        // Filtra artigos que realmente pertencem ao autor
        const authorArticles = articles.filter(
          (article) =>
            article.author &&
            Array.isArray(article.author) &&
            article.author.some((author) =>
              author.toLowerCase().includes(decodedAuthorName.toLowerCase())
            )
        );

        // Agrupa artigos por ano (ordem decrescente)
        const grouped = authorArticles.reduce((acc, article) => {
          const year = article.year || "Ano não informado";
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(article);
          return acc;
        }, {});

        // Ordena os anos em ordem decrescente
        const sortedGrouped = Object.keys(grouped)
          .sort((a, b) => {
            if (a === "Ano não informado") return 1;
            if (b === "Ano não informado") return -1;
            return parseInt(b) - parseInt(a);
          })
          .reduce((acc, year) => {
            acc[year] = grouped[year];
            return acc;
          }, {});

        setGroupedArticles(sortedGrouped);
      } else {
        setGroupedArticles({});
      }
    }
  }, [articles, isLoadingArticles, decodedAuthorName]);

  // Calcula estatísticas
  const totalArticles = Object.values(groupedArticles).reduce(
    (total, yearArticles) => total + yearArticles.length,
    0
  );
  const totalYears = Object.keys(groupedArticles).length;
  const latestYear = Object.keys(groupedArticles)[0];

  const handleArticleClick = (article) => {
    // Aqui você pode implementar navegação para o artigo específico
    console.log("Clicou no artigo:", article);
  };

  if (isLoading) {
    return (
      <Container>
        <Title>Carregando artigos...</Title>
        <LoaderWrapper>
          <PropagateLoader color="#38bdf8" />
        </LoaderWrapper>
      </Container>
    );
  }

  if (totalArticles === 0) {
    return (
      <Container>
        <Title>Artigos de {decodedAuthorName}</Title>
        <Message>Nenhum artigo encontrado para este autor.</Message>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Artigos de {decodedAuthorName}</Title>

      <AuthorStats>
        <StatItem>
          <span className="number">{totalArticles}</span>
          <span className="label">Artigos</span>
        </StatItem>
        <StatItem>
          <span className="number">{totalYears}</span>
          <span className="label">Anos de publicação</span>
        </StatItem>
        {latestYear && latestYear !== "Ano não informado" && (
          <StatItem>
            <span className="number">{latestYear}</span>
            <span className="label">Última publicação</span>
          </StatItem>
        )}
      </AuthorStats>

      {Object.entries(groupedArticles).map(([year, yearArticles]) => (
        <YearSection key={year}>
          <YearTitle>{year}</YearTitle>
          <ArticlesList>
            {yearArticles.map((article, index) => (
              <ArticleCard
                key={article._id || index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleArticleClick(article)}
              >
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleDetails>
                  {article.edition?.event?.name && (
                    <ArticleInfo>
                      <Calendar size={16} />
                      <span>Evento: {article.edition.event.name}</span>
                    </ArticleInfo>
                  )}
                  {article.edition?.year && (
                    <ArticleInfo>
                      <BookOpen size={16} />
                      <span>Edição: {article.edition.year}</span>
                    </ArticleInfo>
                  )}
                  {article.author && Array.isArray(article.author) && (
                    <ArticleInfo>
                      <Users size={16} />
                      <span>Autores: {article.author.join(", ")}</span>
                    </ArticleInfo>
                  )}
                  {article.first_page && article.last_page && (
                    <ArticleInfo>
                      <BookOpen size={16} />
                      <span>
                        Páginas: {article.first_page} - {article.last_page}
                      </span>
                    </ArticleInfo>
                  )}
                </ArticleDetails>
              </ArticleCard>
            ))}
          </ArticlesList>
        </YearSection>
      ))}
    </Container>
  );
}
