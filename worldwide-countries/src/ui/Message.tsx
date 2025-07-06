'use client';
import styled from 'styled-components';

const StyledMessage = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  width: 80%;
  margin: 2rem auto;
`;

export default function Message({ message }: { message: string }) {
  return <StyledMessage>{message}</StyledMessage>;
}
