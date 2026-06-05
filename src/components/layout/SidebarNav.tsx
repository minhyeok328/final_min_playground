import { Layout } from 'antd';
import { CreditSummary } from './CreditSummary';
import { mainMenu, type AppRoute } from '../../data/mockData';
import type { Navigate, ShowAlert } from '../../types/app';

const { Sider } = Layout;

type SidebarNavProps = {
  route: AppRoute;
  creditPercent: number;
  navigate: Navigate;
  showAlert: ShowAlert;
};

export function SidebarNav({ route, creditPercent, navigate, showAlert }: SidebarNavProps) {
  return (
    <Sider className="sidebar" width={292} breakpoint="lg" collapsedWidth={0}>
      <button className="brand-button" onClick={() => navigate('/dashboard')} aria-label="대시보드로 이동">
        <img src="/assets/humour-logo-dark.png" alt="HumouR" />
      </button>
      <div className="side-section">
        <span className="side-label">Main menu</span>
        {mainMenu.map((item) => (
          <button
            key={item.route}
            className={`side-nav-item ${route === item.route ? 'active' : ''}`}
            onClick={() => navigate(item.route)}
          >
            <span className="side-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
          </button>
        ))}
      </div>
      <CreditSummary creditPercent={creditPercent} showAlert={showAlert} />
    </Sider>
  );
}
