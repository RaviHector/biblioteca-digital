import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { ArrowLeft, Calendar, User, FileText, Download } from "lucide-react";
import useAuthStore from "../../stores/auth";
import { useGetArticle } from "../../hooks/query/article";
import { downloadArticlePdf } from "../../services/api/endpoints";
import {
  Container,
  Header,
  BackButton,
  Title,
  InfoSection,
  InfoItem,
  AuthorsList,
  EventInfo,
  ContentSection,
  DownloadButton,
  LoaderWrapper,
  ErrorMessage,
} from "./Styles";

export default function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!auth) {
      toast.warning("Você precisa estar logado para visualizar artigos");
      navigate("/login", { state: { from: `/article/${id}` } });
    }
  }, [auth, navigate, id]);

  const { data: articleData, isLoading, error } = useGetArticle({
    filters: { _id: id },
    enabled: Boolean(id) && Boolean(auth),
    onError: (err) => toast.error(`Erro ao carregar artigo: ${err.message}`),
  });

  const article = articleData?.[0]; // useGetArticle retorna array

  const handleDownload = async () => {
    if (article?.pdf_file) {
      try {
        toast.info("Iniciando download...");
        
        const response = await downloadArticlePdf(article._id);
        
        // Criar URL temporária para o blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        
        // Criar elemento de link temporário para download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${article.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
        
        // Simular clique no link
        document.body.appendChild(link);
        link.click();
        
        // Limpar recursos
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success("Download iniciado com sucesso!");
      } catch (error) {
        console.error("Erro ao fazer download:", error);
        toast.error("Erro ao fazer download do PDF");
      }
    } else {
      toast.info("PDF não disponível para este artigo");
    }
  };

  if (!auth) {
    return null; // Componente vazio enquanto redireciona
  }

  if (isLoading) {
    return (
      <Container>
        <LoaderWrapper>
          <PropagateLoader color="#22c55e" />
          <p>Carregando artigo...</p>
        </LoaderWrapper>
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container>
        <ErrorMessage>
          <FileText size={48} />
          <h2>Artigo não encontrado</h2>
          <p>O artigo solicitado não existe ou você não tem permissão para acessá-lo.</p>
          <BackButton onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
            Voltar à busca
          </BackButton>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          Voltar
        </BackButton>
        
        <Title>{article.title}</Title>
      </Header>

      <InfoSection>
        <InfoItem>
          <User size={20} />
          <div>
            <strong>Autores:</strong>
            <AuthorsList>
              {article.author?.length > 0 
                ? article.author.join(", ")
                : "Não informado"
              }
            </AuthorsList>
          </div>
        </InfoItem>

        <InfoItem>
          <Calendar size={20} />
          <EventInfo>
            <strong>Evento:</strong> {article.edition?.event?.name || "Não informado"}
            {article.edition && (
              <>
                <br />
                <strong>Edição:</strong> {article.edition.year} - {article.edition.place}
              </>
            )}
          </EventInfo>
        </InfoItem>

        {(article.first_page || article.last_page) && (
          <InfoItem>
            <FileText size={20} />
            <div>
              <strong>Páginas:</strong> 
              {article.first_page && article.last_page 
                ? ` ${article.first_page} - ${article.last_page}`
                : article.first_page || article.last_page || "Não informado"
              }
            </div>
          </InfoItem>
        )}
      </InfoSection>

      <ContentSection>
        {article.pdf_file ? (
          <DownloadButton onClick={handleDownload}>
            <Download size={20} />
            Baixar PDF
          </DownloadButton>
        ) : (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            PDF não disponível para este artigo
          </p>
        )}
      </ContentSection>
    </Container>
  );
}