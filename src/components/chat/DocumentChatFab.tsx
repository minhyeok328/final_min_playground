import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Button, Input, Space, Tag } from 'antd';
import {
  BookOutlined,
  CloseOutlined,
  FileSearchOutlined,
  FullscreenOutlined,
  HolderOutlined,
  MessageOutlined,
  MinusOutlined,
  SendOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { InlineLoading } from '../common/InlineLoading';
import type { ChatMessage } from '../../data/mockData';
import type { Navigate } from '../../types/app';

type DocumentChatFabProps = {
  chatMessages: ChatMessage[];
  chatInput: string;
  loadingKey: string | null;
  setChatInput: (value: string) => void;
  sendChatMessage: () => void;
  navigate: Navigate;
};

type WidgetPosition = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  origin: WidgetPosition;
};

const widgetStorageKey = 'humour-document-chat-widget-position';
const widgetWidth = 420;
const widgetHeight = 680;
const widgetMargin = 20;
const mobileBreakpoint = 767;
const desktopSidebarWidth = 292;
const desktopShellBreakpoint = 991;

const scopeOptions = ['전체 문서', '회사 정책', 'JD', '분석 리포트'];

const sourceCards = [
  {
    title: '면접 평가 기준 v3',
    detail: '직무 적합도, 협업 역량, 리스크 질문 기준',
  },
  {
    title: '채용 운영 가이드',
    detail: '서류 검토, 면접 추천, 최종 검토 워크플로',
  },
];

const quickQuestions = ['면접 평가 기준 알려줘', '리모트 근무 정책 찾아줘', 'JD 체크리스트 정리해줘'];

const getWidgetSize = () => ({
  width: Math.min(widgetWidth, Math.max(280, window.innerWidth - widgetMargin * 2)),
  height: Math.min(widgetHeight, Math.max(360, window.innerHeight - widgetMargin * 2)),
});

const clampPosition = (position: WidgetPosition): WidgetPosition => {
  if (typeof window === 'undefined') {
    return position;
  }

  const size = getWidgetSize();
  const minX = window.innerWidth > desktopShellBreakpoint ? desktopSidebarWidth + widgetMargin : widgetMargin;
  const minY = widgetMargin;
  const maxX = Math.max(widgetMargin, window.innerWidth - size.width - widgetMargin);
  const maxY = Math.max(widgetMargin, window.innerHeight - size.height - widgetMargin);

  return {
    x: Math.min(Math.max(position.x, minX), maxX),
    y: Math.min(Math.max(position.y, minY), maxY),
  };
};

const getDefaultPosition = (): WidgetPosition => {
  if (typeof window === 'undefined') {
    return { x: widgetMargin, y: widgetMargin };
  }

  const size = getWidgetSize();
  return clampPosition({
    x: window.innerWidth - size.width - 28,
    y: window.innerHeight - size.height - 28,
  });
};

const readStoredPosition = (): WidgetPosition | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawPosition = window.localStorage.getItem(widgetStorageKey);
    if (!rawPosition) {
      return null;
    }

    const parsed = JSON.parse(rawPosition) as Partial<WidgetPosition>;
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') {
      return null;
    }

    return clampPosition({ x: parsed.x, y: parsed.y });
  } catch {
    return null;
  }
};

const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth <= mobileBreakpoint;

