import { useState, type ReactNode } from 'react';
import { Avatar, Drawer, Popover, Progress } from 'antd';
import {
  CreditCardOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { UserProfile } from '../../api/adapters';
import { mainMenu, type AppRoute } from '../../data/mockData';
import type { Navigate, ShowAlert, ThemeMode } from '../../types/app';

type NavigationProps = {
  route: AppRoute;
  mode: ThemeMode;
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
}: Omit<NavigationProps, 'route' | 'mode'> & { onClose: () => void }) {
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
      <div className="account-theme-row">
        <span>
          <SettingOutlined />
          라이트 / 다크 모드
        </span>
        {themeSwitch}
      </div>
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
      <button className="account-menu-item" onClick={() => moveTo('/mypage')}>
        <UserOutlined />
        <span>
          <strong>마이페이지 바로가기</strong>
          <small>프로필과 보안 설정</small>
        </span>
      </button>
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
  variant = 'full',
}: Pick<NavigationProps, 'route' | 'navigate'> & { onNavigate?: () => void; variant?: 'full' | 'icon' }) {
  return (
    <>
      {sidebarMenu.map((item) => {
        const isActive = route === item.route;
        if (variant === 'icon') {
          return (
            <button
              key={item.route}
              type="button"
              className={`side-nav-item icon-only ${isActive ? 'active' : ''}`}
              aria-label={`${item.label}: ${item.description}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => {
                onNavigate?.();
                navigate(item.route);
              }}
            >
              <span className="side-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-slide-label" aria-hidden="true">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.route}
            type="button"
            className={`side-nav-item ${isActive ? 'active' : ''}`}
            aria-label={`${item.label}: ${item.description}`}
            aria-current={isActive ? 'page' : undefined}
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
        );
      })}
    </>
  );
}

export function MobileShellHeader(props: NavigationProps) {
  const { route, mode, creditPercent, profile, themeSwitch, navigate, showAlert } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const displayName = profile?.displayName ?? '채용 담당자';

  return (
    <>
      <header className="mobile-shell-header">
        <button type="button" className="mobile-nav-trigger" onClick={() => setDrawerOpen(true)} aria-label="메뉴 열기">
          <MenuOutlined />
        </button>
        <button type="button" className="mobile-brand-logo" onClick={() => navigate('/dashboard')} aria-label="대시보드로 이동">
          <img src={mode === 'dark' ? '/assets/humour-logo-dark.png' : '/assets/humour-logo-light.png'} alt="HumouR" />
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
          <button
            type="button"
            className={`mobile-account-trigger ${route === '/mypage' ? 'active' : ''}`}
            aria-label="마이페이지 메뉴 열기"
          >
            <span className="mobile-profile-avatar" aria-hidden="true">
              {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : getInitials(displayName)}
            </span>
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
        getContainer={() => (document.querySelector('.app-root') as HTMLElement) ?? document.body}
      >
        <button
          className="brand-button mobile-drawer-brand"
          onClick={() => {
            setDrawerOpen(false);
            navigate('/dashboard');
          }}
          aria-label="대시보드로 이동"
        >
          <img src={mode === 'dark' ? '/assets/humour-logo-dark.png' : '/assets/humour-logo-light.png'} alt="HumouR" />
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
  const { route, mode, creditPercent, profile, themeSwitch, navigate, showAlert } = props;
  const [accountOpen, setAccountOpen] = useState(false);
  const displayName = profile?.displayName ?? '채용 담당자';

  return (
    <nav className="sidebar desktop-shell-nav" aria-label="주요 페이지">
      <div className="desktop-shell-nav-inner">
        <button type="button" className="brand-button" onClick={() => navigate('/dashboard')} aria-label="대시보드로 이동">
          <img src={mode === 'dark' ? '/assets/humour-logo-dark.png' : '/assets/humour-logo-light.png'} alt="HumouR" />
        </button>
        <div className="side-section">
          <span className="side-label">Main menu</span>
          <MenuItems route={route} navigate={navigate} variant="icon" />
        </div>
        <div className="sidebar-account-wrap">
          <Popover
            rootClassName="account-popover"
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
            <button
              type="button"
              className={`sidebar-account-button ${route === '/mypage' ? 'active' : ''}`}
              aria-label="계정 메뉴 열기"
            >
              <Avatar size={38} src={profile?.avatarUrl}>
                {getInitials(displayName)}
              </Avatar>
            </button>
          </Popover>
        </div>
      </div>
    </nav>
  );
}
