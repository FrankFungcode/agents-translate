import { useState } from 'react';
import { DirectionSelector } from './DirectionSelector';
import { InputArea } from './InputArea';
import { OutputArea } from './OutputArea';
import { useStreamTranslate } from '../hooks/useStreamTranslate';
import type { Direction, SessionState } from '../lib/types';

const emptySession = (): SessionState => ({
  content: '',
  context: '',
  output: '',
  missingInfo: [],
});

const initialSessions: Record<Direction, SessionState> = {
  PM_TO_DEV: emptySession(),
  DEV_TO_PM: emptySession(),
  AUTO: emptySession(),
};

export function TranslatePanel() {
  const [direction, setDirection] = useState<Direction>('AUTO');
  const [sessions, setSessions] = useState<Record<Direction, SessionState>>(initialSessions);
  const { output, error, isStreaming, translate } = useStreamTranslate();

  const activeSession = sessions[direction];
  const currentOutput = isStreaming ? output : activeSession.output;

  const updateSession = (patch: Partial<SessionState>) => {
    setSessions((prev) => ({
      ...prev,
      [direction]: {
        ...prev[direction],
        ...patch,
      },
    }));
  };

  const handleSubmit = () => {
    translate(
      {
        content: activeSession.content,
        context: activeSession.context || undefined,
        direction,
      },
      {
        onDone: (payload) => {
          updateSession({
            output: payload.result,
            missingInfo: payload.missingInfo ?? [],
            detectedPerspective: payload.detectedPerspective,
            resolvedDirection: payload.direction,
          });
        },
      },
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:min-h-0 lg:px-8">
      <div className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-4 lg:min-h-0">
          <DirectionSelector value={direction} onChange={setDirection} />
          <InputArea
            content={activeSession.content}
            context={activeSession.context}
            onContentChange={(content) => updateSession({ content })}
            onContextChange={(context) => updateSession({ context })}
            onSubmit={handleSubmit}
            isStreaming={isStreaming}
          />
        </div>
        <OutputArea
          output={currentOutput}
          error={error}
          isStreaming={isStreaming}
          missingInfo={activeSession.missingInfo}
          detectedPerspective={activeSession.detectedPerspective}
        />
      </div>
    </div>
  );
}
