import { Plus, MessageSquare, ImageIcon, Settings, Sun, Moon, User, Sparkles } from "lucide-react";
import { CHAT_HISTORY, DRAW_RECORDS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

type Mode = "chat" | "draw";

interface Props {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  activeId: string | null;
  onSelectItem: (id: string) => void;
  onNew: () => void;
}

export function Sidebar({ mode, onModeChange, activeId, onSelectItem, onNew }: Props) {
  const { theme, toggle } = useTheme();
  const items =
    mode === "chat"
      ? CHAT_HISTORY.map((c) => ({ id: c.id, title: c.title, sub: c.time }))
      : DRAW_RECORDS.map((r) => ({ id: r.id, title: r.prompt, sub: `${r.createdAt} · ${r.images.length} 张` }));

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold tracking-tight">ModelHub</span>
      </div>

      {/* Mode switch */}
      <div className="mx-3 mb-3 grid grid-cols-2 gap-1 rounded-lg bg-sidebar-accent p-1">
        <button
          onClick={() => onModeChange("chat")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all",
            mode === "chat" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" /> 对话
        </button>
        <button
          onClick={() => onModeChange("draw")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all",
            mode === "draw" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ImageIcon className="h-3.5 w-3.5" /> 绘图
        </button>
      </div>

      {/* New button */}
      <div className="px-3">
        <Button onClick={onNew} className="w-full justify-start gap-2 bg-gradient-primary text-primary-foreground hover:opacity-90" size="sm">
          <Plus className="h-4 w-4" />
          {mode === "chat" ? "新建对话" : "新建绘图"}
        </Button>
      </div>

      {/* List */}
      <div className="mt-4 flex-1 overflow-y-auto px-2 scrollbar-thin">
        <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">{mode === "chat" ? "历史对话" : "绘图记录"}</div>
        <ul className="space-y-0.5">
          {items.map((it) => (
            <li key={it.id}>
              <button
                onClick={() => onSelectItem(it.id)}
                className={cn(
                  "group w-full rounded-md px-3 py-2 text-left transition-colors",
                  activeId === it.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
                )}
              >
                <div className="line-clamp-1 text-sm">{it.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{it.sub}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer / user */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-sidebar-accent/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium">访客用户</div>
            <div className="text-xs text-muted-foreground">对话 28 · 绘图 12</div>
          </div>
          <button onClick={toggle} className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground" aria-label="切换主题">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground" aria-label="设置">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
