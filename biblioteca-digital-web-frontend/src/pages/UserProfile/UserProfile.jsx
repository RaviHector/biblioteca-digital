import { useState, useMemo } from "react";
import { useSearchArticle } from "../../hooks/query/article";
import useAuthStore from "../../stores/auth";
import { PropagateLoader } from "react-spinners";
import { User, BookOpen, Calendar, Search } from "lucide-react";
import {
  Container,
  UserInfo,
  UserName,
  UserStats,
  StatItem,
  StatNumber,
  StatLabel,
  ArticlesSection,
  SectionTitle,
  FilterContainer,
  FilterSelect,
  SearchContainer,
  SearchInput,
  YearSection,
  YearTitle,
  ArticleGrid,
  ArticleCard,
  ArticleTitle,
  ArticleInfo,
  LoaderWrapper,
  NoArticlesMessage,
} from "./Styles";

export default function UserProfile() {
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const user = useAuthStore((state) => state.auth?.user);
  // console.log(user);
  // Buscar todos os artigos para filtrar pelos do usuário
  const { data: allArticles, isLoading } = useSearchArticle({
    name: "",
    onError: (err) => console.error("Erro ao buscar artigos:", err),
  });

  // Filtrar artigos do usuário logado
  const userArticles = useMemo(() => {
    if (!allArticles || !user?.name) return [];

    return allArticles.filter(
      (article) =>
        article?.author &&
        Array.isArray(article.author) &&
        article.author.some((author) =>
          author.toLowerCase().includes(user.name.toLowerCase())
        )
    );
  }, [allArticles, user?.name]);

  // Aplicar filtros de busca e ano
  const filteredArticles = useMemo(() => {
    let filtered = userArticles;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((article) =>
        article.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por ano
    if (selectedYear !== "all") {
      filtered = filtered.filter((article) => article.year === selectedYear);
    }

    return filtered;
  }, [userArticles, searchTerm, selectedYear]);

  // Agrupar artigos por ano
  const articlesByYear = useMemo(() => {
    const grouped = {};
    filteredArticles.forEach((article) => {
      const year = article.year || "Sem ano";
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(article);
    });

    // Ordenar anos em ordem decrescente
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
      if (a === "Sem ano") return 1;
      if (b === "Sem ano") return -1;
      return parseInt(b) - parseInt(a);
    });

    return Object.fromEntries(sortedEntries);
  }, [filteredArticles]);

  // Obter anos únicos para o filtro
  const availableYears = useMemo(() => {
    const years = [
      ...new Set(userArticles.map((article) => article.year).filter(Boolean)),
    ];
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }, [userArticles]);

  if (isLoading) {
    return (
      <LoaderWrapper>
        <PropagateLoader color="#38bdf8" />
      </LoaderWrapper>
    );
  }

  if (!user) {
    return (
      <Container>
        <NoArticlesMessage>
          Você precisa estar logado para ver seu perfil.
        </NoArticlesMessage>
      </Container>
    );
  }

  return (
    <Container>
      <UserInfo>
        <User size={48} />
        <div>
          <UserName>{user.name}</UserName>
          <UserStats>
            <StatItem>
              <BookOpen size={16} />
              <div>
                <StatNumber>{userArticles.length}</StatNumber>
                <StatLabel>
                  {userArticles.length === 1 ? "artigo" : "artigos"}
                </StatLabel>
              </div>
            </StatItem>
            <StatItem>
              <Calendar size={16} />
              <div>
                <StatNumber>{availableYears.length}</StatNumber>
                <StatLabel>
                  {availableYears.length === 1 ? "ano" : "anos"}
                </StatLabel>
              </div>
            </StatItem>
          </UserStats>
        </div>
      </UserInfo>

      {userArticles.length === 0 ? (
        <NoArticlesMessage>
          <BookOpen size={48} />
          <h3>Nenhum artigo encontrado</h3>
          <p>Você ainda não possui artigos publicados no sistema.</p>
        </NoArticlesMessage>
      ) : (
        <ArticlesSection>
          <SectionTitle>Meus Artigos</SectionTitle>

          <FilterContainer>
            <SearchContainer>
              <Search size={20} />
              <SearchInput
                type="text"
                placeholder="Buscar nos meus artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>

            <FilterSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">Todos os anos</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </FilterSelect>
          </FilterContainer>

          {Object.keys(articlesByYear).length === 0 ? (
            <NoArticlesMessage>
              <Search size={48} />
              <h3>Nenhum artigo encontrado</h3>
              <p>Nenhum artigo corresponde aos filtros aplicados.</p>
            </NoArticlesMessage>
          ) : (
            Object.entries(articlesByYear).map(([year, articles]) => (
              <YearSection key={year}>
                <YearTitle>{year}</YearTitle>
                <ArticleGrid>
                  {articles.map((article, index) => (
                    <ArticleCard
                      key={article._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <ArticleTitle>{article.title}</ArticleTitle>
                      <ArticleInfo>
                        <div>
                          <strong>Ano:</strong> {article.year}
                        </div>
                        {article.first_page && article.last_page && (
                          <div>
                            <strong>Páginas:</strong> {article.first_page} -{" "}
                            {article.last_page}
                          </div>
                        )}
                        {article.author && article.author.length > 1 && (
                          <div>
                            <strong>Coautores:</strong>{" "}
                            {article.author
                              .filter(
                                (author) =>
                                  !author
                                    .toLowerCase()
                                    .includes(user.name.toLowerCase())
                              )
                              .join(", ")}
                          </div>
                        )}
                      </ArticleInfo>
                    </ArticleCard>
                  ))}
                </ArticleGrid>
              </YearSection>
            ))
          )}
        </ArticlesSection>
      )}
    </Container>
  );
}
