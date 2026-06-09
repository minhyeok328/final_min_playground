# DB 컬럼 정리 메모

이 문서는 현재 프론트 목업을 새 DB 설계 샘플에 맞추며 정리한 원천 컬럼, 파생 데이터, 부족 컬럼을 기록합니다.

## 현재 원천 컬럼으로 채택한 데이터

| 엔티티 | 프론트에서 직접 사용하는 주요 컬럼 |
|--------|-------------------------------------|
| `Account` | `id`, `username`, `password`, `name`, `verification_question`, `verification_answer`, `credit`, `subscribe`, `subscribe_expiration` |
| `AuthKey` | `id`, `account_id`, `description`, `value`, `authorized_resume` |
| `CompanyInfo` | `id`, `account_id`, `company_name`, `employee_count`, `team_composition`, `company_description`, `employ_style` |
| `JobDescription` | `id`, `account_id`, `job_name`, `education_level`, `major`, `career_level`, `required_skill`, `preferred_skill`, `main_task`, `hiring_reason`, `work_type`, `status`, `created_at`, `updated_at` |
| `Resume` | `id`, `job_description_id`, `name`, `skill`, `education_level`, `experience`, `self_intoduction`, `certification`, `language`, `award`, `training`, `other_activity`, `status`, `reviewed`, `reviewed_at`, `created_at`, `updated_at` |
| `AnalysisReport` | `id`, `resume_id`, `overall_grade`, `overall_summary`, `candidate_summary`, `checklist`, `competency_analysis`, `fit_analysis`, `strength`, `concern`, `check_point`, `final_comment` |
| `InterviewQuestion` | `id`, `resume_id`, `question`, `answer`, `purpose` |

## DB에 없어서 프론트에서 계산하는 값

| 화면용 값 | 계산 기준 |
|-----------|-----------|
| 대시보드 `metrics` | `JobDescription.status`, `Resume.status`, `Resume.reviewed`, `AnalysisReport` 개수, `Account.credit` |
| 대시보드 평균 점수 | `AnalysisReport.overall_grade`를 A=94, B=82, C=68, D=46, F=20으로 변환 |
| `creditPercent` | `Account.credit / 200` 기준 임시 퍼센트 |
| JD 평균 점수 | JD에 연결된 `Resume`들의 리포트 등급 평균 |
| 회사 프로필 완성도 | `CompanyInfo` 주요 필드 입력 여부 |
| 리포트 탭 | `AnalysisReport`의 요약, 체크리스트, 역량, 적합성, 강점/우려/확인 포인트를 UI 탭으로 묶음 |
| 모집 공고 미리보기 | `CompanyInfo.company_description` + `JobDescription` 컬럼 조합 |
| 문서 검색 채팅 예시 | 현재는 `AnalysisReport.check_point`, `InterviewQuestion.question` 기반 목업 |

## 기존 화면에서 제거하거나 대체한 컬럼

| 기존 필드 | 처리 |
|-----------|------|
| `email` | 새 `Account` 기준에 없어 제거 |
| `display_name` | `Account.name`으로 대체 |
| `avatar_url` | DB에 없어 이니셜 아바타로 대체 |
| `last_login_at` | DB에 없어 제거 |
| `notification_channel` | DB에 없어 제거 |
| `notifications` | 별도 엔티티가 없어 초기 로드에서 제거 |
| `industry`, `location` | `CompanyInfo`에 없어 제거 |
| `core_values`, `benefits` | `CompanyInfo.employ_style`로 대체 |
| `profile_completion` | 프론트 계산값으로 대체 |
| `team_name` | JD 컬럼에 없어 `education_level · career_level` 요약으로 대체 |
| `fit_score`, `analysis_score` | 리포트 등급 기반 점수로 대체 |
| `status_label` | 실제 status enum을 라벨화 |
| `cover_letters` | 별도 테이블이 없어 `Resume.self_intoduction`으로 대체 |

## 기능을 유지하려면 추가 설계가 필요한 컬럼/테이블

| 필요 기능 | 추가 후보 |
|-----------|-----------|
| 이메일 로그인/알림 | `Account.email`, `Notification` 테이블 또는 알림 이벤트 로그 |
| 사용자 프로필 이미지 | `Account.avatar_url` 또는 파일 테이블 |
| 최근 로그인 표시 | `Account.last_login_at` |
| 회사 위치/산업군/복지 | `CompanyInfo.industry`, `CompanyInfo.location`, `CompanyInfo.benefit` |
| 업로드 원본 파일 관리 | `Resume.file_name`, `Resume.file_path`, `Resume.file_type`, `Resume.parse_error` |
| 리포트 생성 상태/시각 | `AnalysisReport.status`, `created_at`, `updated_at` |
| 질문 분류/우선순위 | `InterviewQuestion.category`, `priority`, `difficulty`, `sort_order` |
| 리뷰 담당자 추적 | `Resume.reviewed_by` 또는 별도 review log |

## 주의

- 설계 샘플의 `self_intoduction` 오탈자는 현재 기준 문서의 컬럼명을 그대로 따랐습니다. 백엔드에서 `self_introduction`으로 정정한다면 프론트 타입도 함께 바꿔야 합니다.
- `Account.password`는 샘플 기준으로 유지했지만, 실제 서비스에서는 평문 저장 없이 해시 컬럼으로 바꿔야 합니다.
