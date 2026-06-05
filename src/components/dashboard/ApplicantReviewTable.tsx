import { Button, Progress, Table } from 'antd';
import { SectionCard } from '../common/SectionCard';
import type { ApplicantRow } from '../../api/adapters';
import type { ShowAlert } from '../../types/app';
import { statusTag } from '../../utils/statusTag';

type ApplicantReviewTableProps = {
  applicants: ApplicantRow[];
  showAlert: ShowAlert;
};

export function ApplicantReviewTable({ applicants, showAlert }: ApplicantReviewTableProps) {
  return (
    <SectionCard
      className="applicant-review-card"
      title="지원자 검토 목록"
      extra={
        <Button
          type="link"
          onClick={() =>
            showAlert({
              type: 'info',
              message: '지원자 상세 목록 화면은 API 연동 단계에서 연결합니다.',
            })
          }
        >
          자세히
        </Button>
      }
    >
      <Table
        size="middle"
        pagination={false}
        scroll={{ x: 640 }}
        dataSource={applicants}
        columns={[
          { title: '지원자', dataIndex: 'name' },
          { title: '지원 직무', dataIndex: 'role' },
          {
            title: '적합도',
            dataIndex: 'fit',
            render: (value: number) => <Progress className="fit-progress" percent={value} size="small" />,
          },
          { title: '단계', dataIndex: 'stage' },
          {
            title: '상태',
            dataIndex: 'status',
            render: (_value: string, record) => statusTag(record.status, record.statusCode),
          },
        ]}
      />
    </SectionCard>
  );
}
