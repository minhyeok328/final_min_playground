import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import {
  analysisReportApiResponse,
  authDefaultsApiResponse,
  companyApiResponse,
  coverLettersApiResponse,
  coverLetterTemplateApiResponse,
  jobDescriptionsApiResponse,
  type Account,
  type AnalysisReport,
  type ApiResponse,
  type CompanyInfo,
  type InterviewQuestion,
  type JobDescription,
  type Resume,
} from '../data/apiMockData';
import type { ChatMessage } from '../data/mockData';

type BackendEnvelope<T> = {
  error: boolean;
  data?: T;
  message?: string;
} & Record<string, unknown>;

type DashboardPayload = {
  account: Account;
  company_info: CompanyInfo;
  job_descriptions: JobDescription[];
  resumes: Resume[];
  analysis_reports: AnalysisReport[];
  interview_questions: InterviewQuestion[];
};

type SignupBody = {
  username?: string;
  password?: string;
  name?: string;
  verification_question?: string;
  verification_answer?: string;
};

const API_ROOT = '/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

const httpClient = axios.create({
  baseURL: API_ROOT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function toApiResponse<T>(message: string, data: T, statusCode = 200): ApiResponse<T> {
  return {
    status_code: statusCode,
    message,
    data,
    meta: {
      requested_at: new Date().toISOString(),
    },
  };
}

function getCookie(name: string) {
  const cookies = document.cookie ? document.cookie.split('; ') : [];

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.split('=');

    if (key === name) {
      return decodeURIComponent(valueParts.join('='));
    }
  }

  return '';
}

async function fetchCsrfToken() {
  return axios.get(`${API_ROOT}/csrf/`, {
    withCredentials: true,
  });
}

async function getCsrfToken() {
  let csrfToken = getCookie('csrftoken');

  if (!csrfToken) {
    await fetchCsrfToken();
    csrfToken = getCookie('csrftoken');
  }

  return csrfToken;
}

function normalizeEndpoint(endpoint: string) {
  return `/${endpoint.replace(/^\/+|\/+$/g, '')}/`;
}

function normalizePayload<T>(payload: unknown, status: number, statusText: string): BackendEnvelope<T> {
  if (payload && typeof payload === 'object') {
    const envelope = payload as BackendEnvelope<T>;

    if ('error' in envelope || 'data' in envelope) {
      return envelope;
    }

    return {
      error: false,
      data: payload as T,
      message: statusText,
    };
  }

  return {
    error: status >= 400,
    data: payload as T,
    message: typeof payload === 'string' ? payload : statusText,
  };
}

function getRequestErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (responseData && typeof responseData === 'object' && 'message' in responseData) {
      const message = responseData.message;

      if (typeof message === 'string' && message) {
        return message;
      }
    }

    if (typeof responseData === 'string' && responseData) {
      return responseData;
    }

    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

httpClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if ((config.method ?? 'get').toLowerCase() === 'get') {
    return config;
  }

  const csrfToken = await getCsrfToken();

  if (csrfToken) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('X-CSRFToken', csrfToken);
    config.headers = headers;
  }

  return config;
});

async function requestBackend<T>(endpoint: string, body: Record<string, unknown> = {}): Promise<T> {
  try {
    const response = await httpClient.post<BackendEnvelope<T> | T | string>(normalizeEndpoint(endpoint), body);
    const payload = normalizePayload<T>(response.data, response.status, response.statusText);

    if (payload.error) {
      throw new Error(payload.message || `API 요청 실패: ${endpoint}`);
    }

    return payload.data as T;
  } catch (error) {
    throw new Error(getRequestErrorMessage(error, `API 요청 실패: ${endpoint}`));
  }
}

async function requestAction(endpoint: string, body: Record<string, unknown> = {}) {
  try {
    const response = await httpClient.post<BackendEnvelope<unknown> | string>(normalizeEndpoint(endpoint), body);
    const payload = normalizePayload<unknown>(response.data, response.status, response.statusText);

    if (payload.error) {
      throw new Error(payload.message || `API 요청 실패: ${endpoint}`);
    }

    return payload;
  } catch (error) {
    throw new Error(getRequestErrorMessage(error, `API 요청 실패: ${endpoint}`));
  }
}

async function loginRequest(username: string, password: string) {
  try {
    const response = await httpClient.post<BackendEnvelope<unknown> | string>('/login/', { username, password });
    const payload = normalizePayload<unknown>(response.data, response.status, response.statusText);

    if (payload.error) {
      throw new Error(payload.message || '로그인에 실패했습니다.');
    }

    return payload;
  } catch (error) {
    throw new Error(getRequestErrorMessage(error, '로그인에 실패했습니다.'));
  }
}

async function signinRequest(body: {
  username: string;
  password: string;
  name: string;
  verification_question: string;
  verification_answer: string;
}) {
  try {
    const response = await httpClient.post<BackendEnvelope<unknown> | string>('/signin/', body);
    const payload = normalizePayload<unknown>(response.data, response.status, response.statusText);

    if (payload.error) {
      throw new Error(payload.message || '회원가입에 실패했습니다.');
    }

    return payload;
  } catch (error) {
    throw new Error(getRequestErrorMessage(error, '회원가입에 실패했습니다.'));
  }
}

