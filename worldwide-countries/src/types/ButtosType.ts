import { ButtonHTMLAttributes, ElementType } from 'react';

type ButtonVariant = 'primary' | 'danger' | 'cancel' | 'neutral';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  as?: ElementType;
}

export type StyledButtonProps = {
  $variant: ButtonVariant;
};
