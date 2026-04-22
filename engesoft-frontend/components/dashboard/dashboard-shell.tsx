"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth.service";
import { BookOpen, ClipboardCheck, FileText, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, end: true },
  { href: "/dashboard/journals", label: "Edições de revistas", icon: BookOpen },
  { href: "/dashboard/articles", label: "Artigos", icon: FileText },
  { href: "/dashboard/reviews", label: "Avaliações", icon: ClipboardCheck },
  { href: "/dashboard/selections", label: "Seleções", icon: ListChecks },
] as const;

function isActive(pathname: string, href: string, end?: boolean) {
  if (end) return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Slate palette (Tailwind-aligned oklch) */
const sidebarTheme = {
  "--sidebar": "oklch(0.129 0.042 264.695)",
  "--sidebar-foreground": "oklch(0.984 0.003 247.858)",
  "--sidebar-primary": "oklch(0.446 0.043 257.281)",
  "--sidebar-primary-foreground": "oklch(0.984 0.003 247.858)",
  "--sidebar-accent": "oklch(0.279 0.041 260.031)",
  "--sidebar-accent-foreground": "oklch(0.984 0.003 247.858)",
  "--sidebar-border": "oklch(0.372 0.044 257.287)",
  "--sidebar-ring": "oklch(0.554 0.046 257.417)",
} as React.CSSProperties;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setAuthenticated } = useAuth();

  function handleLogout() {
    logout();
    setAuthenticated(false);
    router.replace("/login");
  }

  return (
    <SidebarProvider className="min-h-svh w-full" style={sidebarTheme}>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="border-b border-sidebar-border px-3 py-4" />
        <SidebarContent className="gap-2 px-1">
          <SidebarGroup className="py-1">
            <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
              Principal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {nav.map((item) => {
                  const { href, label, icon: Icon } = item;
                  const end = "end" in item ? item.end : false;
                  const active = isActive(pathname, href, end);
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={label}
                        className="h-11 min-h-11 gap-3 py-2.5 text-base [&_svg]:size-5"
                      >
                        <Link href={href}>
                          <Icon />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header
          className={cn(
            "flex h-14 shrink-0 items-center gap-2 border-b border-slate-600",
            "bg-linear-to-br from-slate-800 to-slate-700 px-3 md:gap-3 md:px-4",
          )}
        >
          <SidebarTrigger
            className="text-slate-50 hover:bg-slate-600/50 md:flex"
            aria-label="Abrir menu"
          />
          <span className="text-lg font-bold tracking-tight text-slate-50 md:text-xl">
            EngeSoft
          </span>
          <Button
            type="button"
            className="ml-auto bg-slate-600 text-slate-50 hover:bg-slate-500 cursor-pointer"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto bg-linear-to-br from-slate-300 to-slate-100 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
