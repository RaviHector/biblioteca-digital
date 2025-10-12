import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useGetArticleById, useUpdateArticle } from "../../hooks/query/article";
import ArticleEditForm from "../../components/common/ArticleEditForm/ArticleEditForm";
import { Container, LoaderWrapper } from "./Styles";
import { PropagateLoader } from "react-spinners";

export default function ArticleEdit() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: article, isLoading, isError } = useGetArticleById({
    _id,
    onError: (err) => toast.error(`Erro ao carregar artigo: ${err.message}`),
  });

  const { mutate: updateArticle } = useUpdateArticle({
    onSuccess: () => {
      toast.success("Artigo atualizado com sucesso!");
      queryClient.invalidateQueries(["Articles"]);
      navigate("/adminpage");
    },
    onError: (err) => toast.error(`Erro ao atualizar artigo: ${err.message}`),
  });

  const handleSave = (data) => {
    updateArticle({
      _id: article._id,
      newArticleData: data,
    });
  };

  const handleCancel = () => {
    navigate("/adminpage");
  };

  if (isLoading) {
    return (
      <Container>
        <LoaderWrapper>
          <PropagateLoader color="#38bdf8" />
        </LoaderWrapper>
      </Container>
    );
  }

  if (isError || !article) {
    return (
      <Container>
        <h1>Erro</h1>
        <p>Não foi possível carregar os dados do artigo.</p>
        <button onClick={() => navigate("/adminpage")}>Voltar</button>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Editar Artigo</h1>
      <ArticleEditForm
        initialData={article}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Container>
  );
}