import { GlobalLayout } from '@/components/GlobalLayout';

export default function WithGlobalLayout({ children }: { children: React.ReactNode }) {
  return <GlobalLayout>{children}</GlobalLayout>;
}
