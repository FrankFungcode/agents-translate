import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Perspective } from '../lib/types';

interface Props {
  output: string;
  error: string | null;
  isStreaming: boolean;
  missingInfo: string[];
  detectedPerspective?: Perspective;
}

export function OutputArea({
  output,
  error,
  isStreaming,
  missingInfo,
  detectedPerspective,
}: Props) {
  return (
    <section className="flex min-h-0 flex-col rounded-[28px] bg-[#102033] p-5 text-white shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold">翻译结果</h2>
        {isStreaming ? (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            正在流式生成
          </span>
        ) : null}
        {detectedPerspective ? (
          <span className="rounded-full bg-sea/80 px-3 py-1 text-xs">
            AUTO 识别为 {detectedPerspective}
          </span>
        ) : null}
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
        <div className="h-full overflow-y-auto p-5">
          {error ? (
            <div className="rounded-2xl bg-red-500/15 p-4 text-xs text-red-100">{error}</div>
          ) : null}

          {!output && !error ? (
            <div className="text-xs leading-6 text-white/70">
              翻译结果会以结构化 Markdown 呈现，适合直接复制给对方角色继续沟通。
            </div>
          ) : null}

          {output ? (
            <article className="prose prose-sm prose-invert max-w-none text-xs leading-6 prose-headings:mb-3 prose-headings:text-[15px] prose-headings:text-white prose-p:text-[13px] prose-p:text-white/85 prose-strong:text-white prose-li:text-[13px] prose-li:text-white/80">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </article>
          ) : null}
        </div>
      </div>

      {missingInfo.length > 0 ? (
        <div className="mt-4 rounded-[24px] border border-amber-300/20 bg-amber-200/10 p-4">
          <div className="text-xs font-semibold text-amber-100">建议继续补充</div>
          <ul className="mt-3 space-y-2 text-xs text-amber-50/90">
            {missingInfo.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
