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
import {
  Bell,
  BookOpen,
  ChevronDown,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  ListChecks,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { getBaseTypesLabel } from "@/types/user-role";

const nav = [
  {
    href: "/dashboard",
    label: "Painel",
    title: "Painel",
    icon: LayoutDashboard,
    end: true,
  },
  {
    href: "/dashboard/journals",
    label: "Edições de revistas",
    title: "Edições de revistas",
    icon: BookOpen,
    end: false,
  },
  {
    href: "/dashboard/articles",
    label: "Artigos",
    title: "Artigos",
    icon: FileText,
    end: false,
  },
  {
    href: "/dashboard/reviews",
    label: "Avaliações",
    title: "Avaliações",
    icon: ClipboardCheck,
    end: false,
  },
  {
    href: "/dashboard/subscriptions",
    label: "Assinaturas",
    title: "Minha Assinatura",
    icon: Newspaper,
    end: false,
  },
  {
    href: "/dashboard/selections",
    label: "Seleções",
    title: "Seleções",
    icon: ListChecks,
    end: false,
  },
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

  const { logoutAndClear, user } = useAuth();

  const displayName = user?.name ?? "Usuário";
  const baseTypeLabel = getBaseTypesLabel(user?.baseType);

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "US";


  const currentPageLabel = useMemo(() => {
    if (pathname === "/dashboard/profile") return "Meu Perfil";

    const active = nav.find((item) =>
      isActive(pathname, item.href, item.end ?? false)
    );
    return active?.title ?? "Painel";
  }, [pathname]);

  function handleLogout() {
    logoutAndClear()
    router.replace("/login")
  }

  return (
    <SidebarProvider className="min-h-svh w-full" style={sidebarTheme}>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="border-b border-sidebar-border px-7 py-3">
            <span className="text-base font-semibold text-sidebar-foreground">EngeSoft</span>
        </SidebarHeader>
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
          "flex h-14 shrink-0 items-center border-b border-slate-700",
          "bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 px-3 md:px-4"
        )}
      >
        <div className="flex items-center gap-3">
          <SidebarTrigger
            className="text-slate-200 hover:bg-slate-700/60"
            aria-label="Abrir menu"
          />

          <span className="text-base font-semibold tracking-tight text-white md:text-lg">
            {currentPageLabel}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notificações */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-300 hover:bg-slate-700/60 hover:text-white"
          >
            <Bell className="size-4" />
            <span className="absolute right-1 top-1 size-2 rounded-full bg-sky-500" />
          </Button>

          {/* Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto px-2 py-1 text-left hover:bg-slate-700/60"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden md:block leading-tight">
                    <p className="text-xs font-medium text-white">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {baseTypeLabel}
                    </p>
                  </div>

                  <ChevronDown className="hidden md:block size-4 text-slate-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500"
                onClick={handleLogout}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
