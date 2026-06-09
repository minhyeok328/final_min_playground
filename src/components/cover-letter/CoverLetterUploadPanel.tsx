import { Button, Divider, Table, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { EmptyState } from '../common/PageState';
import type { CoverLetterDraft, CoverLetterRow } from '../../api/adapters';
import { mockClient } from '../../api/mockClient';
import type { Navigate, RunMockAction } from '../../types/app';
import { statusTag } from '../../utils/statusTag';

const { Dragger } = Upload;

type CoverLetterUploadPanelProps = {
  draft: CoverLetterDraft;
  coverRows: CoverLetterRow[];
  coverUploaded: boolean;
  analysisDone: boolean;
  runMockAction: RunMockAction;
  setCoverUploaded: (value: boolean) => void;
  navigate: Navigate;
};

export function CoverLetterUploadPanel({
  draft,
  coverRows,
  coverUploaded,
  analysisDone,
  runMockAction,
  setCoverUploaded,
  navigate,
}: CoverLetterUploadPanelProps) {
  return (
    <>
      <Dragger
        beforeUpload={() => {
          void runMockAction('cover-upload', mockClient.uploadCoverLetters, () => setCoverUploaded(true));
          return false;
        }}
        showUploadList={false}
        className="upload-box"
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">{draft.sampleFileName}</p>
        <p className="ant-upload-hint">{draft.uploadHint}</p>
      </Dragger>
      <Divider />
      {coverUploaded ? (
        <>
          <Table
            className="desktop-data-table"
            pagination={false}
            scroll={{ x: 520 }}
            dataSource={coverRows}
            rowClassName={(record) => (record.statusCode === 'missing_answer' ? 'warning-row' : '')}
            columns={[
              { title: '지원자', dataIndex: 'applicant' },
              { title: 'JD', dataIndex: 'jd' },
              {
                title: '상태',
                dataIndex: 'status',
                render: (_value: string, record) => statusTag(record.status, record.statusCode),
              },
              { title: '점수', dataIndex: 'score' },
            ]}
          />
          <div className="mobile-data-list" aria-label="Cover letter upload list">
            {coverRows.map((row) => (
              <article className={`mobile-data-card ${row.statusCode === 'missing_answer' ? 'warning' : ''}`} key={row.key}>
                <div className="mobile-data-card-head">
                  <div>
                    <strong>{row.applicant}</strong>
                    <span>{row.jd}</span>
                  </div>
                  {statusTag(row.status, row.statusCode)}
                </div>
                <div className="mobile-data-score">
                  <span>Score</span>
                  <strong>{row.score}</strong>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <EmptyState description="업로드된 자기소개서가 없습니다." />
      )}
      {analysisDone && (
        <Button className="mt-16" type="primary" block onClick={() => navigate('/chat')}>
          채팅 화면에서 리포트 확인
        </Button>
      )}
    </>
  );
}
