interface Props {
  content: string;
  context: string;
  onContentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
}

export function InputArea({
  content,
  context,
  onContentChange,
  onContextChange,
  onSubmit,
  isStreaming,
}: Props) {
  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-[28px] bg-white p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-ink">输入内容</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            输入业务需求或技术方案，系统会按照当前方向进行翻译。
          </p>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isStreaming || !content.trim()}
          className="w-full shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          {isStreaming ? '翻译中...' : '开始翻译'}
        </button>
      </div>

      <label className="mt-4 flex min-h-0 flex-1 flex-col">
        <span className="mb-2 block text-sm font-medium text-slate-600">主要内容</span>
        <textarea
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder="输入 PM 需求或开发方案..."
          rows={12}
          className="min-h-[220px] w-full flex-1 resize-none rounded-[24px] border border-slate-200 px-4 py-4 text-sm leading-7 outline-none transition focus:border-sky sm:min-h-0"
        />
      </label>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium text-slate-600">补充上下文（可选）</span>
        <input
          value={context}
          onChange={(event) => onContextChange(event.target.value)}
          placeholder="例如：电商首页改版、支付链路优化、内部管理后台"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky"
        />
      </label>
    </section>
  );
}
