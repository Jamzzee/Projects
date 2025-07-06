import styled from 'styled-components';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const StyledToggleIcon = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
`;

export default function ToggleIcon({
  isOpenFilterMenu,
}: {
  isOpenFilterMenu: boolean;
}) {
  return (
    <StyledToggleIcon $isOpen={isOpenFilterMenu}>
      {isOpenFilterMenu ? (
        <FiChevronUp size={20} />
      ) : (
        <FiChevronDown size={20} />
      )}
    </StyledToggleIcon>
  );
}
