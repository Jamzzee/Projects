import Link from 'next/link';
import Button from './Buttons';
import Message from './Message';

export default function EmptyBookmarks() {
  return (
    <>
      <Message message="No bookmarked countries yet." />
      <Link href="/">
        <Button variant="neutral">&larr; back</Button>
      </Link>
    </>
  );
}
