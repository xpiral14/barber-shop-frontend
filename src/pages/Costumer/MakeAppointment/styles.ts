import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div``;
export const Content = styled.div`
  display: flex;
  align-items: center;
  width: 340px;
  margin: 0 auto;
  > div {
    width: 100%;
    display: flex;
    flex-direction: column;
    button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      img {
        height: 3rem;
        border-radius: 50%;
      }
      + button {
        margin-top: 1rem;
      }
    }
  }
`;

export const ContentStep = styled.div``;

interface ButtonProps {
  active?: boolean;
}
export const Button = styled.button<ButtonProps>`
  justify-content: center;
  border: 2px solid #3e3b47;
  padding: 1rem;
  border: 2px solid ${(p) => (p?.active ? `#ff9000` : '#3e3b47')};
  background-color: ${(p) => (!p?.active ? '#3e3b47' : '#28262E')};
  border-radius: 10px;
  color: #ff9000;
`;

export const ContentNavigationButton = styled.div`
  margin-top: 1rem;
`;

export const ButtonNavigation = styled.button`
  padding: 1rem;
  border-radius: 10px;
  background-color: #ff9000;
  color: #3e3b47;
  border: 2px solid #ff9000;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  :focus {
    border-color: #3e3b47;
    background: ${darken(0.03, '#ff9000')};
  }
`;
