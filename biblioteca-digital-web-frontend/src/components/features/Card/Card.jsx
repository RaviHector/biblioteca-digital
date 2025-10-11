import { useTheme } from 'styled-components';

import { Card, IconWrapper, Separator, Text, Title } from './Styles';
import { Button } from '../../common';
import { FaPersonWalkingDashedLineArrowRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export default function CardComponent({ data }) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() =>
        navigate('/video', {
          state: {
            video: data?.videoLink,
            backgroundColor: data?.backgroundColor,
          }, // passa o vídeo
        })
      }
      backgroundcolor={data?.backgroundColor}
    >
      <div>
        <Title>{data?.title}</Title>
        <Separator />
        <Text>{data?.description}</Text>
      </div>
      <IconWrapper>{data?.icon && <data.icon />}</IconWrapper>
    </Card>
  );
}
