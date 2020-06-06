import React, { useRef, useEffect, useCallback, useState } from 'react';
import ReactSelect, {
  OptionTypeBase,
  Props as SelectProps,
} from 'react-select';
import { useField } from '@unform/core';
import { Container, Error } from './styles';
import { IconBaseProps } from 'react-icons/lib/cjs';
import { FiAlertCircle } from 'react-icons/fi';

interface Props extends SelectProps<OptionTypeBase> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  containerStyle?: object;
}
export interface SelectOption {
  label: string;
  value: number | string;
}
const Select: React.FC<Props> = ({ name, icon: Icon, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const selectRef = useRef(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  const handleInputFocus = useCallback(() => setIsFocused(true), []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!selectRef.current);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'state.value',
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }
          return ref.state.value.map((option: OptionTypeBase) => option.value);
        } else {
          if (!ref.state.value) {
            return '';
          }
          return ref.state.value.value;
        }
      },
    });
  }, [fieldName, registerField, rest.isMulti]);
  return (
    <Container
      style={rest.containerStyle}
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
    >
      {Icon && <Icon size={20} />}
      <ReactSelect
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        styles={{
          singleValue: (s, p) => ({ color: 'white' }),
          container: (s, p) => ({
            width: '100%',
            outline: 'none',
            border: 'none',
          }),
          control: (s, p) => ({
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }),
          menu: (s, p) => ({ width: '100%', marginTop: '1rem' }),
          option: (s, p) => ({
            marginTop: '.5rem',
            padding: '1rem',
            backgroundColor: '#3e3b47',
            borderRadius: '10px',
          }),
          indicatorSeparator: (s, p) => ({ padding: 0, margin: 0 }),
          indicatorsContainer: (s, p) => ({ margin: 0, padding: 0 }),
          dropdownIndicator: (s, p) => ({
            ...s,
            margin: '0',
          }),
        }}
        defaultValue={defaultValue}
        ref={selectRef}
        classNamePrefix="react-select"
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};
export default Select;
