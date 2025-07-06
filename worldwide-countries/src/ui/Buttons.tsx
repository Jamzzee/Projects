'use client';
import styled, { css } from 'styled-components';
import { ButtonProps, StyledButtonProps } from '@/types/ButtosType';

const buttonStyles = {
  primary: css`
    background-color: var(--color-blue-sky-500);
    color: var(--color-grey-200);

    &:hover {
      background-color: var(--color-blue-700);
      color: var(--color-grey-100);
    }
  `,
  danger: css`
    font-weight: 400;
    letter-spacing: 0.5px;
    background-color: var(--color-red-600);
    color: var(--color-grey-800);

    &:hover {
      background-color: var(--color-red-800);
      color: var(--color-grey-100);
    }

    @media (max-width: 900px) {
      align-self: center;
    }
  `,

  cancel: css`
    background-color: var(--color-grey-300);
    color: var(--color-grey-700);

    &:hover {
      background-color: var(--color-grey-400);
    }
  `,

  neutral: css`
    background-color: var(--color-grey-100);
    color: var(--color-grey-800);

    &:hover {
      background-color: var(--color-grey-200);
    }
  `,
};

const StyledButton = styled.button<StyledButtonProps>`
  font-size: 1.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;

  ${({ $variant }) => buttonStyles[$variant]}
`;

export default function Button({
  children,
  variant = 'primary',
  ...rest
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} {...rest}>
      {children}
    </StyledButton>
  );
}
