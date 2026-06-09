import { useCallback, useEffect, useState } from 'react';
import {
  mapAnalysisReport,
  mapCompany,
  mapCoverLetterDraft,
  mapCoverLetterRows,
  mapDashboard,
  mapJdList,
  mapTemplateQuestions,
  mapUserProfile,
  type AnalysisReportData,
  type AuthDefaults,
  type CompanyProfile,
  type CoverLetterDraft,
  type CoverLetterRow,
  type DashboardData,
  type JdItem,
  type RecruitmentPreview,
  type TemplateQuestion,
  type UserProfile,
} from '../api/adapters';
import { apiClient } from '../api/backendClient';

export type MockAppData = {
  dashboard: DashboardData;
  company: CompanyProfile;
  jdList: JdItem[];
  coverLetterDraft: CoverLetterDraft;
  coverLetterRows: CoverLetterRow[];
  analysisReport: AnalysisReportData;
  recruitmentPreview: RecruitmentPreview;
  templateQuestions: TemplateQuestion[];
  userProfile: UserProfile;
  authDefaults: AuthDefaults;
};

export function useMockAppData() {
  const [data, setData] = useState<MockAppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboard, authDefaults] = await Promise.all([apiClient.getDashboard(), apiClient.getAuthDefaults()]);
      const fallback = apiClient.getLocalDashboardData();
      const dashboardSource = dashboard.data;
      const account = dashboardSource.account ?? fallback.account;
      const company = dashboardSource.company_info ?? fallback.company_info;
      const jobDescriptions = dashboardSource.job_descriptions.length
        ? dashboardSource.job_descriptions
        : fallback.job_descriptions;
      const resumes = dashboardSource.resumes.length ? dashboardSource.resumes : fallback.resumes;
      const analysisReports = dashboardSource.analysis_reports.length
        ? dashboardSource.analysis_reports
        : fallback.analysis_reports;
      const interviewQuestions = dashboardSource.interview_questions.length
        ? dashboardSource.interview_questions
        : fallback.interview_questions;
      const normalizedDashboard = {
        account,
        company_info: company,
        job_descriptions: jobDescriptions,
        resumes,
        analysis_reports: analysisReports,
        interview_questions: interviewQuestions,
      };
      const firstJob = jobDescriptions[0];
      const recruitmentPreview = firstJob
        ? {
            title: firstJob.job_name,
            sections: [
              `${company.company_name}는 ${company.company_description}`,
              `주요 업무는 ${firstJob.main_task}입니다.`,
              `필수 역량은 ${firstJob.required_skill.join(', ')}이며, 우대 역량은 ${firstJob.preferred_skill.join(', ')}입니다.`,
              `근무 형태는 ${firstJob.work_type}, 요구 경력은 ${firstJob.career_level}입니다.`,
            ],
          }
        : { title: '모집 공고', sections: [] };

      setData({
        dashboard: mapDashboard(normalizedDashboard),
        company: mapCompany(company),
        jdList: mapJdList(jobDescriptions, resumes, analysisReports),
        coverLetterDraft: mapCoverLetterDraft(resumes[0]),
        coverLetterRows: mapCoverLetterRows(resumes, jobDescriptions, analysisReports),
        analysisReport: mapAnalysisReport(analysisReports[0], resumes, jobDescriptions, interviewQuestions),
        recruitmentPreview,
        templateQuestions: mapTemplateQuestions(interviewQuestions),
        userProfile: mapUserProfile(account, company),
        authDefaults: authDefaults.data,
      });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'API 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void reload();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [reload]);

  return { data, loading, error, reload };
}
