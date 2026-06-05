import {
  analysisReportApiResponse,
  authDefaultsApiResponse,
  companyApiResponse,
  companyChoicesApiResponse,
  coverLetterDraftApiResponse,
  coverLettersApiResponse,
  coverLetterTemplateApiResponse,
  dashboardApiResponse,
  jobDescriptionsApiResponse,
  notificationsApiResponse,
  recruitmentPostApiResponse,
  userProfileApiResponse,
  type ApiResponse,
} from '../data/apiMockData';

const DEFAULT_LATENCY = 260;

function cloneData<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function delayedResponse<T>(response: ApiResponse<T>, latency = DEFAULT_LATENCY): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(cloneData(response)), latency);
  });
}

function actionResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    status_code: 200,
    message,
    data,
    meta: {
      requested_at: new Date().toISOString(),
    },
  };
}

export const mockClient = {
  getDashboard: () => delayedResponse(dashboardApiResponse),
  getCompanyProfile: () => delayedResponse(companyApiResponse),
  getCompanyChoices: () => delayedResponse(companyChoicesApiResponse),
  getJobDescriptions: () => delayedResponse(jobDescriptionsApiResponse),
  getCoverLetterDraft: () => delayedResponse(coverLetterDraftApiResponse),
  getCoverLetters: () => delayedResponse(coverLettersApiResponse),
  getAnalysisReport: () => delayedResponse(analysisReportApiResponse),
  getRecruitmentPreview: () => delayedResponse(recruitmentPostApiResponse),
  getCoverLetterTemplate: () => delayedResponse(coverLetterTemplateApiResponse),
  getUserProfile: () => delayedResponse(userProfileApiResponse),
  getNotifications: () => delayedResponse(notificationsApiResponse),
  getAuthDefaults: () => delayedResponse(authDefaultsApiResponse),

  login: () => delayedResponse(actionResponse('로그인되었습니다.', { authenticated: true }), 520),

  saveCompanyProfile: () =>
    delayedResponse(actionResponse('회사 정보가 저장되었습니다.', { updated_at: new Date().toISOString() }), 520),

  requestJobAnalysis: (jdId: string) =>
    delayedResponse(actionResponse('JD 분석 요청이 완료되었습니다.', { jd_id: jdId }), 620),

  uploadCoverLetters: () =>
    delayedResponse(actionResponse('샘플 Excel 파일을 불러왔습니다.', { uploaded_count: coverLettersApiResponse.data.rows.length }), 520),

  requestCoverLetterAnalysis: (jdId: string) =>
    delayedResponse(actionResponse('자기소개서 분석이 완료되었습니다.', { jd_id: jdId }), 700),

  sendChatMessage: (question: string) =>
    delayedResponse(
      actionResponse('AI 답변을 추가했습니다.', {
        role: 'assistant' as const,
        text: `${question} 질문과 관련해 사내 문서, JD, 분석 리포트에서 근거를 찾았습니다. 면접 평가 기준 v3와 채용 운영 가이드를 함께 확인하면 다음 액션을 정리할 수 있습니다.`,
      }),
      560,
    ),

  saveUserProfile: () =>
    delayedResponse(actionResponse('프로필 수정사항을 저장했습니다.', { updated_at: new Date().toISOString() }), 520),

  checkSignupId: () => delayedResponse(actionResponse('사용 가능한 아이디입니다.', { available: true }), 360),

  completeSignup: () => delayedResponse(actionResponse('가입 완료 상태를 표시했습니다.', { created: true }), 620),

  resetPassword: () => delayedResponse(actionResponse('비밀번호 재설정이 완료되었습니다.', { reset: true }), 620),

  generateRecruitmentPost: (jdIds: string[]) =>
    delayedResponse(actionResponse('모집 공고를 생성했습니다.', { jd_ids: jdIds }), 720),

  downloadRecruitmentPdf: () => delayedResponse(actionResponse('PDF 다운로드 목업을 실행했습니다.', { file_name: 'recruitment-post.pdf' }), 420),

  generateCoverLetterTemplate: (jdId: string) =>
    delayedResponse(actionResponse('자기소개서 문항을 생성했습니다.', { jd_id: jdId }), 650),

  downloadTemplateDocument: () =>
    delayedResponse(actionResponse('문서 다운로드 목업을 실행했습니다.', { file_name: 'cover-letter-template.docx' }), 420),
};
