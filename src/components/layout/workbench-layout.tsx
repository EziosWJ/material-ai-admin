import { Outlet, Link, useLocation } from "react-router-dom";
import { ArrowLeft, MessageSquareText, PenLine, Home } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const workbenchNavItems = [
  {
    label: "工作台首页",
    path: "/workbench",
    icon: Home,
  },
  {
    label: "材料问答",
    path: "/workbench/chat",
    icon: MessageSquareText,
  },
  {
    label: "辅助写作",
    path: "/workbench/writing",
    icon: PenLine,
  },
];

export function WorkbenchLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/workbench") {
      return location.pathname === "/workbench";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              aria-label="返回后台管理"
              title="返回后台管理"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Button>
          </Link>

          <div className="hidden h-6 w-px bg-border md:block" />

          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-text-primary">
              本地化智能材料写作平台
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {workbenchNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition-colors",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}