function withAccountDefaults(data: Partial<Account>): Account {
  return {
    ...authDefaultsApiResponse.data,
    ...data,
  };
}

function withCompanyDefaults(data: Partial<CompanyInfo>): CompanyInfo {
  return {
    ...companyApiResponse.data,
    ...data,
  };
}

function ensureArray<T>(value: T[] | T | null | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

async function getAccount() {
  const data = await requestBackend<Partial<Account>>('account/get');
  return withAccountDefaults(data);
}

async function getCompanyInfo() {
  const data = await requestBackend<Partial<CompanyInfo>>('compinfo/get');
  return withCompanyDefaults(data);
}

async function getJobDescriptions() {
  return requestBackend<JobDescription[]>('jd/get');
}

async function getResumesForJob(jobDescriptionId: number) {
  const data = await requestBackend<Resume[] | Resume>('resume/get', { job_description_id: jobDescriptionId });
  return ensureArray(data);
}

async function getReportForResume(resumeId: number) {
  try {
    const data = await requestBackend<AnalysisReport | Record<string, never>>('report/get', { resume_id: resumeId });
    return 'resume_id' in data ? (data as AnalysisReport) : null;
  } catch {
    return null;
  }
}

async function getQuestionsForResume(resumeId: number) {
  try {
    const data = await requestBackend<InterviewQuestion[] | InterviewQuestion>('question/get', { resume_id: resumeId });
    return ensureArray(data);
  } catch {
    return [];
  }
}

async function getDashboardData(): Promise<DashboardPayload> {
  const [account, companyInfo, jobDescriptions] = await Promise.all([
    getAccount(),
    getCompanyInfo(),
    getJobDescriptions(),
  ]);
  const resumes = (await Promise.all(jobDescriptions.map((job) => getResumesForJob(job.id)))).flat();
  const [analysisReports, interviewQuestions] = await Promise.all([
    Promise.all(resumes.map((resume) => getReportForResume(resume.id))),
    Promise.all(resumes.map((resume) => getQuestionsForResume(resume.id))),
  ]);

  return {
    account,
    company_info: companyInfo,
    job_descriptions: jobDescriptions,
    resumes,
    analysis_reports: analysisReports.filter((report): report is AnalysisReport => Boolean(report)),
    interview_questions: interviewQuestions.flat(),
  };
}

function buildRecruitmentPreview(companyInfo: CompanyInfo, jobDescription: JobDescription) {
  return {
    title: jobDescription.job_name,
    sections: [
      `${companyInfo.company_name} - ${companyInfo.company_description}`,
      `주요 업무는 ${jobDescription.main_task}입니다.`,
      `필수 역량은 ${jobDescription.required_skill.join(', ')}이며, 우대 역량은 ${jobDescription.preferred_skill.join(', ')}입니다.`,
      `근무 형태는 ${jobDescription.work_type}, 요구 경력은 ${jobDescription.career_level}입니다.`,
    ],
  };
}

function getLocalDashboardData(): DashboardPayload {
  return {
    account: authDefaultsApiResponse.data,
    company_info: companyApiResponse.data,
    job_descriptions: jobDescriptionsApiResponse.data,
    resumes: coverLettersApiResponse.data,
    analysis_reports: [analysisReportApiResponse.data],
    interview_questions: coverLetterTemplateApiResponse.data,
  };
}

async function getDashboardSource() {
  return USE_MOCK_API ? getLocalDashboardData() : getDashboardData();
}

async function getResumeSourceForJob(jobDescriptionId: number) {
  if (USE_MOCK_API) {
    return getLocalDashboardData().resumes.filter((resume) => resume.job_description_id === jobDescriptionId);
  }

  return getResumesForJob(jobDescriptionId);
}

export const apiClient = {
  getDashboard: async () => toApiResponse('대시보드 데이터를 불러왔습니다.', await getDashboardSource()),

  getCompanyProfile: async () =>
    toApiResponse('회사 정보를 불러왔습니다.', USE_MOCK_API ? companyApiResponse.data : await getCompanyInfo()),

  getJobDescriptions: async () =>
    toApiResponse('JD 목록을 불러왔습니다.', USE_MOCK_API ? jobDescriptionsApiResponse.data : await getJobDescriptions()),

  getCoverLetterDraft: async () => {
    const dashboard = await getDashboardSource();
    return toApiResponse('지원서 입력 초안을 불러왔습니다.', dashboard.resumes[0] ?? coverLettersApiResponse.data[0]);
  },

  getCoverLetters: async () => {
    const dashboard = await getDashboardSource();
    return toApiResponse('지원서 목록을 불러왔습니다.', dashboard.resumes);
  },

  getAnalysisReport: async () => {
    const dashboard = await getDashboardSource();
    return toApiResponse('분석 리포트를 불러왔습니다.', dashboard.analysis_reports[0] ?? analysisReportApiResponse.data);
  },

  getRecruitmentPreview: async () => {
    const dashboard = await getDashboardSource();
    return toApiResponse(
      '모집 공고 미리보기를 생성했습니다.',
      buildRecruitmentPreview(
        dashboard.company_info,
        dashboard.job_descriptions[0] ?? jobDescriptionsApiResponse.data[0],
      ),
    );
  },

  getCoverLetterTemplate: async () => {
    const dashboard = await getDashboardSource();
    return toApiResponse('면접 질문 목록을 불러왔습니다.', dashboard.interview_questions);
  },

  getUserProfile: async () =>
    toApiResponse('계정 정보를 불러왔습니다.', USE_MOCK_API ? authDefaultsApiResponse.data : await getAccount()),

  getAuthDefaults: async () => toApiResponse('인증 화면 기본값을 불러왔습니다.', authDefaultsApiResponse.data),

  login: async (username = authDefaultsApiResponse.data.username, password = authDefaultsApiResponse.data.password) => {
    if (!USE_MOCK_API) {
      await loginRequest(username, password);
    }

    return toApiResponse('로그인되었습니다.', { authenticated: true });
  },

  logout: async () => {
    if (!USE_MOCK_API) {
      await requestAction('logout');
    }

    return toApiResponse('로그아웃되었습니다.', { logout: true });
  },

  saveCompanyProfile: async (body: Partial<CompanyInfo> = {}) => {
    if (!USE_MOCK_API) {
      await requestAction('compinfo/modify', body);
    }

    return toApiResponse('회사 정보가 저장되었습니다.', { updated_at: new Date().toISOString() });
  },

  requestJobAnalysis: async (jdId: string) => {
    const resumes = await getResumeSourceForJob(Number(jdId));
    const resume = resumes[0];

    if (!resume) {
      throw new Error('분석 요청할 지원서가 없습니다.');
    }

    if (!USE_MOCK_API) {
      await requestAction('resume/analize', { id: resume.id });
    }

    return toApiResponse('지원서 분석 요청이 완료되었습니다.', { jd_id: jdId, resume_id: resume.id });
  },

  uploadCoverLetters: async () => {
    const dashboard = await getDashboardSource();
    return toApiResponse('지원서 데이터를 불러왔습니다.', { uploaded_count: dashboard.resumes.length });
  },

  requestCoverLetterAnalysis: async (jdId: string) => {
    const resumes = await getResumeSourceForJob(Number(jdId));
    const resume = resumes[0];

    if (!resume) {
      throw new Error('분석 요청할 지원서가 없습니다.');
    }

    if (!USE_MOCK_API) {
      await requestAction('resume/analize', { id: resume.id });
    }

    return toApiResponse('지원서 분석이 완료되었습니다.', { jd_id: jdId, resume_id: resume.id });
  },

  sendChatMessage: async (question: string): Promise<ApiResponse<ChatMessage>> => {
    return toApiResponse('AI 응답이 추가되었습니다.', {
      role: 'assistant',
      text: `${question} 질문과 관련해 현재 명세의 JD, 지원서, 리포트, 면접 질문 데이터를 기준으로 확인했습니다. 별도 chat endpoint는 추가 명세가 필요합니다.`,
    });
  },

  saveUserProfile: async (body: Partial<Account> = {}) => {
    if (!USE_MOCK_API) {
      await requestAction('account/modify', body);
    }

    return toApiResponse('계정 수정사항을 저장했습니다.', { updated_at: new Date().toISOString() });
  },

  checkSignupId: async () => toApiResponse('아이디 중복 확인을 완료했습니다.', { available: true }),

  completeSignup: async (body: SignupBody = {}) => {
    if (!USE_MOCK_API) {
      await signinRequest({
        username: body.username || authDefaultsApiResponse.data.username,
        password: body.password || authDefaultsApiResponse.data.password,
        name: body.name || authDefaultsApiResponse.data.name,
        verification_question: body.verification_question || authDefaultsApiResponse.data.verification_question,
        verification_answer: body.verification_answer || authDefaultsApiResponse.data.verification_answer,
      });
    }

    return toApiResponse('가입이 완료되었습니다.', { created: true });
  },

  resetPassword: async () => {
    return toApiResponse('비밀번호 재설정을 완료했습니다.', { reset: true });
  },

  generateRecruitmentPost: async (jdIds: string[]) => toApiResponse('모집 공고를 생성했습니다.', { jd_ids: jdIds }),

  downloadRecruitmentPdf: async () =>
    toApiResponse('PDF 다운로드 요청을 처리했습니다.', { file_name: 'recruitment-post.pdf' }),

  generateCoverLetterTemplate: async (jdId: string) =>
    toApiResponse('면접 질문 템플릿을 생성했습니다.', { jd_id: jdId }),

  downloadTemplateDocument: async () =>
    toApiResponse('문서 다운로드 요청을 처리했습니다.', { file_name: 'interview-question-template.docx' }),

  getLocalDashboardData,
};
