import clsx from 'clsx';
import type { Direction } from '../lib/types';

const options: Array<{ value: Direction; title: string; description: string }> = [
  {
    value: 'PM_TO_DEV',
    title: 'PM -> DEV',
    description: '把业务需求转换成技术实现语言',
  },
  {
    value: 'DEV_TO_PM',
    title: 'DEV -> PM',
    description: '把技术结论转换成业务表达',
  },
  {
    value: 'AUTO',
    title: 'AUTO',
    description: '自动识别输入视角并选择翻译方向',
  },
];

interface Props {
  value: Direction;
  onChange: (direction: Direction) => void;
}

export function DirectionSelector({ value, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            'rounded-[24px] border px-4 py-3.5 text-left transition',
            value === option.value
              ? 'border-signal bg-white shadow-soft'
              : 'border-slate-200 bg-white/70 hover:border-sky',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky">
            {option.title}
          </div>
          <div className="mt-1 text-sm leading-5 text-slate-600">{option.description}</div>
        </button>
      ))}
    </div>
  );
}
