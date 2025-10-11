import { ExtraInfo, FooterContainer, Logo, Names } from './Styles';

export default function Footer() {
  return (
    <FooterContainer>
      <div>
        <Logo>Afya - Faculdade de Medicina de Itajubá</Logo>
        <Names>
          <span>Camilla Beatriz Carvalho Freitas¹;</span>
          <span>Evaldo de Souza Oliveira¹;</span>
          <span>Julia Caetano de Lima¹;</span>
          <span>Marina Lefol Nani Carvalho¹;</span>
          <span>Murilo Bressan Pizarro¹;</span>
          <span>Pedro Henrique Siqueira¹;</span>
          <span>Rafael José Feichas¹;</span>
          <span>Ronan Ravy Barreto Amaro da Silva¹;</span>
          <span>Juliana Cristina Mendes Goulart²</span>
        </Names>
      </div>
      <ExtraInfo>
        <p>¹ Acadêmicos da Faculdade de Medicina de Itajubá</p>
        <p>² Professora de Libras da Faculdade de Medicina de Itajubá</p>
      </ExtraInfo>
    </FooterContainer>
  );
}
