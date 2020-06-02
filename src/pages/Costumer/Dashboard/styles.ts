import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div``;

export const Header = styled.header`
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

export const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;
  display: flex;
`;

export const Schedule = styled.div`
  flex: 1;

  h1 {
    font-size: 36px;
  }

  p {
    margin-top: 8px;
    color: #ff9000;
    display: flex;
    align-items: center;
    font-weight: 500;

    span {
      display: flex;
      align-items: center;
    }

    span + span::before {
      content: '';
      width: 1px;
      height: 12px;
      background: #ff9000;
      margin: 0px 8px;
    }
  }
`;

export const Section = styled.div`
  margin-top: 48px;

  > strong {
    color: #999591;
    font-size: 20px;
    line-height: 26px;
    border-bottom: 1px solid #3e3b47;
    display: block;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  > p {
    color: #999591;
  }
`;

export const Appointment = styled.div`
  display: flex;
  align-items: center;

  & + div {
    margin-top: 2rem;
  }
  span {
    margin-left: auto;
    display: flex;
    align-items: center;
    color: #f4ede8;
    font-family: 'Roboto Slab';
    color: #ff9000;
    svg {
      color: #ff9000;
      margin-right: 8px;
    }
  }

   > div {
    flex: 1;
    background: #3e3b47;
    display: flex;
    align-items: center;
    padding: 1rem 1rem;
    border-radius: 10px;
    margin-left: 1.5rem;

    div {
      display: flex;
      align-items: center;
    }
    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }
    & > strong {
      color: white;
    }
    strong {
      margin-left: 24px;
      font-size: 20px;
    }
  }
`;
