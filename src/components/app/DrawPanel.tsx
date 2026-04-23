import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { DRAW_MODELS, RATIOS, RESOLUTIONS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  onGenerate: () => void;
}

export function DrawPanel({ onGenerate }: Props) {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(2);
  const MAX_COUNT = 8;
  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1024×1024");
  const [models, setModels] = useState<string[]>(["nano-pro"]);
  const [loading, setLoading] = useState(false);

  const total = count * models.length;

  const toggle = (id: string) => setModels((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const start = () => {
    if (!prompt.trim() || models.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGenerate();
    }, 1400);
  };

  return (
    <aside className="flex h-full w-80 flex-col border-l border-border bg-card/30">
      <div className="border-b border-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> 绘图参数
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin">
        {/* Prompt */}
        <div>
          <label className="mb-1.5 block text-xs font-medium">提示词</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要的画面,例如:夕阳下的海边小屋,水彩风格"
            className="min-h-[110px] resize-none text-sm"
          />
        </div>

        {/* Count */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium">每个模型生成数量</label>
            <span className="text-xs text-primary font-semibold">{count} / {MAX_COUNT}</span>
          </div>
          <input
            type="range"
            min={1}
            max={MAX_COUNT}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full accent-[hsl(var(--primary))]"
          />
        </div>

        {/* Ratio */}
        <div>
          <label className="mb-1.5 block text-xs font-medium">宽高比</label>
          <div className="grid grid-cols-3 gap-1.5">
            {RATIOS.map((r) => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs transition-colors",
                  ratio === r ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div>
          <label className="mb-1.5 block text-xs font-medium">分辨率</label>
          <div className="grid grid-cols-2 gap-1.5">
            {RESOLUTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setResolution(r)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs transition-colors",
                  resolution === r ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Models */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium">选择模型</label>
            <span className="text-xs text-muted-foreground">已选 {models.length}</span>
          </div>
          <div className="space-y-1">
            {DRAW_MODELS.map((m) => {
              const active = models.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  )}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.vendor}</div>
                  </div>
                  <div className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border", active ? "border-primary bg-primary" : "border-border")}>
                    {active && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background/50 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>预计生成</span>
          <span className="font-semibold text-foreground">{total} 张</span>
        </div>
        <Button
          onClick={start}
          disabled={!prompt.trim() || models.length === 0 || loading}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 生成中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> 开始生成
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
