import SideNavigation from '@/app/_components/SideNavigation';

export default function Layout({ children }) {
  return (
    <div className="max-h-[50dvh] lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12">
      <SideNavigation />
      <div className="py-1">{children}</div>
    </div>
  );
}
