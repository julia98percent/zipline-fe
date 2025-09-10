import PrivateRoute from "@/components/layout/PrivateRoute";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
