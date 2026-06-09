import type { ReactNode } from 'react';
import { Button, Col, Flex, Form, Input, Row, Steps } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined } from '@ant-design/icons';
import { InlineLoading } from '../components/common/InlineLoading';
import { AuthScreen } from '../components/layout/AuthScreen';
import type { AuthDefaults } from '../api/adapters';
import { apiClient } from '../api/backendClient';
import type { Navigate, RunApiAction, ShowAlert, ThemeMode } from '../types/app';

type AuthPageBaseProps = {
  mode: ThemeMode;
  navigate: Navigate;
  themeSwitch: ReactNode;
  loadingKey: string | null;
  authDefaults?: AuthDefaults;
  runApiAction: RunApiAction;
};

type LoginPageProps = AuthPageBaseProps;

type LoginValues = {
  username: string;
  password: string;
};

export function LoginPage({
  mode,
  navigate,
  themeSwitch,
  loadingKey,
  authDefaults,
  runApiAction,
  onLoginSuccess,
}: LoginPageProps & { onLoginSuccess?: () => void }) {
  return (
    <AuthScreen
      mode={mode}
      nav={navigate}
      themeSwitch={themeSwitch}
      title="채용 데이터 입력부터 분석 리포트와 질의응답까지"
      cardTitle="로그인"
      card={
        <Form<LoginValues>
          layout="vertical"
          initialValues={{
            username: authDefaults?.username ?? '',
            password: authDefaults?.password ?? '',
          }}
          onFinish={(values) =>
            void runApiAction(
              'login',
              () => apiClient.login(values.username, values.password),
              () => onLoginSuccess?.(),
            )
          }
        >
          <Form.Item label="아이디" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="비밀번호" name="password">
            <Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
          <Button
            type="primary"
            block
            htmlType="submit"
            icon={loadingKey === 'login' ? undefined : <LoginOutlined />}
            disabled={loadingKey === 'login'}
          >
            {loadingKey === 'login' ? <InlineLoading label="로그인 중" /> : '로그인'}
          </Button>
          <Flex justify="space-between" className="auth-links">
            <Button type="link" onClick={() => navigate('/signup')}>
              회원가입
            </Button>
            <Button type="link" onClick={() => navigate('/password-reset')}>
              비밀번호 찾기
            </Button>
          </Flex>
        </Form>
      }
    />
  );
}

type SignupPageProps = AuthPageBaseProps & {
  showAlert: ShowAlert;
};

type SignupValues = {
  username: string;
  password: string;
  name: string;
  verification_question: string;
  verification_answer: string;
};

export function SignupPage({
  mode,
  navigate,
  themeSwitch,
  loadingKey,
  authDefaults,
  runApiAction,
}: SignupPageProps) {
  return (
    <AuthScreen
      mode={mode}
      nav={navigate}
      themeSwitch={themeSwitch}
      title="회사와 지원자 데이터를 한곳에서 관리하는 채용 보조 시스템"
      cardTitle="회원가입"
      card={
        <Form<SignupValues>
          layout="vertical"
          initialValues={{
            username: authDefaults?.username ?? '',
            password: authDefaults?.password ?? '',
            name: authDefaults?.name ?? '',
            verification_question: authDefaults?.verification_question ?? '',
            verification_answer: authDefaults?.verification_answer ?? '',
          }}
          onFinish={(values) => void runApiAction('signup-complete', () => apiClient.completeSignup(values))}
        >
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item label="아이디" name="username">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="확인">
                <Button
                  block
                  disabled={loadingKey === 'signup-check'}
                  onClick={() => void runApiAction('signup-check', apiClient.checkSignupId)}
                >
                  중복 확인
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="담당자명" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="비밀번호" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="본인확인 질문" name="verification_question">
            <Input />
          </Form.Item>
          <Form.Item label="본인확인 답변" name="verification_answer">
            <Input />
          </Form.Item>
          <Button
            type="primary"
            block
            htmlType="submit"
            disabled={loadingKey === 'signup-complete'}
          >
            {loadingKey === 'signup-complete' ? <InlineLoading label="가입 중" /> : '가입 완료'}
          </Button>
        </Form>
      }
    />
  );
}

type PasswordResetPageProps = AuthPageBaseProps & {
  resetStep: number;
  setResetStep: (step: number | ((current: number) => number)) => void;
  showAlert: ShowAlert;
};

export function PasswordResetPage({
  mode,
  navigate,
  themeSwitch,
  loadingKey,
  authDefaults,
  runApiAction,
  resetStep,
  setResetStep,
}: PasswordResetPageProps) {
  const stepContents = [
    <Form.Item label="아이디" key="id">
      <Input defaultValue={authDefaults?.username ?? ''} />
    </Form.Item>,
    <Form.Item label="본인확인 질문" key="question">
      <Input defaultValue={authDefaults?.verification_question ?? ''} />
    </Form.Item>,
    <Form.Item label="새 비밀번호" key="password">
      <Input.Password />
    </Form.Item>,
  ];

  return (
    <AuthScreen
      mode={mode}
      nav={navigate}
      themeSwitch={themeSwitch}
      title="단계형 재설정 플로우로 인증 화면 상태를 확인합니다."
      cardTitle="비밀번호 찾기"
      card={
        <div>
          <Steps size="small" current={resetStep} items={[{ title: 'ID' }, { title: '질문' }, { title: '변경' }]} />
          <div className="step-panel">{stepContents[resetStep]}</div>
          <Button
            type="primary"
            block
            disabled={loadingKey === 'password-reset'}
            onClick={() => {
              if (resetStep < 2) {
                setResetStep((current) => current + 1);
                return;
              }
              void runApiAction('password-reset', apiClient.resetPassword, () => navigate('/login'));
            }}
          >
            {loadingKey === 'password-reset' ? <InlineLoading label="재설정 중" /> : resetStep < 2 ? '다음' : '재설정 완료'}
          </Button>
        </div>
      }
    />
  );
}
