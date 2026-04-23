import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, X, Paperclip, Send, Globe, Sparkles, Flame } from "lucide-react";
import { SERIES, MODEL_CATEGORIES, type ModelSeries } from "@/lib/mockData";
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
  const [category, setCategory] = useState<string>("all");
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

  const filteredSeries = useMemo(() => {
    if (category === "all") return SERIES;
    if (category === "recommend") return SERIES;
    const map: Record<string, string> = {
      reasoning: "推理模型",
      domestic: "国内模型",
      oversea: "海外模型",
      multimodal: "多模态",
      long: "长文本",
      flagship: "旗舰模型",
    };
    const tag = map[category];
    return SERIES.filter((s) => s.versions.some((v) => v.tags.includes(tag)));
  }, [category]);

  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col px-6 py-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-glow" />

      {/* Hero */}
      <div className="relative mb-4 text-center animate-fade-in">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3 w-3 text-primary" />
          多模型并行对比 · 一次提问 · 三方解答
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          选择模型,开启 <span className="text-gradient">智能对话</span>
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground">最多同时选择 {MAX} 个模型系列进行对比</p>
      </div>

      {/* Category filter */}
      <div className="relative mb-3 flex flex-wrap items-center justify-center gap-1.5">
        {MODEL_CATEGORIES.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                active
                  ? "border-primary bg-gradient-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="text-sm leading-none">{c.emoji}</span>
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Models grid - compact horizontal cards */}
      <div className="relative grid flex-1 grid-cols-1 gap-2.5 overflow-y-auto pb-4 sm:grid-cols-2 lg:grid-cols-3 scrollbar-thin">
        {filteredSeries.map((s) => {
          const checked = selected.includes(s.id);
          const v = versionMap[s.id] ?? s.versions[0].name;
          const open = openDropdown === s.id;
          return (
            <div
              key={s.id}
              className={cn(
                "group relative rounded-xl border bg-card p-3 transition-all hover:shadow-md",
                checked ? "border-primary ring-2 ring-primary/20 shadow-sm" : "border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <button onClick={() => handleToggle(s)} className="flex flex-1 items-start gap-3 text-left min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: s.color }}>
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-semibold">{s.name}</h3>
                      {checked && (
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                      )}
                      <span className="ml-1 truncate text-[11px] text-muted-foreground">{s.vendor}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </button>

                {/* Version selector on the right */}
                <div className="relative shrink-0" ref={open ? dropdownRef : undefined}>
                  <button
                    onClick={() => setOpenDropdown(open ? null : s.id)}
                    className="flex max-w-[160px] items-center gap-1 rounded-full border border-border bg-background/50 px-2.5 py-1 text-xs hover:bg-muted"
                  >
                    <span className="truncate font-medium">{v}</span>
                    <ChevronDown className={cn("h-3 w-3 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
                  </button>
                  {open && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-md border border-border bg-popover shadow-lg animate-fade-in">
                      {s.versions.map((ver) => (
                        <button
                          key={ver.name}
                          onClick={() => {
                            onSetVersion(s.id, ver.name);
                            setOpenDropdown(null);
                          }}
                          className={cn("flex w-full flex-col items-start gap-1 px-3 py-2 text-xs hover:bg-accent", v === ver.name && "bg-accent text-accent-foreground")}
                        >
                          <div className="flex w-full items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium">{ver.name}</span>
                              {ver.recommended && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                  <Flame className="h-2.5 w-2.5" />推荐
                                </span>
                              )}
                            </div>
                            {v === ver.name && <Check className="h-3 w-3 shrink-0" />}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {ver.tags.map((t) => (
                              <span key={t} className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
            const ver = versionMap[id] ?? s.versions[0].name;
            return (
              <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{ver}</span>
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
            <Button size="sm" onClick={send} disabled={!input.trim() || selected.length === 0} className="ml-auto bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-40">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
