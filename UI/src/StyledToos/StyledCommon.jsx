import styled from 'styled-components';
import Select from 'react-select';


const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 2%; /* เพิ่มช่องว่างระหว่าง radio buttons */
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledRadio = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  background: ${props => (props.checked ? 'tomato' : 'white')};
  border-radius: 50%;
  transition: all 150ms;
  border: 2px solid ${props => (props.disabled ? '#ef7762' : 'tomato')};
  position: relative;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  ${HiddenRadio}:focus + & {
    box-shadow: ${props => (props.disabled ? 'none' : '0 0 0 3px rgba(255, 99, 71, 0.5)')};
  }

  ${HiddenRadio}:hover + & {
    background: ${props => (props.disabled ? 'white' : 'rgba(255, 99, 71, 0.5)')};
  }

  &::after {
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    transition: all 150ms;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${props => (props.checked ? 1 : 0)};
  }
`;

const RadioLabel = styled.label`
  margin-left: 12px;
  font-size: 14px;
  color: ${props => (props.disabled ? '#757170' : '#333')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const RadioButton = ({ id, name, value, checked, onChange, disabled, label }) => (
  <RadioWrapper disabled={disabled}>
    <HiddenRadio
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <StyledRadio checked={checked} disabled={disabled} />
    <RadioLabel htmlFor={id} disabled={disabled}>{label}</RadioLabel>
  </RadioWrapper>
);

const StyledSelect = styled(Select)`
  .react-select__control {
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-family: calibri Light;
  }

  .react-select__menu {
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const StyledTextBox = styled.input.attrs(props => ({
  maxLength: props.maxLength || 100, // กำหนดค่า default maxLength เป็น 100 ถ้าไม่ได้กำหนด props
}))`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: calibri Light;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  &:disabled {
    background-color: #E0E9E7;
    color: #000000;
    border-color: #cccccc;
  }

  &.right-align {
    text-align: right;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 14px;
  font-family: calibri Light;
  color: #333;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }

  &:disabled {
    background-color: #E0E9E7;
    color: #000000;
    border-color: #cccccc;
  }
`;



export { RadioWrapper, HiddenRadio, StyledRadio, RadioLabel, RadioButton, StyledSelect, StyledTextBox, TextArea };
