import PropTypes from 'prop-types';

import { Icon, Input, InputWrapper } from './Styles';

export default function SearchInput({
  name,
  placeholder,
  backgroundcolor,
  borderRadius,
  customWidth,
  customColor,
  icon: IconComponent,
}) {
  return (
    <InputWrapper
      customwidth={customWidth}
      custombackgroundcolor={backgroundcolor}
      customborderradius={borderRadius}
    >
      {IconComponent && <Icon as={IconComponent} />}
      <Input
        id={name}
        placeholder={placeholder}
        customcolor={customColor}
        customborderradius={borderRadius}
      />
    </InputWrapper>
  );
}

SearchInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  backgroundcolor: PropTypes.string,
  borderRadius: PropTypes.string,
  icon: PropTypes.elementType,
  customWidth: PropTypes.string.isRequired,
  customColor: PropTypes.string.isRequired,
};

SearchInput.defaultProps = {
  icon: null,
  backgroundcolor: null,
  borderRadius: null,
};
