import { Col, Row } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { SectionCard } from '../common/SectionCard';

type TaskListPanelProps = {
  tasks: string[];
};

export function TaskListPanel({ tasks }: TaskListPanelProps) {
  return (
    <SectionCard title="오늘의 작업" className="section-row">
      <Row gutter={[16, 16]}>
        {tasks.map((task, index) => (
          <Col xs={24} md={12} xl={6} key={task}>
            <div className="task-item" style={{ animationDelay: `${index * 70}ms` }}>
              <CheckCircleOutlined />
              <span>{task}</span>
            </div>
          </Col>
        ))}
      </Row>
    </SectionCard>
  );
}
