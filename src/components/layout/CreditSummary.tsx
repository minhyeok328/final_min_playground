import { Button, Progress } from 'antd';
import { palette } from '../../data/mockData';
import type { ShowAlert } from '../../types/app';

type CreditSummaryProps = {
  creditPercent: number;
  showAlert: ShowAlert;
};

export function CreditSummary({ creditPercent, showAlert }: CreditSummaryProps) {
  return (
    <div className="credit-card">
      <div className="credit-card-head">
        <span>분석 크레딧</span>
        <strong>{creditPercent}%</strong>
      </div>
      <Progress percent={creditPercent} strokeColor={palette.accent} />
      <Button
        size="small"
        type="primary"
        ghost
        onClick={() => showAlert({ type: 'info', message: '크레딧 충전 문의 상태를 표시했습니다.' })}
      >
        충전 문의
      </Button>
    </div>
  );
}
