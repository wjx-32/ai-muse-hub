import { useEffect, useRef, useState } from "react";
import { ChevronDown, X, Send, Globe, Paperclip, Copy, RefreshCw, ThumbsUp, Flame, User } from "lucide-react";
import { SERIES, SAMPLE_REPLIES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  selected: string[];
  versionMap: Record<string, string>;
  onSetVersion: (id: string, v: string) => void;
  onReplaceSeries: (oldId: string, newId: string) => void;
  onCloseColumn: (id: string) => void;
  question: string;
  onSend: (q: string) => void;
}

type Turn = { q: string; replies: Record<string, string> };

export function ChatCompare({ selected, versionMap, onSetVersion, onReplaceSeries, onCloseColumn, question, onSend }: Props) {
  const [followup, setFollowup] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSeries, setOpenSeries] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Reset turns when the initial question changes (new conversation)
  useEffect(() => {
    if (!question) return;
    const replies: Record<string, string> = {};
    selected.forEach((id) => {
      replies[id] = SAMPLE_REPLIES[id]?.[0] ?? "（演示回答）这是该模型的示例输出内容。";
    });
    setTurns([{ q: question, replies }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setOpenSeries(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleFollowup = (q: string) => {
    const replies: Record<string, string> = {};
    selected.forEach((id) => {
      const list = SAMPLE_REPLIES[id] ?? [];
      replies[id] = list[turns.length % list.length] ?? list[0] ?? "（演示回答）继续追问的示例输出。";
    });
    setTurns((t) => [...t, { q, replies }]);
    onSend(q);
  };

  return (
    <div className="flex h-full flex-col">

      {/* Columns */}
      <div ref={ref} className="flex-1 overflow-hidden">
        <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${Math.max(selected.length, 1)}, minmax(0, 1fr))` }}>
          {selected.map((id) => {
            const s = SERIES.find((x) => x.id === id)!;
            const ver = versionMap[id] ?? s.versions[0].name;
            const currentVer = s.versions.find((x) => x.name === ver) ?? s.versions[0];
            return (
              <div key={id} className="flex h-full flex-col border-r border-border last:border-r-0">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-border bg-card/30 px-3 py-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white" style={{ backgroundColor: s.color }}>
                    {s.name[0]}
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <button
                      onClick={() => {
                        setOpenSeries(openSeries === id ? null : id);
                        setOpenMenu(null);
                      }}
                      className="flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-left text-sm font-semibold hover:bg-muted"
                    >
                      <span className="truncate">{s.name}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                    {openSeries === id && (
                      <div className="absolute left-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-md border border-border bg-popover shadow-lg animate-fade-in">
                        <div className="px-3 py-1.5 text-xs text-muted-foreground">替换系列</div>
                        {SERIES.map((opt) => (
                          <button
                            key={opt.id}
                            disabled={selected.includes(opt.id) && opt.id !== id}
                            onClick={() => {
                              if (opt.id !== id) onReplaceSeries(id, opt.id);
                              setOpenSeries(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: opt.color }} />
                            {opt.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setOpenMenu(openMenu === id ? null : id);
                        setOpenSeries(null);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                    >
                      <span className="max-w-[100px] truncate">{ver}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {openMenu === id && (
                      <div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-md border border-border bg-popover shadow-lg animate-fade-in">
                        {s.versions.map((v) => (
                          <button
                            key={v.name}
                            onClick={() => {
                              onSetVersion(id, v.name);
                              setOpenMenu(null);
                            }}
                            className={cn("flex w-full flex-col items-start gap-1 px-3 py-2 text-left text-xs hover:bg-accent", v.name === ver && "bg-accent text-accent-foreground")}
                          >
                            <div className="flex w-full items-center gap-1.5">
                              <span className="font-medium">{v.name}</span>
                              {v.recommended && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                  <Flame className="h-2.5 w-2.5" />推荐
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {v.tags.map((t) => (
                                <span key={t} className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => onCloseColumn(id)} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="关闭">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Multi-turn answers */}
                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 scrollbar-thin">
                  {turns.map((turn, idx) => (
                    <div key={idx} className="space-y-2">
                      {/* User question bubble */}
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-foreground">
                          {turn.q}
                        </div>
                      </div>
                      {/* Assistant reply */}
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: s.color }}>
                          {s.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="rounded-lg bg-muted/40 p-3 text-sm text-foreground/90">
                            {idx === 0 && (
                              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                <span className="text-xs text-muted-foreground">{ver}</span>
                                {currentVer.tags.map((t) => (
                                  <span key={t} className="rounded border border-border bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                                ))}
                              </div>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">{turn.replies[id] ?? "（演示回答）"}</p>
                          </div>
                          <div className="mt-1.5 flex gap-1">
                            <button className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                            <button className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><RefreshCw className="h-3.5 w-3.5" /></button>
                            <button className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><ThumbsUp className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {selected.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">所有模型已关闭,请返回首页重新选择</div>
          )}
        </div>
      </div>

      {/* Followup input */}
      <div className="border-t border-border bg-background px-6 py-3">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Textarea
            value={followup}
            onChange={(e) => setFollowup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (followup.trim()) {
                  onSend(followup.trim());
                  setFollowup("");
                }
              }
            }}
            placeholder="继续提问..."
            className="min-h-[44px] resize-none border-0 bg-transparent p-2 text-sm shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center gap-1 px-1">
            <button className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted">
              <Globe className="h-3 w-3" /> 联网
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted">
              <Paperclip className="h-3 w-3" /> 附件
            </button>
            <Button
              size="sm"
              onClick={() => {
                if (followup.trim()) {
                  onSend(followup.trim());
                  setFollowup("");
                }
              }}
              disabled={!followup.trim() || selected.length === 0}
              className="ml-auto bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
