import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { Search, FileText, Calendar, User, Lock } from "lucide-react";
import { useSearchArticle } from "../../hooks/query/article";
import useAuthStore from "../../stores/auth";
import useDebounce from "../../hooks/query/useDebounce";
import {
  Container,
  SearchSection,
  SearchContainer,
  SearchInput,
  SearchIcon,
  Title,
  Subtitle,
  ResultsSection,
  ArticleCard,
  ArticleTitle,
  ArticleInfo,
  ArticleAuthors,
  ArticleEvent,
  LoaderWrapper,
  NoResults,
  LoginPrompt,
  LoginButton,
} from "./Styles";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: articles, isLoading } = useSearchArticle({
    name: debouncedSearchTerm,
    enabled: Boolean(debouncedSearchTerm),
    onError: (err) => toast.error(`Erro ao buscar artigos: ${err.message}`),
  });

  const handleArticleClick = (article) => {
    if (auth) {
      // Se estiver logado, vai para o artigo
      navigate(`/article/${article._id}`);
    } else {
      // Se não estiver logado, mostra prompt para login
      toast.info("Faça login para acessar o artigo completo");
      navigate("/login", { state: { from: `/article/${article._id}` } });
    }
  };

  return (
    <Container>
      <SearchSection>
        <Title>Biblioteca Digital</Title>
        <Subtitle>
          Pesquise por artigos, autores ou eventos acadêmicos
        </Subtitle>
        
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Digite o título do artigo, nome do autor ou evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </SearchSection>

      <ResultsSection>
        {isLoading && (
          <LoaderWrapper>
            <PropagateLoader color="#22c55e" />
          </LoaderWrapper>
        )}

        {!isLoading && debouncedSearchTerm && articles?.length === 0 && (
          <NoResults>
            <FileText size={48} />
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente pesquisar com outros termos</p>
          </NoResults>
        )}

        {!isLoading && articles?.length > 0 && (
          <div>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
              {articles.length} resultado(s) encontrado(s)
            </h3>
            {articles.map((article, index) => (
              <ArticleCard
                key={article._id}
                onClick={() => handleArticleClick(article)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <ArticleTitle>
                  <FileText size={20} />
                  {article.title}
                </ArticleTitle>
                
                <ArticleInfo>
                  <ArticleAuthors>
                    <User size={16} />
                    {article.author?.length > 0 
                      ? article.author.join(", ")
                      : "Autor não informado"
                    }
                  </ArticleAuthors>
                  
                  <ArticleEvent>
                    <Calendar size={16} />
                    {article.edition?.event?.name || "Evento não informado"}
                  </ArticleEvent>
                </ArticleInfo>

                {!auth && (
                  <LoginPrompt>
                    <Lock size={16} />
                    Faça login para acessar
                  </LoginPrompt>
                )}
              </ArticleCard>
            ))}
          </div>
        )}

        {!debouncedSearchTerm && (
          <NoResults>
            <Search size={48} />
            <h3>Comece sua pesquisa</h3>
            <p>Digite acima para buscar artigos por título, autor ou evento</p>
          </NoResults>
        )}
      </ResultsSection>
    </Container>
  );
}
