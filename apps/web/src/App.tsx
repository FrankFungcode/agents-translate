import { TranslatePanel } from './components/TranslatePanel';

function App() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(255,122,89,0.14),_transparent_26%),linear-gradient(180deg,#f7fbff_0%,#eef4f8_46%,#e9f0f6_100%)] text-ink lg:h-dvh lg:overflow-hidden">
      <header className="mx-auto w-full max-w-7xl flex-none px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/65 bg-white/70 px-4 py-5 shadow-soft backdrop-blur sm:rounded-[32px] sm:px-6 sm:py-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex max-w-full rounded-full bg-signal/10 px-4 py-2 text-center text-[11px] font-medium leading-5 text-signal sm:text-xs">
              面向产品经理与开发工程师的双向沟通翻译助手
            </div>
            <h1 className="mt-4 max-w-4xl text-2xl font-semibold leading-tight sm:text-[28px] lg:text-[2.4rem]">
              把 PM 与开发之间的表达差异，翻译成彼此都能直接行动的语言。
            </h1>
            <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600 lg:text-[15px]">
              聚焦三条路径：PM {'->'} DEV、DEV {'->'} PM、AUTO 自动识别。支持流式输出和会话隔离，让需求、方案、风险与待确认项都能快速转成对方看得懂、接得住的表达。
            </p>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 rounded-[18px] border border-slate-200/70 bg-white/85 px-3 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">PM → DEV</div>
              <p className="mt-1 text-[12px] leading-5 text-slate-600">把业务需求转成实现方向、评估成本和待确认问题。</p>
            </div>
            <div className="min-w-0 rounded-[18px] border border-slate-200/70 bg-white/85 px-3 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">DEV → PM</div>
              <p className="mt-1 text-[12px] leading-5 text-slate-600">把技术方案转成体验影响、业务价值和风险提示。</p>
            </div>
            <div className="min-w-0 rounded-[18px] border border-slate-200/70 bg-white/85 px-3 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">AUTO</div>
              <p className="mt-1 text-[12px] leading-5 text-slate-600">自动识别输入视角，减少用户在方向选择上的犹豫。</p>
            </div>
            <div className="min-w-0 rounded-[18px] border border-slate-200/70 bg-white/85 px-3 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">Streaming</div>
              <p className="mt-1 text-[12px] leading-5 text-slate-600">结果边生成边展示，保持沟通反馈足够快、足够连续。</p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-4 lg:min-h-0 lg:overflow-hidden">
        <TranslatePanel />
      </main>
    </div>
  );
}

export default App;
