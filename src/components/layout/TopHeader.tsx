import type { ReactNode } from 'react';
import { Button, Input, Layout, Select, Space } from 'antd';
import { LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { NotificationButton } from './NotificationButton';
import type { NotificationsData } from '../../api/adapters';
import { mainMenu, type AppRoute } from '../../data/mockData';
import type { Navigate } from '../../types/app';

const { Header } = Layout;

type TopHeaderProps = {
  route: AppRoute;
  themeSwitch: ReactNode;
  notifications?: NotificationsData;
  navigate: Navigate;
};

export function TopHeader({ route, themeSwitch, notifications, navigate }: TopHeaderProps) {
  return (
    <Header className="top-header">
      <div className="top-title">
        <img src="/assets/humour-app-icon.png" alt="" />
        <span>{mainMenu.find((item) => item.route === route)?.label}</span>
      </div>
      <Input
        className="top-search"
        prefix={<SearchOutlined />}
        placeholder="지원자, JD, 분석 리포트 검색"
        aria-label="검색"
      />
      <Select
        className="mobile-route-select"
        value={route}
        onChange={(value) => navigate(value)}
        options={mainMenu.map((item) => ({ value: item.route, label: item.label }))}
        aria-label="화면 선택"
      />
      <Space className="top-actions">
        <NotificationButton notifications={notifications} />
        {themeSwitch}
        <Button className="logout-button" icon={<LogoutOutlined />} onClick={() => navigate('/login')}>
          <span className="logout-text">로그아웃</span>
        </Button>
      </Space>
    </Header>
  );
}
