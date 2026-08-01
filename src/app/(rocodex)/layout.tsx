import { AuthProvider } from "@/components/auth-provider";
import { isAuthConfigured } from "@/lib/auth-availability";
import { rocodexMetadata } from "@/sites/rocodex/metadata";

export const metadata = rocodexMetadata;

export default function RocoDexLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider enabled={isAuthConfigured()}>
      <div className="min-h-screen bg-[#f7f6f1] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </div>
    </AuthProvider>
  );
}
