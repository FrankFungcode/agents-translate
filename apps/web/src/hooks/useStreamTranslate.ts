import { useRef, useState } from 'react';
import type { Direction, Perspective, TranslateRequest } from '../lib/types';

interface StreamResult {
  output: string;
  isStreaming: boolean;
  error: string | null;
  translate: (
    input: TranslateRequest,
    handlers?: {
      onDone?: (payload: {
        result: string;
        direction?: Exclude<Direction, 'AUTO'>;
        detectedPerspective?: Perspective;
        missingInfo?: string[];
      }) => void;
    },
  ) => void;
  stop: () => void;
}

export function useStreamTranslate(): StreamResult {
  const [output, setOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const stop = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsStreaming(false);
  };

  const translate = (
    input: TranslateRequest,
    handlers?: {
      onDone?: (payload: {
        result: string;
        direction?: Exclude<Direction, 'AUTO'>;
        detectedPerspective?: Perspective;
        missingInfo?: string[];
      }) => void;
    },
  ) => {
    stop();
    setOutput('');
    setError(null);
    setIsStreaming(true);

    const query = new URLSearchParams({
      content: input.content,
      direction: input.direction,
    });

    if (input.context) {
      query.set('context', input.context);
    }

    const source = new EventSource(`/api/translate/stream?${query.toString()}`);
    eventSourceRef.current = source;

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as {
        token?: string;
        done?: boolean;
        result?: string;
        direction?: Exclude<Direction, 'AUTO'>;
        detectedPerspective?: Perspective;
        missingInfo?: string[];
      };

      if (payload.done) {
        setIsStreaming(false);
        if (payload.result) {
          setOutput(payload.result);
        }
        handlers?.onDone?.({
          result: payload.result ?? '',
          direction: payload.direction,
          detectedPerspective: payload.detectedPerspective,
          missingInfo: payload.missingInfo,
        });
        source.close();
        eventSourceRef.current = null;
        return;
      }

      if (payload.token) {
        setOutput((prev) => prev + payload.token);
      }
    };

    source.onerror = () => {
      setError('连接中断，请检查模型配置或稍后重试。');
      stop();
    };
  };

  return { output, isStreaming, error, translate, stop };
}
