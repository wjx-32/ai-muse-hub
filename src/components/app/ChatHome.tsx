import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, X, Search, Paperclip, Send, Globe, Sparkles } from "lucide-react";
import { SERIES, type ModelSeries } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  selected: string[];
  versionMap: Record<string, string>;
  onToggle: (id: string) => void;
  onSetVersion: (id: string, v: string) => void;
  onSend: (input: string) => void;
}

const MAX = 3;

export function ChatHome({ selected, versionMap, onToggle, onSetVersion, onSend }: Props) {
  const [input, setInput] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [web, setWeb] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleToggle = (s: ModelSeries) => {
    if (!selected.includes(s.id) && selected.length >= MAX) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onToggle(s.id);
  };

  const send = () => {
    if (!input.trim() || selected.length === 0) return;
    onSend(input.trim());
  };

  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col px-6 py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-glow" />

      {/* Hero */}
      <div className="relative mb-8 text-center animate-fade-in">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3 w-3 text-primary" />
          多模型并行对比 · 一次提问 · 三方解答
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          选择模型,开启 <span className="text-gradient">智能对话</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">最多同时选择 {MAX} 个模型系列进行对比</p>
      </div>

      {/* Models grid */}
      <div className="relative grid flex-1 grid-cols-1 gap-3 overflow-y-auto pb-4 sm:grid-cols-2 lg:grid-cols-3 scrollbar-thin">
        {SERIES.map((s) => {
          const checked = selected.includes(s.id);
          const v = versionMap[s.id] ?? s.versions[0];
          const open = openDropdown === s.id;
          return (
            <div
              key={s.id}
              className={cn(
                "group relative rounded-xl border bg-card p-4 transition-all hover:shadow-md",
                checked ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-border"
              )}
            >
              <button onClick={() => handleToggle(s)} className="flex w-full items-start gap-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: s.color }}>
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold">{s.name}</h3>
                    <span className="text-xs text-muted-foreground">{s.vendor}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{s.description}</p>
                </div>
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                    checked ? "border-primary bg-primary" : "border-border"
                  )}
                >
                  {checked && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </button>

              {/* Version selector */}
              <div className="relative mt-3" ref={open ? dropdownRef : undefined}>
                <button
                  onClick={() => setOpenDropdown(open ? null : s.id)}
                  className="flex w-full items-center justify-between rounded-md border border-border bg-background/50 px-3 py-1.5 text-xs hover:bg-muted"
                >
                  <span className="truncate">{v}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
                </button>
                {open && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-border bg-popover shadow-lg animate-fade-in">
                    {s.versions.map((ver) => (
                      <button
                        key={ver}
                        onClick={() => {
                          onSetVersion(s.id, ver);
                          setOpenDropdown(null);
                        }}
                        className={cn("flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-accent", v === ver && "bg-accent text-accent-foreground")}
                      >
                        {ver}
                        {v === ver && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="relative mt-4">
        {/* chips + counter */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {selected.map((id) => {
            const s = SERIES.find((x) => x.id === id)!;
            return (
              <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
                <button onClick={() => onToggle(id)} className="rounded-full hover:bg-foreground/10">
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          <span className={cn("ml-auto text-xs text-muted-foreground", shake && "animate-shake text-destructive font-medium")}>
            {selected.length} / {MAX}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-2 shadow-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={selected.length ? "输入你的问题,Enter 发送..." : "请先在上方选择至少一个模型"}
            className="min-h-[60px] resize-none border-0 bg-transparent p-2 text-sm shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center gap-1 px-1 pt-1">
            <button
              onClick={() => setWeb((w) => !w)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
                web ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <Globe className="h-3 w-3" /> 联网
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted">
              <Paperclip className="h-3 w-3" /> 附件
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted">
              <Search className="h-3 w-3" /> 模板
            </button>
            <Button size="sm" onClick={send} disabled={!input.trim() || selected.length === 0} className="ml-auto bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-40">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
