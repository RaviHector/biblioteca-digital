import { LinkContainer, Image } from './Styles';
import imageLogo from '../../../assets/logo-ctvacinas.png';

export default function Logo() {
  return (
    <LinkContainer to="/">
      <Image src={imageLogo} alt="Logo" />
    </LinkContainer>
  );
}
