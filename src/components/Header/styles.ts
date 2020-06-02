import styled from 'styled-components';

export const HeaderContainer = styled.header`
  padding: 32px 0;
  background: #28262e;
`;
export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;

  > img {
    height: 80px;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
    }
  }
`;
export const HeaderLinkContent = styled.div`
  flex: 1;
  margin-right: 2rem;
  a {
    float: right;
    color: white;
    transition: 0.1s ease-in;
    :hover {
      color: #ff9000;
    }
  }
  a + a {
    margin-right: 1.5rem;
  }
`;
export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5rem;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    a {
      text-decoration: none;
      color: #ff9000;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;
