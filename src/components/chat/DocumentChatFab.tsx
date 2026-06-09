import { useState, type FormEvent } from 'react';
import { Button, Input, Space, Tag } from 'antd';
import {
  BookOutlined,
  CloseOutlined,
  FileSearchOutlined,
  FullscreenOutlined,
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
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);

  const openWidget = () => {
    setOpen(true);
  };

  const openWorkspace = () => {
    setRecommendationsOpen(false);
    setOpen(false);
    navigate('/chat');
  };

  const closeWidget = () => {
    setRecommendationsOpen(false);
    setOpen(false);
  };

  const selectSuggestion = (value: string) => {
    setChatInput(value);
    setRecommendationsOpen(false);
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
          className={`document-chat-widget ${recommendationsOpen ? 'recommendations-open' : ''}`}
          role="dialog"
          aria-modal="false"
          aria-labelledby="document-chat-widget-title"
        >
          <button
            className="document-chat-recommendation-toggle"
            type="button"
            aria-controls="document-chat-recommendation-panel"
            aria-expanded={recommendationsOpen}
            onClick={() => setRecommendationsOpen((current) => !current)}
          >
            <FileSearchOutlined />
            <span>추천</span>
          </button>

          <aside
            id="document-chat-recommendation-panel"
            className="document-chat-recommendation-panel"
            aria-hidden={!recommendationsOpen}
          >
            <div className="document-recommendation-panel-head">
              <div>
                <strong>추천 자료</strong>
                <span>질문에 바로 넣을 자료와 예시입니다.</span>
              </div>
              <Button
                aria-label="추천 자료 닫기"
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => setRecommendationsOpen(false)}
              />
            </div>

            <div className="document-recommendation-section">
              <span>현재 범위</span>
              <strong>{scope}</strong>
              <p>범위를 바꾸면 채팅의 문서 검색 기준도 함께 바뀝니다.</p>
            </div>

            <div className="document-source-stack">
              <div className="document-source-title">
                <FileSearchOutlined />
                <strong>추천 참조 문서</strong>
              </div>
              {sourceCards.map((source) => (
                <button className="document-source-card" key={source.title} onClick={() => selectSuggestion(source.title)}>
                  <strong>{source.title}</strong>
                  <span>{source.detail}</span>
                </button>
              ))}
            </div>

            <div className="document-quick-actions">
              <strong>빠른 질문</strong>
              <Space wrap>
                {quickQuestions.map((question) => (
                  <Tag key={question} onClick={() => selectSuggestion(question)}>
                    {question}
                  </Tag>
                ))}
              </Space>
            </div>
          </aside>

          <div className="document-chat-widget-main">
            <div className="document-chat-widget-header">
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
                <Button aria-label="위젯 최소화" shape="circle" icon={<MinusOutlined />} onClick={closeWidget} />
                <Button aria-label="위젯 닫기" shape="circle" icon={<CloseOutlined />} onClick={closeWidget} />
              </div>
            </div>

            <div className="document-chat-widget-body">
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

          </div>
        </section>
      )}
    </>
  );
}
