import { useState, type ReactNode } from 'react';
import { Avatar, Drawer, Layout, Popover, Progress } from 'antd';
import {
  CreditCardOutlined,
  LogoutOutlined,
  MenuOutlined,
  RightOutlined,
  SettingOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { UserProfile } from '../../api/adapters';
import { mainMenu, type AppRoute } from '../../data/mockData';
import type { Navigate, ShowAlert } from '../../types/app';

const { Sider } = Layout;

type NavigationProps = {
  route: AppRoute;
  creditPercent: number;
  profile?: UserProfile;
  themeSwitch: ReactNode;
  navigate: Navigate;
  showAlert: ShowAlert;
};

const sidebarMenu = mainMenu.filter((item) => item.route !== '/mypage');

function getInitials(name?: string) {
  if (!name) {
    return 'HR';
  }

  return name.trim().slice(0, 2).toUpperCase();
}

function AccountMenu({
  creditPercent,
  profile,
  themeSwitch,
  navigate,
  showAlert,
  onClose,
}: Omit<NavigationProps, 'route'> & { onClose: () => void }) {
  const displayName = profile?.displayName ?? '채용 담당자';
  const email = profile?.email ?? 'recruiter@humour.ai';

  const moveTo = (nextRoute: AppRoute) => {
    onClose();
    navigate(nextRoute);
  };

  return (
    <div className="account-menu">
      <div className="account-menu-head">
        <Avatar size={42} src={profile?.avatarUrl}>
          {getInitials(displayName)}
        </Avatar>
        <div>
          <span>마이페이지</span>
          <strong>{displayName}</strong>
          <small>{email}</small>
        </div>
      </div>
      <button className="account-menu-item" onClick={() => moveTo('/mypage')}>
        <UserOutlined />
        <span>
          <strong>마이페이지 바로가기</strong>
          <small>프로필과 보안 설정</small>
        </span>
        <RightOutlined />
      </button>
      <div className="account-credit-panel">
        <div>
          <CreditCardOutlined />
          <span>크레딧 사용량</span>
          <strong>{creditPercent}% 사용</strong>
        </div>
        <Progress percent={creditPercent} showInfo={false} />
        <button
          className="account-credit-link"
          onClick={() => {
            onClose();
            showAlert({ type: 'info', message: '크레딧 충전 문의 상태를 표시했습니다.' });
          }}
        >
          충전 문의
        </button>
      </div>
      <div className="account-theme-row">
        <span>
          <SettingOutlined />
          라이트 / 다크 모드
        </span>
        {themeSwitch}
      </div>
      <button className="account-menu-item danger" onClick={() => moveTo('/login')}>
        <LogoutOutlined />
        <span>
          <strong>로그아웃</strong>
          <small>현재 세션 종료</small>
        </span>
      </button>
    </div>
  );
}

function MenuItems({
  route,
  navigate,
  onNavigate,
}: Pick<NavigationProps, 'route' | 'navigate'> & { onNavigate?: () => void }) {
  return (
    <>
      {sidebarMenu.map((item) => (
        <button
          key={item.route}
          className={`side-nav-item ${route === item.route ? 'active' : ''}`}
          onClick={() => {
            onNavigate?.();
            navigate(item.route);
          }}
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
    </>
  );
}

export function MobileShellHeader(props: NavigationProps) {
  const { route, creditPercent, profile, themeSwitch, navigate, showAlert } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const activeLabel = mainMenu.find((item) => item.route === route)?.label ?? '대시보드';
  const displayName = profile?.displayName ?? '채용 담당자';

  return (
    <>
      <header className="mobile-shell-header">
        <button className="mobile-nav-trigger" onClick={() => setDrawerOpen(true)} aria-label="메뉴 열기">
          <MenuOutlined />
        </button>
        <button className="mobile-brand-summary" onClick={() => navigate('/dashboard')} aria-label="대시보드로 이동">
          <img src="/assets/humour-app-icon.png" alt="" />
          <span>
            <strong>{activeLabel}</strong>
            <small>HumouR</small>
          </span>
        </button>
        <Popover
          rootClassName="account-popover mobile-account-popover"
          placement="bottomRight"
          trigger="click"
          arrow={false}
          open={accountOpen}
          onOpenChange={setAccountOpen}
          content={
            <AccountMenu
              creditPercent={creditPercent}
              profile={profile}
              themeSwitch={themeSwitch}
              navigate={navigate}
              showAlert={showAlert}
              onClose={() => setAccountOpen(false)}
            />
          }
          getPopupContainer={(triggerNode) => (triggerNode.closest('.app-root') as HTMLElement) ?? document.body}
        >
          <button className={`mobile-account-trigger ${route === '/mypage' ? 'active' : ''}`} aria-label="마이페이지 메뉴 열기">
            <Avatar size={36} src={profile?.avatarUrl}>
              {getInitials(displayName)}
            </Avatar>
          </button>
        </Popover>
      </header>
      <Drawer
        rootClassName="mobile-nav-drawer"
        placement="left"
        width="min(330px, calc(100vw - 28px))"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={null}
      >
        <button
          className="brand-button mobile-drawer-brand"
          onClick={() => {
            setDrawerOpen(false);
            navigate('/dashboard');
          }}
          aria-label="대시보드로 이동"
        >
          <img src="/assets/humour-logo-dark.png" alt="HumouR" />
        </button>
        <div className="side-section mobile-drawer-menu">
          <span className="side-label">Main menu</span>
          <MenuItems route={route} navigate={navigate} onNavigate={() => setDrawerOpen(false)} />
        </div>
      </Drawer>
    </>
  );
}

export function SidebarNav(props: NavigationProps) {
  const { route, creditPercent, profile, themeSwitch, navigate, showAlert } = props;
  const [accountOpen, setAccountOpen] = useState(false);
  const displayName = profile?.displayName ?? '채용 담당자';
  const email = profile?.email ?? 'recruiter@humour.ai';

  return (
    <Sider className="sidebar" width={292} breakpoint="lg" collapsedWidth={0}>
      <button className="brand-button" onClick={() => navigate('/dashboard')} aria-label="대시보드로 이동">
        <img src="/assets/humour-logo-dark.png" alt="HumouR" />
      </button>
      <div className="side-section">
        <span className="side-label">Main menu</span>
        <MenuItems route={route} navigate={navigate} />
      </div>
      <div className="sidebar-account-wrap">
        <Popover
          rootClassName="account-popover"
          placement="topLeft"
          trigger="click"
          arrow={false}
          open={accountOpen}
          onOpenChange={setAccountOpen}
          content={
            <AccountMenu
              creditPercent={creditPercent}
              profile={profile}
              themeSwitch={themeSwitch}
              navigate={navigate}
              showAlert={showAlert}
              onClose={() => setAccountOpen(false)}
            />
          }
          getPopupContainer={(triggerNode) => (triggerNode.closest('.app-root') as HTMLElement) ?? document.body}
        >
          <button className={`sidebar-account-button ${route === '/mypage' ? 'active' : ''}`}>
            <Avatar size={38} src={profile?.avatarUrl}>
              {getInitials(displayName)}
            </Avatar>
            <span>
              <strong>{displayName}</strong>
              <small>{email}</small>
            </span>
            <UpOutlined />
          </button>
        </Popover>
      </div>
    </Sider>
  );
}
