import { Button, Col, Row, Space, Tag } from 'antd';
import {
  AuditOutlined,
  BookOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

type DocumentSearchContextPanelProps = {
  setChatInput: (value: string) => void;
};

const documentCollections = [
  {
    icon: <SafetyCertificateOutlined />,
    title: '회사 정책',
    detail: '복리후생, 보안, 근무 제도',
    count: '42개 문서',
  },
  {
    icon: <AuditOutlined />,
    title: '채용 운영',
    detail: '면접 기준, 평가표, 후보자 관리',
    count: '68개 문서',
  },
  {
    icon: <FileTextOutlined />,
    title: 'JD / 공고',
    detail: '직무기술서, 모집 공고, 스킬 기준',
    count: '31개 문서',
  },
  {
    icon: <FileSearchOutlined />,
    title: '분석 리포트',
    detail: '지원자 분석, 적합도, 리스크 요약',
    count: '52개 리포트',
  },
];

const sourceExamples = [
  '면접 평가 기준 v3',
  '채용 운영 가이드',
  'Frontend Engineer JD',
  '자기소개서 분석 리포트',
];

const suggestedQuestions = [
  '신입 프론트엔드 면접 평가 기준 알려줘',
  '복리후생 정책 중 리모트 근무 기준 찾아줘',
  'JD와 자기소개서 검토 체크리스트 정리해줘',
  '지원자 리포트에서 리스크 항목만 모아줘',
];

export function DocumentSearchContextPanel({ setChatInput }: DocumentSearchContextPanelProps) {
  return (
    <div className="document-context-panel">
      <div className="context-card document-context-head">
        <div className="document-context-icon">
          <BookOutlined />
        </div>
        <div>
          <strong>사내 지식 검색</strong>
          <span>정책, JD, 분석 리포트, FAQ를 한 번에 검색합니다.</span>
        </div>
      </div>

      <Row gutter={[12, 12]} className="document-collection-grid">
        {documentCollections.map((item) => (
          <Col xs={24} sm={12} key={item.title}>
            <button className="document-collection-card" onClick={() => setChatInput(`${item.title}에서 찾아줘`)}>
              <span className="document-collection-icon">{item.icon}</span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
              <em>{item.count}</em>
            </button>
          </Col>
        ))}
      </Row>

      <div className="document-source-preview">
        <div className="document-source-title">
          <HistoryOutlined />
          <strong>최근 참조 소스</strong>
        </div>
        <Space wrap>
          {sourceExamples.map((source) => (
            <Tag key={source}>{source}</Tag>
          ))}
        </Space>
      </div>

      <div className="document-suggestions">
        <strong>추천 질문</strong>
        <Space wrap>
          {suggestedQuestions.map((question) => (
            <Button key={question} size="small" onClick={() => setChatInput(question)}>
              {question}
            </Button>
          ))}
        </Space>
      </div>
    </div>
  );
}
