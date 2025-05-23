import { CodeIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserAvatar } from "@/components/user-avatar";

interface AnalyzeLayoutProps {
  children: React.ReactNode;
}

export default function AnalyzeLayout({ children }: AnalyzeLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <CodeIcon className="w-6 h-6" />
            <span className="text-lg font-bold">Analyze</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserAvatar />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
