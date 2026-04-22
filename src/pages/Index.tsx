import { useState } from "react";
import { Sidebar } from "@/components/app/Sidebar";
import { ChatHome } from "@/components/app/ChatHome";
import { ChatCompare } from "@/components/app/ChatCompare";
import { DrawPanel } from "@/components/app/DrawPanel";
import { DrawGallery } from "@/components/app/DrawGallery";
import { SERIES } from "@/lib/mockData";
import { toast } from "sonner";

type Mode = "chat" | "draw";

const Index = () => {
  const [mode, setMode] = useState<Mode>("chat");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Chat state
  const [selected, setSelected] = useState<string[]>(["deepseek", "claude"]);
  const [versionMap, setVersionMap] = useState<Record<string, string>>({});
  const [view, setView] = useState<"home" | "compare">("home");
  const [question, setQuestion] = useState("");

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const setVersion = (id: string, v: string) => setVersionMap((m) => ({ ...m, [id]: v }));

  const replaceSeries = (oldId: string, newId: string) => {
    setSelected((s) => s.map((x) => (x === oldId ? newId : x)));
  };

  const closeColumn = (id: string) => {
    setSelected((s) => s.filter((x) => x !== id));
  };

  const handleSend = (q: string) => {
    setQuestion(q);
    setView("compare");
  };

  const handleNew = () => {
    if (mode === "chat") {
      setView("home");
      setQuestion("");
      setActiveId(null);
    } else {
      setActiveId(null);
      toast.success("已新建绘图任务");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          setView("home");
        }}
        activeId={activeId}
        onSelectItem={setActiveId}
        onNew={handleNew}
      />

      <main className="flex flex-1 overflow-hidden">
        {mode === "chat" ? (
          <div className="flex-1 overflow-hidden">
            {view === "home" ? (
              <ChatHome
                selected={selected}
                versionMap={versionMap}
                onToggle={toggleSelect}
                onSetVersion={setVersion}
                onSend={handleSend}
              />
            ) : (
              <ChatCompare
                selected={selected}
                versionMap={versionMap}
                onSetVersion={setVersion}
                onReplaceSeries={replaceSeries}
                onCloseColumn={closeColumn}
                question={question}
                onSend={(q) => {
                  setQuestion(q);
                  toast.success("已发送追问(演示)");
                }}
              />
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden">
              <DrawGallery />
            </div>
            <DrawPanel onGenerate={() => toast.success("生成完成,已添加到画廊(演示)")} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
