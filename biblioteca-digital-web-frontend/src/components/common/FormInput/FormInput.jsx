import PropTypes from "prop-types";

import {
  Container,
  Label,
  InputWrapper,
  Input,
  ErrorMessage,
  Icon,
} from "./Styles";

export default function FormInput({
  name,
  label,
  placeholder,
  errors,
  register,
  backgroundcolor,
  borderRadius,
  type,
  icon: IconComponent,
}) {
  const errorMessage = errors?.[name]?.message;

  return (
    <Container>
      <Label htmlFor={name}>{label}</Label>
      <InputWrapper>
        {IconComponent && <Icon as={IconComponent} />}
        <Input
          id={name}
          type={type}
          error={!!errorMessage}
          placeholder={placeholder}
          {...register(name)}
          backgroundcolor={backgroundcolor}
          borderradius={borderRadius}
        />
      </InputWrapper>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
}

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  backgroundcolor: PropTypes.string,
  borderRadius: PropTypes.string,
  icon: PropTypes.elementType,
};

FormInput.defaultProps = {
  icon: null,
  backgroundcolor: null,
  borderRadius: null,
};
