import { useParams } from "react-router-dom";
import { Container } from "./Styles";

export default function Edition() {
  const { _id } = useParams();

  return (
    <Container>
      <h1>Edição</h1>
      <p>Visualizando edição com ID: {_id}</p>
      {/* Aqui você pode adicionar o conteúdo da página de edição */}
    </Container>
  );
}