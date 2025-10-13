import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useGetEditionById, useUpdateEdition } from "../../hooks/query/editions";
import EditionEditForm from "../../components/common/EditionEditForm/EditionEditForm";
import { Container, LoaderWrapper } from "./Styles";
import { PropagateLoader } from "react-spinners";

export default function EditionEdit() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: edition, isLoading, isError } = useGetEditionById({
    _id,
    onError: (err) => toast.error(`Erro ao carregar edição: ${err.message}`),
  });

  const { mutate: updateEdition } = useUpdateEdition({
    onSuccess: () => {
      toast.success("Edição atualizada com sucesso!");
      queryClient.invalidateQueries(["Editions"]);
      navigate("/adminpage");
    },
    onError: (err) => toast.error(`Erro ao atualizar edição: ${err.message}`),
  });

  const handleSave = (data) => {
    updateEdition({
      _id: edition._id,
      newEditionData: data,
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

  if (isError || !edition) {
    return (
      <Container>
        <h1>Erro</h1>
        <p>Não foi possível carregar os dados da edição.</p>
        <button onClick={() => navigate("/adminpage")}>Voltar</button>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Editar Edição</h1>
      <EditionEditForm
        initialData={edition}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Container>
  );
}