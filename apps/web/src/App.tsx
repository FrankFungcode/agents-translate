import { TranslatePanel } from './components/TranslatePanel';

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(255,122,89,0.14),_transparent_26%),linear-gradient(180deg,#f7fbff_0%,#eef4f8_46%,#e9f0f6_100%)] text-ink">
      <header className="mx-auto w-full max-w-7xl flex-none px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/65 bg-white/70 px-5 py-5 shadow-soft backdrop-blur sm:px-6 sm:py-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex rounded-full bg-signal/10 px-4 py-2 text-xs font-medium text-signal">
              面向产品经理与开发工程师的双向沟通翻译助手
            </div>
            <h1 className="mt-4 text-lg font-semibold leading-tight whitespace-nowrap sm:text-xl lg:text-2xl">
              把 PM 与开发之间的表达差异，翻译成彼此都能直接行动的语言。
            </h1>
            <p className="mt-3 text-[11px] leading-5 text-slate-600 whitespace-nowrap sm:text-xs lg:text-sm">
              聚焦三条路径：PM {'->'} DEV、DEV {'->'} PM、AUTO 自动识别。支持流式输出和会话隔离，让需求、方案、风险与待确认项都能快速转成对方看得懂、接得住的表达。
            </p>
          </div>
          <div className="mt-5 flex flex-nowrap items-stretch gap-2 overflow-hidden">
            <div className="min-w-0 flex-1 rounded-[18px] border border-slate-200/70 bg-white/85 px-3 py-2.5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">PM → DEV</div>
              <p className="mt-1 text-[11px] leading-4 text-slate-600 whitespace-nowrap">把业务需求转成实现方向、评估成本和待确认问题。</p>
            </div>
            <div className="min-w-0 flex-1 rounded-[18px] border border-slate-200/70 bg-white/85 px-3 py-2.5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">DEV → PM</div>
              <p className="mt-1 text-[11px] leading-4 text-slate-600 whitespace-nowrap">把技术方案转成体验影响、业务价值和风险提示。</p>
            </div>
            <div className="min-w-0 flex-1 rounded-[18px] border border-slate-200/70 bg-white/85 px-3 py-2.5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">AUTO</div>
              <p className="mt-1 text-[11px] leading-4 text-slate-600 whitespace-nowrap">自动识别输入视角，减少用户在方向选择上的犹豫。</p>
            </div>
            <div className="min-w-0 flex-1 rounded-[18px] border border-slate-200/70 bg-white/85 px-3 py-2.5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">Streaming</div>
              <p className="mt-1 text-[11px] leading-4 text-slate-600 whitespace-nowrap">结果边生成边展示，保持沟通反馈足够快、足够连续。</p>
            </div>
          </div>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-hidden pb-4">
        <TranslatePanel />
      </main>
    </div>
  );
}

export default App;
