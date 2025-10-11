import styled from 'styled-components';

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) =>
    ![
      'flexDirection',
      'marginTop',
      'marginLeft',
      'minWidth',
      'maxWidth',
      'minHeight',
      'maxHeight',
      'paddingTop',
      'paddingLeft',
      'paddingRight',
      'paddingBottom',
      'height',
      'gap',
      'width',
      'color',
      'backgroundColor',
      'borderWidth',
      'borderColor',
      'borderStyle',
      'borderRadius',
      'boxShadow',
      'fontSize',
      'textDecoration',
      'fontWeight',
      'hoverBackgroundColor',
      'hoverBorderColor',
      'hoverColor',
      'hoverColor990',
      'hoverBorderColor990',
      'hoverBackgroundColor990',
      'fontSize990',
      'paddingTop990',
      'paddingLeft990',
      'paddingRight990',
      'paddingBottom990',
      'borderColor990',
      'backgroundColor990',
      'color990',
      'fontSize800',
      'paddingTop800',
      'paddingLeft800',
      'paddingRight800',
      'paddingBottom800',
      'borderColor800',
      'backgroundColor800',
      'color800',
    ].includes(prop), // 🔥 bloqueia props customizadas
})`
  display: flex;
  flex-direction: ${(props) => props.flexDirection};
  align-items: center;
  justify-content: center;

  margin-top: ${(props) => props.marginTop};
  margin-left: ${(props) => props.marginLeft};
  min-width: ${(props) => props.minWidth};
  max-width: ${(props) => props.maxWidth};
  min-height: ${(props) => props.minHeight};
  max-height: ${(props) => props.maxHeight};
  padding-top: ${(props) => props.paddingTop ?? '0.7rem'};
  padding-left: ${(props) => props.paddingLeft ?? '3rem'};
  padding-right: ${(props) => props.paddingRight ?? '3rem'};
  padding-bottom: ${(props) => props.paddingBottom ?? '0.7rem'};
  height: ${(props) => props.height};
  gap: ${(props) => props.gap};
  width: ${(props) => props.width};

  color: ${(props) => props.color ?? props.theme.colors.font.black};
  background-color: ${(props) =>
    props.backgroundColor ?? props.theme.colors.font.black};
  border-width: ${(props) => props.borderWidth ?? '0.15rem'};
  border-color: ${(props) => props.borderColor ?? props.theme.colors.white};
  border-style: ${(props) => props.borderStyle ?? 'solid'};
  border-radius: ${(props) => props.borderRadius ?? '0.4rem'};
  box-shadow: ${(props) => props.boxShadow ?? 'none'};
  cursor: pointer;

  font-family: ${(props) => props.theme.fonts.montserrat};
  font-size: ${(props) => props.fontSize};
  text-decoration: ${(props) => props.textDecoration ?? 'none'};
  text-align: center;
  font-weight: ${(props) => props.fontWeight};

  &:hover {
    background-color: ${(props) =>
      props.hoverBackgroundColor ?? props.theme.colors.darkGreen};
    border-color: ${(props) => props.hoverBorderColor};
    color: ${(props) => props.hoverColor ?? 'white'};

    @media (max-width: 990px) {
      color: ${(props) => props.hoverColor990};
      border-color: ${(props) => props.hoverBorderColor990};
      background-color: ${(props) => props.hoverBackgroundColor990};
    }
  }

  @media (max-width: 990px) {
    font-size: ${(props) => props.fontSize990 ?? '1.8rem'};
    padding-top: ${(props) => props.paddingTop990 ?? '0.5rem'};
    padding-left: ${(props) => props.paddingLeft990 ?? '2rem'};
    padding-right: ${(props) => props.paddingRight990 ?? '2rem'};
    padding-bottom: ${(props) => props.paddingBottom990 ?? '0.5rem'};
    border-color: ${(props) => props.borderColor990};
    background-color: ${(props) => props.backgroundColor990};
    color: ${(props) => props.color990};
  }

  @media (max-width: 800px) {
    font-size: ${(props) => props.fontSize800 ?? '1.8rem'};
    padding-top: ${(props) => props.paddingTop800 ?? '0.5rem'};
    padding-left: ${(props) => props.paddingLeft800 ?? '2rem'};
    padding-right: ${(props) => props.paddingRight800 ?? '2rem'};
    padding-bottom: ${(props) => props.paddingBottom800 ?? '0.5rem'};
    border-color: ${(props) => props.borderColor800};
    background-color: ${(props) => props.backgroundColor800};
    color: ${(props) => props.color800};
  }
`;

export default Button;
