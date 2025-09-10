import PrivateRouteClient from "./PrivateRouteClient";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <div className="relative flex flex-row w-full h-screen">
      <PrivateRouteClient>
        <div className="flex-1 bg-neutral-50 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </PrivateRouteClient>
    </div>
  );
}
