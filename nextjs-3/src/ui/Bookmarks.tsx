import styled from 'styled-components';
import { PiBookmarkSimple, PiBookmarkSimpleFill } from 'react-icons/pi';
import { useBookmarks } from '@/context/BookmarksContext';
import Link from 'next/link';

const HeaderBookmarks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 2.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
  color: var(--color-grey-100);

  &:hover {
    color: var(--color-grey-0);
  }

  &:hover svg {
    transform: scale(1.15);
  }

  svg {
    font-size: 2.6rem;
    transition: transform 0.3s;
  }
`;

const BookmarkTitle = styled.h2`
  font-size: 1.9rem;
  color: inherit;
`;

const BookmarkInfo = styled.span`
  background-color: var(--color-green-100);
  color: var(--color-grey-900);
  font-size: 1.3rem;
  line-height: 1.2;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-round);
  margin-left: 0.8rem;
`;

export default function Bookmarks() {
  const { bookmarks } = useBookmarks();
  const hasBookmarks = bookmarks.length > 0;

  return (
    <Link href="/favorites" prefetch={true} passHref>
      <HeaderBookmarks>
        <BookmarkTitle>Bookmarks</BookmarkTitle>
        {hasBookmarks ? <PiBookmarkSimpleFill /> : <PiBookmarkSimple />}
        {hasBookmarks && <BookmarkInfo>{bookmarks.length}</BookmarkInfo>}
      </HeaderBookmarks>
    </Link>
  );
}
