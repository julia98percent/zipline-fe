import GuestRoute from "@/components/layout/GuestRoute";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestRoute>{children}</GuestRoute>;
}