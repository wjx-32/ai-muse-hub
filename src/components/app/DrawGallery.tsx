import { useMemo, useState } from "react";
import { Heart, Download, Trash2, X, LayoutGrid, Rows3, ImageIcon, Check } from "lucide-react";
import { DRAW_RECORDS, type DrawImage } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type ViewMode = "detail" | "grid";

export function DrawGallery() {
  const [viewMode, setViewMode] = useState<ViewMode>("detail");
  const [favOnly, setFavOnly] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set(["i1", "i5"]));
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<DrawImage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const records = useMemo(() => {
    if (!favOnly) return DRAW_RECORDS;
    return DRAW_RECORDS.map((r) => ({ ...r, images: r.images.filter((i) => liked.has(i.id)) })).filter((r) => r.images.length > 0);
  }, [favOnly, liked]);

  const allImages = records.flatMap((r) => r.images);

  const toggleLike = (id: string) =>
    setLiked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const togglePick = (id: string) =>
    setPicked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const clearPicked = () => setPicked(new Set());
  const batchDownload = () => toast.success(`已开始下载 ${picked.size} 张图片(模拟)`);
  const batchDelete = () => {
    toast.success(`已删除 ${picked.size} 张图片(模拟)`);
    clearPicked();
    setConfirmDelete(false);
  };
  const downloadOne = () => toast.success("已开始下载(模拟)");

  const renderImage = (img: DrawImage) => {
    const isLiked = liked.has(img.id);
    const isPicked = picked.has(img.id);
    return (
      <div
        key={img.id}
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-muted transition-all",
          isPicked ? "border-primary ring-2 ring-primary/30" : "border-border hover:shadow-md"
        )}
      >
        <button onClick={() => setDetail(img)} className="block w-full">
          <img src={img.url} alt={img.prompt} loading="lazy" className="aspect-square w-full object-cover transition-transform group-hover:scale-105" />
        </button>

        {/* select checkbox */}
        <button
          onClick={() => togglePick(img.id)}
          className={cn(
            "absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border backdrop-blur transition-all",
            isPicked ? "border-primary bg-primary" : "border-white/50 bg-black/30 opacity-0 group-hover:opacity-100"
          )}
        >
          {isPicked && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
        </button>

        {/* actions */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(img.id);
            }}
            className={cn("flex h-7 w-7 items-center justify-center rounded-md backdrop-blur", isLiked ? "bg-destructive/90 text-white" : "bg-black/40 text-white")}
          >
            <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
          </button>
          <button onClick={downloadOne} className="flex h-7 w-7 items-center justify-center rounded-md bg-black/40 text-white backdrop-blur">
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* model tag */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{img.model}</span>
          <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{img.ratio}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold">我的画廊</h1>
          <span className="text-xs text-muted-foreground">{allImages.length} 张图片</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs">
            <input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} className="accent-[hsl(var(--primary))]" />
            <span className="text-muted-foreground">仅展示收藏</span>
          </label>
          <div className="ml-2 flex rounded-md border border-border bg-card p-0.5">
            <button
              onClick={() => setViewMode("detail")}
              className={cn("flex items-center gap-1 rounded px-2 py-1 text-xs", viewMode === "detail" ? "bg-accent text-accent-foreground" : "text-muted-foreground")}
            >
              <Rows3 className="h-3.5 w-3.5" /> 详细
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn("flex items-center gap-1 rounded px-2 py-1 text-xs", viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground")}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> 精简
            </button>
          </div>
        </div>
      </div>

      {/* Batch bar */}
      {picked.size > 0 && (
        <div className="flex items-center justify-between border-b border-border bg-accent/50 px-6 py-2 animate-fade-in">
          <span className="text-xs font-medium">已选择 {picked.size} 张</span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={batchDownload}><Download className="mr-1 h-3.5 w-3.5" />下载</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)} className="text-destructive hover:text-destructive">
              <Trash2 className="mr-1 h-3.5 w-3.5" />删除
            </Button>
            <Button size="sm" variant="ghost" onClick={clearPicked}><X className="mr-1 h-3.5 w-3.5" />取消</Button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
        {records.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="mb-2 h-10 w-10 opacity-40" />
            <p className="text-sm">{favOnly ? "暂无收藏图片" : "暂无图片"}</p>
          </div>
        )}

        {viewMode === "detail" && records.map((r) => (
          <div key={r.id} className="mb-6 last:mb-0">
            <div className="mb-2 flex items-baseline justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{r.prompt}</p>
                <p className="text-xs text-muted-foreground">{r.createdAt} · {r.images.length} 张</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{r.images.map(renderImage)}</div>
          </div>
        ))}

        {viewMode === "grid" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{allImages.map(renderImage)}</div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>图片详情</DialogTitle>
            <DialogDescription className="line-clamp-2">{detail?.prompt}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
              <img src={detail.url} alt={detail.prompt} className="w-full rounded-lg" />
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">模型</div>
                  <div className="font-medium">{detail.model}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">分辨率</div>
                  <div className="font-medium">{detail.resolution}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">宽高比</div>
                  <div className="font-medium">{detail.ratio}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Prompt</div>
                  <p className="mt-1 rounded-md bg-muted p-2 text-xs leading-relaxed">{detail.prompt}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => detail && toggleLike(detail.id)}>
                    <Heart className={cn("mr-1 h-3.5 w-3.5", liked.has(detail.id) && "fill-destructive text-destructive")} />
                    {liked.has(detail.id) ? "已收藏" : "收藏"}
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-primary" onClick={downloadOne}>
                    <Download className="mr-1 h-3.5 w-3.5" /> 下载
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>删除图片</DialogTitle>
            <DialogDescription>确认删除选中的 {picked.size} 张图片?该操作不可撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>取消</Button>
            <Button variant="destructive" onClick={batchDelete}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
