import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: none;
  top: 0;
  left: 0;
  /* padding: 32px 0; */
  width: 100%;
  position: fixed;
  background: #28262e;
  svg {
    color: #999591;
    width: 20px;
    height: 20px;
  }
  @media screen and (max-width: 768px) {
    display: block;
  }
`;
export const HeaderContent = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-right: 1rem;
    border-radius: 50%;
    width: 40px;
  }
  span {
    margin-right: 2rem;
    strong {
      color: #ff9000;
    }
  }

  button {
    background: none;
    border: none;
  }
`;
interface MenuProps {
  show: boolean;
}

export const Menu = styled.div<MenuProps>`
  padding: 1rem;
  position: fixed;
  height: 100vh;
  width: 50%;
  max-width: 350px;
  background-color: #28262e;
  visibility: ${(p) => (p.show ? 'visible' : 'hidden')};

  display: flex;
  flex-direction: column;
  a {
    text-decoration: none;
    color: white;
    + a {
      margin-top: 1rem;
    }
    
  }
`;