export function DocumentChatFab({
  chatMessages,
  chatInput,
  loadingKey,
  setChatInput,
  sendChatMessage,
  navigate,
}: DocumentChatFabProps) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState(scopeOptions[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<WidgetPosition>(() => readStoredPosition() ?? getDefaultPosition());
  const dragStateRef = useRef<DragState | null>(null);

  const widgetStyle = useMemo(
    () => ({
      left: position.x,
      top: position.y,
    }),
    [position],
  );

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => clampPosition(current));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileViewport()) {
      return;
    }

    try {
      window.localStorage.setItem(widgetStorageKey, JSON.stringify(position));
    } catch {
      // localStorage can be unavailable in stricter browser contexts.
    }
  }, [position]);

  useEffect(() => {
    if (!isDragging) {
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      const nextPosition = {
        x: dragState.origin.x + event.clientX - dragState.startX,
        y: dragState.origin.y + event.clientY - dragState.startY,
      };

      setPosition(clampPosition(nextPosition));
    };

    const stopDragging = () => {
      dragStateRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, [isDragging]);

  const openWidget = () => {
    setPosition((current) => clampPosition(current));
    setOpen(true);
  };

  const openWorkspace = () => {
    setOpen(false);
    navigate('/chat');
  };

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isMobileViewport()) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea, a')) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: position,
    };
    setIsDragging(true);
    event.preventDefault();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendChatMessage();
  };

  return (
    <>
      {!open && (
        <Button
          className="document-chat-fab"
          type="primary"
          onClick={openWidget}
          aria-expanded={open}
          aria-label="AI 문서 검색 위젯 열기"
        >
          <span className="document-chat-fab-icon">
            <ThunderboltOutlined />
          </span>
          <span className="document-chat-fab-text">AI 문서 검색</span>
        </Button>
      )}

      {open && (
        <section
          className={`document-chat-widget ${isDragging ? 'dragging' : ''}`}
          style={widgetStyle}
          role="dialog"
          aria-modal="false"
          aria-labelledby="document-chat-widget-title"
        >
          <div className="document-chat-widget-header" onPointerDown={handleDragStart}>
            <div className="document-chat-widget-drag-handle" aria-label="채팅 위젯 이동">
              <HolderOutlined />
            </div>
            <span className="document-chat-avatar">
              <BookOutlined />
            </span>
            <div className="document-chat-widget-title">
              <strong id="document-chat-widget-title">AI 문서 검색</strong>
              <span>사내 문서·채용 데이터 통합 챗봇</span>
            </div>
            <div className="document-chat-widget-actions">
              <Button
                aria-label="전체 화면에서 열기"
                shape="circle"
                icon={<FullscreenOutlined />}
                onClick={openWorkspace}
              />
              <Button aria-label="위젯 최소화" shape="circle" icon={<MinusOutlined />} onClick={() => setOpen(false)} />
              <Button aria-label="위젯 닫기" shape="circle" icon={<CloseOutlined />} onClick={() => setOpen(false)} />
            </div>
          </div>

          <div className="document-chat-widget-body">
            <div className="document-chat-widget-intro">
              <span>현재 검색 범위</span>
              <strong>{scope}</strong>
              <p>질문과 관련된 문서를 찾아 출처와 함께 답변합니다.</p>
            </div>

            <div className="document-scope-row" role="tablist" aria-label="검색 범위">
              {scopeOptions.map((option) => (
                <button
                  key={option}
                  className={`document-scope-chip ${scope === option ? 'active' : ''}`}
                  onClick={() => setScope(option)}
                  type="button"
                  role="tab"
                  aria-selected={scope === option}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="document-chat-window">
              <div className="chat-bubble assistant">
                <span>HumouR AI</span>
                <p>{scope}에서 질문과 관련된 사내 근거를 찾아 요약해 드릴게요.</p>
              </div>
              {chatMessages.map((message, index) => (
                <div className={`chat-bubble ${message.role}`} key={`${message.role}-${index}`}>
                  <span>{message.role === 'assistant' ? 'HumouR AI' : '채용 담당자'}</span>
                  <p>{message.text}</p>
                </div>
              ))}
              {loadingKey === 'chat' && (
                <div className="chat-bubble assistant">
                  <span>HumouR AI</span>
                  <InlineLoading label="문서 검색 중" />
                </div>
              )}
            </div>

            <div className="document-source-stack">
              <div className="document-source-title">
                <FileSearchOutlined />
                <strong>추천 참조 문서</strong>
              </div>
              {sourceCards.map((source) => (
                <button className="document-source-card" key={source.title} onClick={() => setChatInput(source.title)}>
                  <strong>{source.title}</strong>
                  <span>{source.detail}</span>
                </button>
              ))}
            </div>

            <Space className="document-quick-actions" wrap>
              {quickQuestions.map((question) => (
                <Tag key={question} onClick={() => setChatInput(question)}>
                  {question}
                </Tag>
              ))}
            </Space>
          </div>

          <form className="document-chat-input-row" onSubmit={handleSubmit}>
            <Input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="사내 문서에 대해 질문하기"
            />
            <Button type="primary" htmlType="submit" icon={<SendOutlined />} disabled={loadingKey === 'chat'}>
              전송
            </Button>
          </form>

          <Button className="document-workspace-link" block icon={<MessageOutlined />} onClick={openWorkspace}>
            전체 화면에서 열기
          </Button>
        </section>
      )}
    </>
  );
}
