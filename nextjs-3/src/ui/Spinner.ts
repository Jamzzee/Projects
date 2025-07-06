'use client';

import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
to {
	transform: rotate(1turn)
}
`;

export const Spinner = styled.div`
  margin: 4.8rem auto;
  width: 6.4rem;
  height: 6.4rem;
  border-radius: var(--border-radius-round);
  background: radial-gradient(
        farthest-side,
        var(--color-brand-600) 94%,
        transparent
      )
      top / 10px 10px no-repeat,
    conic-gradient(transparent 30%, var(--color-brand-600));
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 10px),
    #000
  );
  mask: radial-gradient(farthest-side, transparent calc(100% - 10px), #000);
  animation: ${rotate} 1.5s linear infinite;
`;
