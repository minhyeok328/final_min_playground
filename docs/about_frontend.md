# 프론트엔드·백엔드 협업 참고 (일반)

> **이 문서는 팀 학습용 일반 가이드입니다.**  
> **HumouR UI 고도화 목업**(`final_min_playground`)은 현재 [`backendClient`](../src/api/backendClient.ts)로 backend 명세의 `/api/{endpoint}/` 호출을 수행하고, 명세가 부족한 영역만 [`apiMockData.ts`](../src/data/apiMockData.ts) 샘플로 보완합니다.  
> 레포 실행·화면별 JSON 계약은 [docs/README.md](./README.md) · [08-features](./08-features/README.md)를 보세요.

---

# 전체 그림: 프론트엔드는 “화면”이 아니라 “사용자와 백엔드 사이의 계약을 구현하는 영역”이다

주니어 때는 프론트엔드를 “버튼 만들고, 페이지 꾸미고, API 호출해서 데이터 뿌리는 일” 정도로 생각하기 쉽다. 그런데 실무에서는 프론트엔드가 **사용자 행동을 백엔드 API 요청으로 바꾸고, 백엔드 응답을 다시 사용자가 이해할 수 있는 화면 상태로 바꾸는 역할**을 한다.

예를 들어 사용자가 게시글 작성 버튼을 누르면 실제로는 이런 일이 일어난다.

```text
사용자 클릭
→ React/Vue 이벤트 핸들러 실행
→ 입력값 검증
→ Axios/fetch로 API 요청
→ Django/FastAPI/Flask 서버가 요청 처리
→ 서버가 DB에 저장
→ 서버가 JSON 응답 반환
→ 프론트엔드가 응답을 받아 상태 업데이트
→ 화면에 성공 메시지 또는 에러 표시
```

즉, 프론트엔드 개발자는 단순히 UI만 만드는 사람이 아니라 다음을 이해해야 한다.

```text
화면 요구사항
+ API 명세
+ 인증 방식
+ 데이터 구조
+ 에러 케이스
+ 배포 URL
+ 브라우저 보안 정책
+ 상태 관리
```

이걸 이해하지 못하면 화면은 예쁘게 만들었는데 실제 서비스에서는 이런 문제가 자주 터진다.

```text
로그인이 풀림
배포 후 API 호출이 안 됨
CORS 에러 발생
응답 구조가 달라져서 화면 깨짐
null 에러로 흰 화면 발생
401 에러인데 사용자는 이유를 모름
개발 환경에서는 됐는데 운영 환경에서는 안 됨
```

그래서 백엔드와 협업하는 프론트엔드 개발자는 **API를 읽고, 요청을 만들고, 응답을 해석하고, 에러를 사용자 경험으로 처리할 수 있어야 한다.**

---

# 1. 프론트엔드 개발자의 역할

## 화면 구현만 하는 것이 아닌 이유

프론트엔드는 사용자가 직접 보는 영역이다. 하지만 실무에서 화면은 거의 항상 백엔드 데이터와 연결된다.

예를 들어 “마이페이지” 화면을 만든다고 하자.

겉으로 보면 해야 할 일은 이런 것처럼 보인다.

```text
프로필 이미지 표시
닉네임 표시
이메일 표시
수정 버튼 만들기
```

하지만 실제로는 다음을 모두 알아야 한다.

```text
현재 로그인한 사용자를 어떻게 식별하는가?
사용자 정보 API는 무엇인가?
응답 데이터 구조는 어떻게 생겼는가?
프로필 이미지가 null이면 어떻게 보여줄 것인가?
수정 API는 PUT인가 PATCH인가?
닉네임 중복 에러는 어떤 status code로 오는가?
토큰이 만료되면 로그인 페이지로 보낼 것인가?
```

즉, 프론트엔드는 **디자인 시안을 HTML/CSS로 옮기는 역할**에서 끝나지 않는다.
실제 서비스에서는 **데이터 흐름, API 계약, 인증 상태, 예외 상황, 배포 환경**까지 다룬다.

---

## 백엔드, DB, 인프라와 어떤 지점에서 협업하는가

프론트엔드가 DB에 직접 접근하는 일은 거의 없다. 하지만 DB 구조의 영향을 간접적으로 많이 받는다.

예를 들어 백엔드가 DB에서 사용자 정보를 가져와 이런 응답을 준다고 하자.

```json
{
  "id": 1,
  "email": "junior@example.com",
  "nickname": "junior_dev",
  "profile_image": null
}
```

프론트엔드는 이 응답을 화면에 사용한다.

```tsx
<img src={user.profile_image ?? "/default-profile.png"} />
<p>{user.nickname}</p>
<p>{user.email}</p>
```

여기서 백엔드나 DB 쪽에서 필드명이 바뀌면 문제가 생긴다.

```json
{
  "id": 1,
  "email": "junior@example.com",
  "name": "junior_dev",
  "avatar_url": null
}
```

기존 프론트엔드 코드는 `nickname`, `profile_image`를 찾고 있기 때문에 화면에 값이 안 나오거나 에러가 난다.

그래서 프론트엔드는 DB를 직접 다루지 않더라도, 백엔드가 어떤 데이터를 어떤 이름과 구조로 내려주는지 이해해야 한다.

협업 지점은 보통 다음과 같다.

```text
기획/디자인
→ 어떤 화면에서 어떤 데이터가 필요한지 정리

백엔드
→ 어떤 API가 필요한지, 요청/응답 구조는 어떤지 협의

DB
→ 직접 접근하지는 않지만 데이터 필드, null 가능성, 관계 구조의 영향을 받음

인프라/배포
→ API base URL, CORS, 도메인, HTTPS, 쿠키, Nginx 설정 등에 영향 받음
```

---

## API 명세서를 읽고 이해하는 능력이 왜 중요한가

API 명세서는 프론트엔드와 백엔드 사이의 **계약서**다.

예를 들어 로그인 API 명세가 이렇게 되어 있다고 하자.

```text
POST /api/auth/login

Request Body
{
  "email": "string",
  "password": "string"
}

Response 200
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": 1,
    "email": "string",
    "nickname": "string"
  }
}

Response 401
{
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

프론트엔드는 이걸 보고 다음을 판단해야 한다.

```text
POST 요청을 보내야 한다.
email, password를 request body에 넣어야 한다.
성공하면 accessToken을 저장해야 한다.
실패하면 401 에러 메시지를 화면에 보여줘야 한다.
로그인 후 user 정보를 전역 상태에 저장할 수 있다.
```

명세서를 못 읽으면 백엔드에게 계속 이런 질문을 하게 된다.

```text
어디로 요청 보내요?
GET이에요 POST예요?
body에 넣어요 query에 넣어요?
응답에서 어떤 필드를 쓰면 돼요?
로그인 실패하면 뭐가 와요?
```

이 질문 자체가 나쁜 것은 아니다. 다만 API 명세를 읽고도 판단할 수 있어야 실무 속도가 빨라진다.

---

# 2. 백엔드와 프론트엔드의 연결 구조

## 사용자가 버튼을 누르면 백엔드까지 어떤 흐름으로 요청이 가는가

예를 들어 사용자가 “게시글 작성” 버튼을 누른다고 하자.

React 컴포넌트에서는 보통 이런 흐름이다.

```tsx
function PostCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    await createPost({
      title,
      content,
    });
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSubmit}>작성</button>
    </div>
  );
}
```

`handleSubmit`이 실행되면 `createPost` 함수가 API 요청을 보낸다.

```tsx
import axios from "axios";

export async function createPost(data: {
  title: string;
  content: string;
}) {
  const response = await axios.post("/api/posts", data);
  return response.data;
}
```

이 요청은 백엔드 서버로 간다.

```text
POST /api/posts
Content-Type: application/json

{
  "title": "첫 게시글",
  "content": "내용입니다."
}
```

백엔드 서버는 이 요청을 받아 유효성 검사 후 DB에 저장하고 응답한다.

```json
{
  "id": 10,
  "title": "첫 게시글",
  "content": "내용입니다.",
  "createdAt": "2026-06-03T10:30:00Z"
}
```

프론트엔드는 이 응답을 받아서 화면을 바꾼다.

```text
작성 성공 알림 표시
게시글 상세 페이지로 이동
목록 데이터 다시 불러오기
```

---

## 전체 요청 흐름

실무에서 가장 기본이 되는 흐름은 다음이다.

```text
브라우저
→ React/Vue 앱 실행
→ 사용자 이벤트 발생
→ Axios 또는 fetch로 HTTP 요청 생성
→ API 서버로 요청 전송
→ Django/FastAPI/Flask 라우터가 요청 수신
→ 서비스 로직 실행
→ DB 조회 또는 저장
→ JSON 응답 반환
→ 프론트엔드에서 응답 파싱
→ 상태 업데이트
→ 화면 반영
```

예를 들어 게시글 목록 조회는 다음처럼 동작한다.

```text
사용자가 게시글 목록 페이지 접속
→ React의 useEffect 실행
→ GET /api/posts 요청
→ 백엔드가 DB에서 게시글 목록 조회
→ JSON 배열 반환
→ setPosts(response.data)
→ posts.map으로 화면 렌더링
```

React 코드로 보면 다음과 같다.

```tsx
import { useEffect, useState } from "react";
import axios from "axios";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await axios.get<Post[]>("/api/posts");
      setPosts(response.data);
    }

    fetchPosts();
  }, []);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

## Django, FastAPI, Flask가 프론트엔드 입장에서 어떻게 보이는가

프론트엔드 입장에서는 Django, FastAPI, Flask 모두 결국 **HTTP API 서버**다.

즉, 프론트엔드가 보는 것은 내부 구현이 아니라 다음이다.

```text
API URL
HTTP method
request 형식
response 형식
status code
인증 방식
CORS 설정
```

하지만 프레임워크마다 실무에서 자주 보이는 차이는 있다.

| 백엔드                            | 프론트엔드 입장에서 자주 보이는 특징                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Django / Django REST Framework | `/api/users/`처럼 trailing slash가 붙는 경우가 많음. 세션 인증, CSRF, pagination 응답 구조를 자주 만남.                        |
| FastAPI                        | Swagger 문서(`/docs`)가 자동으로 잘 제공되는 경우가 많음. request/response schema가 명확한 편. validation error가 상세하게 내려오는 편. |
| Flask                          | 팀마다 구조 차이가 큼. API 문서화 방식이 제각각일 수 있음. 응답 포맷을 백엔드와 더 꼼꼼히 맞춰야 하는 경우가 많음.                                   |

예를 들어 Django REST Framework에서는 목록 응답이 단순 배열이 아니라 이렇게 올 수 있다.

```json
{
  "count": 125,
  "next": "https://api.example.com/posts/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "게시글"
    }
  ]
}
```

그런데 프론트엔드가 배열이라고 생각하고 이렇게 쓰면 터진다.

```tsx
posts.map((post) => post.title)
```

실제 데이터는 `response.data.results`에 있기 때문이다.

```tsx
setPosts(response.data.results);
```

FastAPI에서는 문서가 이렇게 명확할 수 있다.

```text
GET /posts
Response
[
  {
    "id": 1,
    "title": "string",
    "created_at": "datetime"
  }
]
```

Flask는 프로젝트마다 응답 형식이 다를 수 있다.

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "게시글"
    }
  ]
}
```

그래서 프론트엔드 입장에서는 백엔드 프레임워크 이름보다 **실제 API 명세와 응답 구조 확인**이 훨씬 중요하다.

---

# 3. API 호출 방식

## REST API란 무엇인가

REST API는 웹에서 데이터를 주고받기 위한 API 설계 방식 중 하나다.
쉽게 말하면 **URL은 자원을 나타내고, HTTP method는 행동을 나타내는 방식**이다.

예를 들어 게시글이라는 자원이 있다고 하자.

```text
GET    /posts        게시글 목록 조회
GET    /posts/1      1번 게시글 조회
POST   /posts        게시글 생성
PATCH  /posts/1      1번 게시글 일부 수정
DELETE /posts/1      1번 게시글 삭제
```

여기서 `/posts`는 게시글이라는 자원이고, `GET`, `POST`, `PATCH`, `DELETE`가 행동이다.

---

## GET, POST, PUT/PATCH, DELETE 차이

| Method | 용도     | 예시           |
| ------ | ------ | ------------ |
| GET    | 데이터 조회 | 게시글 목록 조회    |
| POST   | 데이터 생성 | 게시글 작성, 로그인  |
| PUT    | 전체 수정  | 게시글 전체 내용 교체 |
| PATCH  | 일부 수정  | 닉네임만 수정      |
| DELETE | 데이터 삭제 | 게시글 삭제       |

실무 예시는 다음과 같다.

```tsx
// 목록 조회
axios.get("/api/posts");

// 상세 조회
axios.get("/api/posts/1");

// 생성
axios.post("/api/posts", {
  title: "제목",
  content: "내용",
});

// 전체 수정
axios.put("/api/posts/1", {
  title: "새 제목",
  content: "새 내용",
});

// 일부 수정
axios.patch("/api/users/me", {
  nickname: "new_nickname",
});

// 삭제
axios.delete("/api/posts/1");
```

실무에서는 `PUT`과 `PATCH`를 혼용하는 팀도 있다. 그래서 반드시 API 명세를 확인해야 한다.

---

## request body, query parameter, path parameter 차이

API 요청에는 데이터를 보내는 방식이 여러 가지 있다.

## 1. Path Parameter

URL 경로 안에 들어가는 값이다.

```text
GET /api/posts/10
```

여기서 `10`은 게시글 ID다.

React 코드에서는 보통 이렇게 쓴다.

```tsx
const postId = 10;

const response = await axios.get(`/api/posts/${postId}`);
```

사용 예시는 다음과 같다.

```text
특정 게시글 조회
특정 사용자 조회
특정 상품 조회
```

---

## 2. Query Parameter

URL 뒤에 `?`로 붙는 검색 조건이다.

```text
GET /api/posts?page=1&keyword=react
```

React 코드에서는 이렇게 쓴다.

```tsx
const response = await axios.get("/api/posts", {
  params: {
    page: 1,
    keyword: "react",
  },
});
```

사용 예시는 다음과 같다.

```text
검색
필터
정렬
페이지네이션
```

예를 들어 게시글 목록에서 검색어와 페이지 번호를 넘길 때 사용한다.

```tsx
axios.get("/api/posts", {
  params: {
    page: 2,
    size: 20,
    keyword: "frontend",
    sort: "createdAt,desc",
  },
});
```

---

## 3. Request Body

요청 본문에 JSON 데이터를 담아 보내는 방식이다.

```text
POST /api/posts
Content-Type: application/json

{
  "title": "제목",
  "content": "내용"
}
```

React 코드에서는 이렇게 쓴다.

```tsx
axios.post("/api/posts", {
  title: "제목",
  content: "내용",
});
```

사용 예시는 다음과 같다.

```text
회원가입
로그인
게시글 작성
프로필 수정
주문 생성
```

정리하면 다음과 같다.

| 구분              | 위치     | 사용 예                          |
| --------------- | ------ | ----------------------------- |
| Path Parameter  | URL 경로 | `/posts/10`                   |
| Query Parameter | URL 뒤  | `/posts?page=1&keyword=react` |
| Request Body    | 요청 본문  | `{ "title": "제목" }`           |

---

## JSON 응답을 프론트엔드에서 어떻게 사용하는가

백엔드 API는 보통 JSON으로 응답한다.

```json
{
  "id": 1,
  "title": "프론트엔드 실무",
  "author": {
    "id": 5,
    "nickname": "senior_dev"
  },
  "createdAt": "2026-06-03T12:00:00Z"
}
```

프론트엔드는 이 응답을 JavaScript 객체처럼 사용한다.

```tsx
const response = await axios.get("/api/posts/1");

console.log(response.data.title);
console.log(response.data.author.nickname);
```

화면에서는 이렇게 렌더링한다.

```tsx
<h1>{post.title}</h1>
<p>작성자: {post.author.nickname}</p>
```

단, 실무에서는 값이 항상 있다고 가정하면 위험하다.

```tsx
<p>작성자: {post.author.nickname}</p>
```

`author`가 `null`이면 이 코드는 에러가 난다.

```text
Cannot read properties of null
```

안전하게 처리하려면 다음처럼 작성한다.

```tsx
<p>작성자: {post.author?.nickname ?? "알 수 없음"}</p>
```

`?.`는 optional chaining이라고 한다.
중간 값이 `null` 또는 `undefined`일 때 에러를 내지 않고 `undefined`를 반환한다.

`??`는 nullish coalescing이라고 한다.
왼쪽 값이 `null` 또는 `undefined`일 때 기본값을 사용한다.

---

## Axios와 fetch의 차이

`fetch`는 브라우저에 기본 내장된 API다. 별도 설치가 필요 없다.

```tsx
const response = await fetch("/api/posts");
const data = await response.json();
```

`Axios`는 별도 설치가 필요한 HTTP 클라이언트 라이브러리다.

```tsx
const response = await axios.get("/api/posts");
const data = response.data;
```

실무에서는 Axios를 많이 쓰는 이유가 있다.

| 구분          | fetch                     | Axios                   |
| ----------- | ------------------------- | ----------------------- |
| 설치          | 브라우저 기본 내장                | 설치 필요                   |
| JSON 처리     | 직접 `response.json()` 호출   | 자동으로 `response.data` 제공 |
| 에러 처리       | 400/500도 기본적으로 catch로 안 감 | 400/500 응답은 catch로 감    |
| baseURL 설정  | 직접 구현 필요                  | 쉬움                      |
| interceptor | 직접 구현 필요                  | 지원                      |
| 요청/응답 공통 처리 | 번거로움                      | 편함                      |

예를 들어 Axios는 토큰을 모든 요청에 자동으로 붙이는 interceptor를 만들기 좋다.

---

## Axios 기본 사용 예시 코드

설치:

```bash
npm install axios
```

기본 GET 요청:

```tsx
import axios from "axios";

async function fetchPosts() {
  const response = await axios.get("/api/posts");
  return response.data;
}
```

POST 요청:

```tsx
import axios from "axios";

async function createPost() {
  const response = await axios.post("/api/posts", {
    title: "제목",
    content: "내용",
  });

  return response.data;
}
```

실무에서는 보통 Axios 인스턴스를 따로 만든다.

```tsx
// src/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

API 함수는 별도 파일로 분리한다.

```tsx
// src/api/postApi.ts
import { apiClient } from "./client";

export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export type CreatePostRequest = {
  title: string;
  content: string;
};

export async function getPosts(): Promise<Post[]> {
  const response = await apiClient.get<Post[]>("/posts");
  return response.data;
}

export async function createPost(
  data: CreatePostRequest
): Promise<Post> {
  const response = await apiClient.post<Post>("/posts", data);
  return response.data;
}
```

컴포넌트에서는 API 함수를 호출만 한다.

```tsx
// src/pages/PostListPage.tsx
import { useEffect, useState } from "react";
import { getPosts, type Post } from "../api/postApi";

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        setErrorMessage("게시글 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (isLoading) return <p>불러오는 중...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

# 4. 프론트엔드에서 API를 다룰 때 필요한 실무 개념

## loading 상태 처리

API 요청은 즉시 끝나지 않는다. 네트워크 상황, 서버 처리 시간, DB 조회 시간에 따라 지연될 수 있다.

그래서 프론트엔드는 “요청 중” 상태를 관리해야 한다.

```tsx
const [isLoading, setIsLoading] = useState(false);
```

실무 패턴은 다음과 같다.

```tsx
try {
  setIsLoading(true);

  const data = await getPosts();
  setPosts(data);
} finally {
  setIsLoading(false);
}
```

사용자 입장에서는 loading 처리가 없으면 버튼을 눌렀는데 아무 반응이 없는 것처럼 보인다.
그러면 여러 번 클릭하거나, 서비스가 멈췄다고 느낀다.

버튼 요청에서는 중복 클릭 방지도 중요하다.

```tsx
<button disabled={isLoading} onClick={handleSubmit}>
  {isLoading ? "저장 중..." : "저장"}
</button>
```

---

## error 처리

API 요청은 실패할 수 있다.

```text
네트워크 끊김
서버 에러
인증 만료
권한 없음
잘못된 요청
없는 데이터 요청
```

그래서 반드시 에러 처리를 해야 한다.

```tsx
try {
  const data = await getPost(postId);
  setPost(data);
} catch (error) {
  setErrorMessage("게시글을 불러오지 못했습니다.");
}
```

실무에서는 단순히 콘솔에 찍는 것만으로 부족하다.

```tsx
console.error(error);
```

개발자는 원인을 알아야 하고, 사용자는 현재 상황을 알아야 한다.

```tsx
catch (error) {
  console.error(error);
  setErrorMessage("일시적인 오류가 발생했습니다. 다시 시도해 주세요.");
}
```

---

## try/catch

`async/await`를 사용할 때 에러를 잡는 기본 방식이다.

```tsx
async function handleSubmit() {
  try {
    setIsLoading(true);

    await createPost({
      title,
      content,
    });

    alert("게시글이 작성되었습니다.");
  } catch (error) {
    alert("게시글 작성에 실패했습니다.");
  } finally {
    setIsLoading(false);
  }
}
```

`finally`는 성공하든 실패하든 마지막에 실행된다.
그래서 loading 상태를 끄는 코드를 넣기 좋다.

---

## status code 이해

HTTP status code는 서버가 요청 결과를 숫자로 알려주는 방식이다.

자주 보는 코드는 다음과 같다.

| Status Code | 의미             | 프론트엔드 대응          |
| ----------- | -------------- | ----------------- |
| 200         | 성공             | 데이터 표시            |
| 201         | 생성 성공          | 작성 완료 처리          |
| 204         | 성공했지만 응답 본문 없음 | 삭제 성공 처리          |
| 400         | 잘못된 요청         | 입력값 확인 메시지        |
| 401         | 인증 필요 또는 토큰 만료 | 로그인 페이지 이동, 토큰 갱신 |
| 403         | 권한 없음          | 접근 권한 없음 안내       |
| 404         | 리소스 없음         | 없는 페이지/데이터 안내     |
| 500         | 서버 내부 오류       | 서버 오류 안내, 재시도 유도  |

---

## 400, 401, 403, 404, 500 에러 의미

## 400 Bad Request

프론트엔드가 잘못된 데이터를 보냈을 때 자주 발생한다.

예:

```json
{
  "email": "invalid-email",
  "password": ""
}
```

백엔드 응답:

```json
{
  "message": "이메일 형식이 올바르지 않습니다."
}
```

프론트엔드 대응:

```tsx
setErrorMessage("입력값을 확인해 주세요.");
```

---

## 401 Unauthorized

인증이 안 되었거나 access token이 만료된 경우다.

예:

```text
Authorization header 없음
access token 만료
잘못된 token
```

프론트엔드 대응:

```text
refresh token으로 access token 재발급 시도
재발급 실패 시 로그아웃
로그인 페이지로 이동
```

---

## 403 Forbidden

인증은 되었지만 권한이 없는 경우다.

예:

```text
일반 사용자가 관리자 페이지 접근
다른 사용자의 주문 내역 수정 시도
작성자가 아닌데 게시글 삭제 시도
```

프론트엔드 대응:

```tsx
setErrorMessage("접근 권한이 없습니다.");
```

---

## 404 Not Found

요청한 리소스가 없는 경우다.

예:

```text
GET /api/posts/999999
```

프론트엔드 대응:

```tsx
setErrorMessage("존재하지 않는 게시글입니다.");
```

또는 상세 페이지에서 404 페이지로 이동시킬 수 있다.

---

## 500 Internal Server Error

백엔드 서버 내부 오류다.

예:

```text
DB 오류
서버 코드 예외
외부 API 장애
```

프론트엔드는 보통 직접 해결할 수 없다.
다만 사용자에게 적절한 메시지를 보여주고, 백엔드에게 요청 로그와 재현 방법을 전달해야 한다.

```tsx
setErrorMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
```

---

## 응답 데이터 구조가 바뀌었을 때 생기는 문제

처음에는 백엔드 응답이 이렇게 왔다고 하자.

```json
[
  {
    "id": 1,
    "title": "게시글"
  }
]
```

그래서 프론트엔드는 이렇게 작성했다.

```tsx
setPosts(response.data);
```

그런데 페이지네이션이 추가되면서 응답이 이렇게 바뀌었다.

```json
{
  "totalCount": 100,
  "items": [
    {
      "id": 1,
      "title": "게시글"
    }
  ]
}
```

기존 코드는 깨진다.

```tsx
posts.map(...)
```

왜냐하면 `posts`에 배열이 아니라 객체가 들어갔기 때문이다.

이런 문제를 줄이려면 API 응답 타입을 명확히 정의해야 한다.

```tsx
type PostListResponse = {
  totalCount: number;
  items: Post[];
};

const response = await apiClient.get<PostListResponse>("/posts");
setPosts(response.data.items);
```

그리고 백엔드와 응답 구조 변경 전에 반드시 협의해야 한다.

---

## API 명세서와 실제 응답이 다를 때 대응하는 방법

실무에서 자주 발생한다.

명세서:

```json
{
  "id": 1,
  "nickname": "junior"
}
```

실제 응답:

```json
{
  "user_id": 1,
  "name": "junior"
}
```

이럴 때 프론트엔드가 임의로 맞춰서 개발하면 안 된다.
해야 할 일은 다음이다.

```text
1. 실제 요청 URL, method, request body를 확인한다.
2. 브라우저 Network 탭에서 실제 response를 캡처한다.
3. 명세서와 다른 필드를 정리한다.
4. 백엔드에게 어떤 것이 기준인지 확인한다.
5. 결정된 기준에 맞춰 명세서 또는 코드를 수정한다.
```

백엔드에게 이렇게 질문하면 좋다.

```text
현재 명세서에는 nickname으로 되어 있는데 실제 응답은 name으로 내려오고 있습니다.
프론트에서는 어떤 필드를 기준으로 작업하면 될까요?
명세서를 name으로 수정할지, API 응답을 nickname으로 맞출지 결정 부탁드립니다.
```

핵심은 **프론트엔드에서 조용히 우회하지 말고 계약을 맞추는 것**이다.

---

# 5. 인증/로그인 처리

## 로그인 API 호출 흐름

일반적인 로그인 흐름은 다음과 같다.

```text
사용자가 이메일/비밀번호 입력
→ POST /auth/login 요청
→ 백엔드가 사용자 검증
→ 성공 시 access token, refresh token 반환
→ 프론트엔드가 token 저장
→ 이후 인증이 필요한 API 요청에 access token 첨부
→ access token 만료 시 refresh token으로 재발급
```

React 예시는 다음과 같다.

```tsx
// src/api/authApi.ts
import { apiClient } from "./client";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
}
```

로그인 페이지:

```tsx
import { useState } from "react";
import { login } from "../api/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      setErrorMessage("");

      const data = await login({ email, password });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 예: 메인 페이지 이동
      window.location.href = "/";
    } catch (error) {
      setErrorMessage("이메일 또는 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        type="password"
      />
      <button onClick={handleLogin}>로그인</button>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
```

---

## access token, refresh token 개념

## Access Token

API 요청할 때 “나 로그인한 사용자입니다”라고 증명하는 짧은 수명의 토큰이다.

```text
수명: 짧음
사용처: 인증이 필요한 API 호출
예: 15분, 30분, 1시간
```

요청 예:

```text
GET /api/users/me
Authorization: Bearer access-token-value
```

---

## Refresh Token

access token이 만료되었을 때 새 access token을 발급받기 위한 긴 수명의 토큰이다.

```text
수명: access token보다 김
사용처: access token 재발급
예: 7일, 14일, 30일
```

흐름:

```text
API 요청
→ 401 발생
→ refresh token으로 /auth/refresh 요청
→ 새 access token 발급
→ 원래 요청 재시도
```

---

## JWT 방식에서 프론트엔드가 해야 할 일

JWT는 JSON Web Token의 약자다.
로그인 정보를 담은 토큰 문자열이라고 이해하면 된다.

프론트엔드가 JWT 환경에서 보통 해야 하는 일은 다음이다.

```text
로그인 성공 시 token 저장
인증 필요한 API 요청에 Authorization header 추가
401 에러 발생 시 token 만료 여부 판단
refresh token으로 access token 재발급
재발급 실패 시 로그아웃 처리
로그인 상태에 따라 라우팅 제어
```

Axios interceptor로 Authorization header를 붙일 수 있다.

```tsx
// src/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
```

이렇게 하면 매번 API 함수에서 직접 header를 붙이지 않아도 된다.

```tsx
// 매번 이렇게 하지 않아도 됨
axios.get("/users/me", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

---

## localStorage, sessionStorage, cookie 차이

| 저장 위치          | 특징           | 장점                        | 단점                |
| -------------- | ------------ | ------------------------- | ----------------- |
| localStorage   | 브라우저에 계속 남음  | 구현 쉬움, 새로고침해도 유지          | XSS 공격에 취약할 수 있음  |
| sessionStorage | 탭을 닫으면 사라짐   | localStorage보다 짧게 유지      | 새 탭/브라우저 종료 시 사라짐 |
| cookie         | 서버로 자동 전송 가능 | HttpOnly 설정 시 JS 접근 차단 가능 | CSRF 고려 필요, 설정 복잡 |

실무에서는 팀마다 방식이 다르다.

간단한 프로젝트에서는 다음처럼 할 수 있다.

```tsx
localStorage.setItem("accessToken", accessToken);
```

보안이 더 중요한 서비스에서는 refresh token을 `HttpOnly Cookie`로 내려주는 방식을 많이 쓴다.

```text
access token: 메모리 또는 짧은 저장소
refresh token: HttpOnly Secure Cookie
```

`HttpOnly Cookie`는 JavaScript에서 직접 읽을 수 없다.
그래서 XSS로 토큰을 훔치기 어렵다.
대신 쿠키 기반 인증에서는 CSRF 방어 설정이 중요하다.

---

## 로그인 상태 유지

새로고침하면 React 상태는 초기화된다.
그래서 로그인 상태를 유지하려면 저장소나 서버 확인 API를 활용해야 한다.

흔한 방식은 다음이다.

```text
앱 시작
→ localStorage 또는 cookie에 token이 있는지 확인
→ /users/me API 호출
→ 성공하면 로그인 상태로 판단
→ 실패하면 로그아웃 상태로 처리
```

예시:

```tsx
// src/api/userApi.ts
import { apiClient } from "./client";

type MeResponse = {
  id: number;
  email: string;
  nickname: string;
};

export async function getMe(): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>("/users/me");
  return response.data;
}
```

앱 시작 시:

```tsx
import { useEffect, useState } from "react";
import { getMe } from "./api/userApi";

function App() {
  const [user, setUser] = useState<null | {
    id: number;
    email: string;
    nickname: string;
  }>(null);

  useEffect(() => {
    async function checkLogin() {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      }
    }

    checkLogin();
  }, []);

  return <div>{user ? `${user.nickname}님 환영합니다` : "로그인 필요"}</div>;
}
```

---

## 인증이 필요한 API 호출 시 Authorization header 붙이는 방식

기본 형식은 다음이다.

```text
Authorization: Bearer <accessToken>
```

Axios에서는 요청마다 직접 붙일 수 있다.

```tsx
const accessToken = localStorage.getItem("accessToken");

const response = await axios.get("/api/users/me", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

하지만 실무에서는 중복이 많아지므로 Axios instance와 interceptor를 쓴다.

```tsx
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

---

# 6. 협업에서 중요한 API 명세서

## API 명세서에 반드시 있어야 하는 내용

좋은 API 명세서에는 최소한 다음이 있어야 한다.

```text
API 이름
endpoint
HTTP method
인증 필요 여부
request path parameter
request query parameter
request body
response body
status code
에러 응답 예시
필드 타입
필수 여부
null 가능 여부
페이지네이션 방식
정렬/검색 조건
```

예를 들어 게시글 상세 조회 API 명세는 이렇게 작성할 수 있다.

```text
API: 게시글 상세 조회

Endpoint:
GET /api/posts/{postId}

Auth:
필요 없음

Path Parameter:
postId: number, 게시글 ID

Response 200:
{
  "id": 1,
  "title": "게시글 제목",
  "content": "게시글 내용",
  "author": {
    "id": 5,
    "nickname": "작성자"
  },
  "createdAt": "2026-06-03T12:00:00Z"
}

Response 404:
{
  "message": "존재하지 않는 게시글입니다."
}
```

---

## endpoint, method, request, response, status code 예시

회원가입 API 예시:

```text
API: 회원가입

Endpoint:
POST /api/auth/signup

Request Body:
{
  "email": "user@example.com",
  "password": "password1234",
  "nickname": "frontend_dev"
}

Response 201:
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "frontend_dev"
}

Response 400:
{
  "message": "이미 사용 중인 이메일입니다."
}
```

프론트엔드 구현:

```tsx
type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

type SignupResponse = {
  id: number;
  email: string;
  nickname: string;
};

export async function signup(
  data: SignupRequest
): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>("/auth/signup", data);
  return response.data;
}
```

---

## 백엔드에게 어떤 질문을 해야 하는가

프론트엔드 개발자는 API 명세를 보고 애매한 부분을 빨리 질문해야 한다.

좋은 질문 예시는 다음과 같다.

```text
이 API는 인증이 필요한가요?
토큰은 Authorization Bearer 방식인가요, 쿠키 방식인가요?
목록 API는 페이지네이션이 있나요?
페이지 번호는 0부터 시작인가요, 1부터 시작인가요?
검색어는 query parameter로 보내나요?
생성 성공 시 200인가요, 201인가요?
삭제 성공 시 response body가 있나요, 204인가요?
날짜는 UTC인가요, 한국 시간인가요?
이미지 URL은 절대 경로인가요, 상대 경로인가요?
필드가 null로 올 수 있나요?
에러 응답 형식은 모든 API가 동일한가요?
```

나쁜 질문은 너무 추상적이다.

```text
API 어떻게 써요?
이거 안 돼요.
로그인 이상해요.
```

좋은 질문은 재현 가능한 정보를 포함한다.

```text
POST /api/auth/login 요청 시
Request body:
{
  "email": "test@example.com",
  "password": "1234"
}

Response:
401
{
  "message": "Invalid credentials"
}

명세서에는 400으로 되어 있는데 실제로는 401이 내려옵니다.
로그인 실패 케이스는 400과 401 중 어떤 것으로 맞추면 될까요?
```

---

## 프론트엔드가 미리 mock data로 개발하는 방법

백엔드 API가 아직 완성되지 않아도 프론트엔드는 개발을 시작할 수 있다.
이를 mock data 개발이라고 한다.

예를 들어 게시글 목록 API가 아직 없더라도 프론트에서 임시 데이터를 만들 수 있다.

```tsx
// src/mocks/postMock.ts
export const mockPosts = [
  {
    id: 1,
    title: "첫 번째 게시글",
    content: "내용입니다.",
    createdAt: "2026-06-03T12:00:00Z",
  },
  {
    id: 2,
    title: "두 번째 게시글",
    content: "내용입니다.",
    createdAt: "2026-06-03T13:00:00Z",
  },
];
```

컴포넌트에서 임시로 사용한다.

```tsx
import { mockPosts } from "../mocks/postMock";

export default function PostListPage() {
  return (
    <ul>
      {mockPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

조금 더 실무적인 방식은 API 함수 형태를 미리 맞추는 것이다.

```tsx
// src/api/postApi.ts
import { mockPosts } from "../mocks/postMock";

export async function getPosts() {
  return mockPosts;
}
```

나중에 백엔드가 완성되면 내부 구현만 바꾼다.

```tsx
export async function getPosts() {
  const response = await apiClient.get("/posts");
  return response.data;
}
```

컴포넌트는 수정하지 않아도 된다.

더 실무적인 도구로는 `MSW(Mock Service Worker)`를 많이 쓴다.
MSW는 실제 API처럼 브라우저 요청을 가로채서 mock 응답을 내려준다. 프론트엔드 개발, 테스트, Storybook 환경에서 유용하다.

---

# 7. 개발 환경과 배포 환경 차이

## localhost에서 개발할 때와 EC2 배포 후의 차이

개발 중에는 보통 이렇게 실행한다.

```text
프론트엔드: http://localhost:5173
백엔드: http://localhost:8000
```

React/Vue 개발 서버와 백엔드 서버가 서로 다른 주소 또는 포트에서 실행된다.

배포 후에는 보통 이렇게 된다.

```text
프론트엔드: https://www.example.com
백엔드 API: https://api.example.com
```

또는 같은 도메인에서 경로로 나누기도 한다.

```text
프론트엔드: https://www.example.com
백엔드 API: https://www.example.com/api
```

개발 환경에서는 잘 되던 것이 배포 후 안 되는 대표 이유는 다음이다.

```text
API URL이 localhost로 남아 있음
CORS 설정이 운영 도메인을 허용하지 않음
HTTP/HTTPS가 섞여 있음
환경변수가 빌드 시점에 적용되지 않음
쿠키 도메인 설정이 다름
Nginx reverse proxy 설정이 잘못됨
```

---

## 프론트엔드 개발 서버와 백엔드 API 서버가 다른 포트일 때 생기는 문제

브라우저는 보안상 출처가 다른 요청을 제한한다.

다음 두 주소는 다른 출처로 본다.

```text
http://localhost:5173
http://localhost:8000
```

왜냐하면 포트가 다르기 때문이다.

출처는 다음 세 가지로 결정된다.

```text
프로토콜: http / https
도메인: localhost / example.com
포트: 5173 / 8000
```

하나라도 다르면 다른 origin이다.

그래서 프론트에서 백엔드로 요청했을 때 CORS 에러가 날 수 있다.

---

## CORS란 무엇인가

CORS는 Cross-Origin Resource Sharing의 약자다.
쉽게 말하면 **브라우저가 다른 출처의 서버에 요청할 때 서버가 허용했는지 확인하는 보안 정책**이다.

중요한 점은 CORS는 프론트엔드 코드만으로 해결하는 문제가 아니라는 것이다.

프론트엔드에서 이런 요청을 보낸다.

```tsx
axios.get("http://localhost:8000/api/posts");
```

브라우저는 백엔드 응답 헤더를 확인한다.

```text
Access-Control-Allow-Origin: http://localhost:5173
```

백엔드가 프론트엔드 주소를 허용해야 브라우저가 응답을 사용할 수 있다.

백엔드에 요청할 때 이렇게 말하면 된다.

```text
프론트 개발 서버 주소는 http://localhost:5173입니다.
백엔드 CORS 설정에 이 origin을 허용해 주세요.
운영 프론트 도메인은 https://www.example.com입니다.
운영 CORS에도 이 도메인을 추가해 주세요.
```

---

## `.env` 파일로 API base URL을 관리하는 이유

API 주소를 코드에 직접 쓰면 위험하다.

나쁜 예:

```tsx
axios.get("http://localhost:8000/api/posts");
```

이 코드가 배포되면 운영 사이트에서도 사용자의 브라우저가 `localhost:8000`으로 요청하려고 한다.
그런데 사용자의 컴퓨터에는 백엔드 서버가 없으므로 실패한다.

좋은 방식은 환경변수를 사용하는 것이다.

Vite 기준:

```env
// .env.development
VITE_API_BASE_URL=http://localhost:8000/api
```

```env
// .env.production
VITE_API_BASE_URL=https://api.example.com
```

Axios client:

```tsx
// src/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

Create React App 기준이면 변수명이 `REACT_APP_`으로 시작해야 한다.

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

```tsx
const baseURL = process.env.REACT_APP_API_BASE_URL;
```

Vite와 CRA가 다르므로 프로젝트 환경을 확인해야 한다.

| 환경      | 환경변수 접두사       | 사용 방식                                  |
| ------- | -------------- | -------------------------------------- |
| Vite    | `VITE_`        | `import.meta.env.VITE_API_BASE_URL`    |
| CRA     | `REACT_APP_`   | `process.env.REACT_APP_API_BASE_URL`   |
| Next.js | `NEXT_PUBLIC_` | `process.env.NEXT_PUBLIC_API_BASE_URL` |

---

## 개발용 API URL과 배포용 API URL 분리

Vite에서는 보통 이렇게 관리한다.

```text
.env.development
.env.production
```

`.env.development`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

`.env.production`:

```env
VITE_API_BASE_URL=https://api.example.com
```

빌드할 때 production 환경변수가 들어간다.

```bash
npm run build
```

주의할 점은 React/Vue의 환경변수는 대부분 **빌드 시점에 코드에 포함**된다는 것이다.
즉, `.env`를 수정했으면 개발 서버를 재시작하거나 다시 빌드해야 한다.

```bash
npm run dev
```

또는

```bash
npm run build
```

---

# 8. 배포와 인프라 기초

## React/Vue 빌드 결과물이 무엇인가

React/Vue 프로젝트는 개발 중에는 JSX, TSX, TypeScript, 모듈 import 등을 사용한다.

하지만 브라우저는 최종적으로 다음 파일을 받는다.

```text
HTML
CSS
JavaScript
이미지, 폰트 등 정적 assets
```

빌드 결과물은 보통 다음 폴더에 생성된다.

```text
Vite: dist/
Create React App: build/
Vue: dist/
```

예:

```text
dist/
  index.html
  assets/
    index-a1b2c3.js
    index-d4e5f6.css
```

이 파일들은 서버 로직이 없는 정적 파일이다.

---

## `npm run build`가 하는 일

`npm run build`는 대략 다음을 한다.

```text
TypeScript/JSX 변환
여러 JS 파일 번들링
CSS 최적화
사용하지 않는 코드 제거
파일 압축/난독화에 가까운 최적화
assets 파일명에 hash 추가
환경변수 주입
최종 정적 파일 생성
```

개발 서버에서 보던 코드 그대로 배포되는 게 아니다.
브라우저가 효율적으로 받을 수 있도록 최적화된 결과물이 배포된다.

---

## 정적 파일 배포란 무엇인가

정적 파일 배포는 서버에서 매번 HTML을 동적으로 만들지 않고, 이미 빌드된 파일을 그대로 제공하는 방식이다.

예를 들어 사용자가 접속한다.

```text
https://www.example.com
```

서버는 `index.html`을 내려준다.

브라우저는 `index.html` 안에 연결된 JS/CSS 파일을 다운로드한다.

```html
<script src="/assets/index-a1b2c3.js"></script>
<link rel="stylesheet" href="/assets/index-d4e5f6.css" />
```

그 후 React/Vue 앱이 브라우저에서 실행된다.

---

## EC2, Nginx, S3, CloudFront, Amplify 역할

프론트엔드 배포에서 자주 만나는 인프라는 다음과 같다.

| 인프라        | 역할                                                       |
| ---------- | -------------------------------------------------------- |
| EC2        | AWS 가상 서버. 직접 Nginx 설치해서 프론트 빌드 파일을 서빙할 수 있음.            |
| Nginx      | 웹 서버 또는 reverse proxy. 정적 파일 제공, `/api` 요청을 백엔드로 프록시 가능. |
| S3         | 정적 파일 저장소. React/Vue 빌드 결과물을 업로드해서 정적 웹사이트처럼 사용 가능.      |
| CloudFront | CDN. 사용자와 가까운 엣지 서버에서 정적 파일을 빠르게 제공. HTTPS, 캐싱에 유용.      |
| Amplify    | 프론트엔드 배포 자동화 서비스. GitHub 연동, 빌드, 배포, 도메인 설정을 쉽게 처리.      |

실무에서 많이 쓰는 구조는 다음과 같다.

```text
사용자
→ CloudFront
→ S3의 React/Vue 정적 파일
→ 브라우저에서 JS 실행
→ API 요청은 api.example.com의 백엔드 서버로 전송
```

또 다른 구조:

```text
사용자
→ EC2 Nginx
→ React dist 파일 서빙
→ /api 요청은 같은 Nginx가 백엔드 서버로 proxy_pass
```

---

## 백엔드 서버와 프론트엔드 서버를 분리 배포하는 방식

현대 웹 서비스에서는 프론트엔드와 백엔드를 분리 배포하는 경우가 많다.

```text
프론트엔드:
https://www.example.com

백엔드:
https://api.example.com
```

장점:

```text
프론트와 백엔드 배포를 독립적으로 할 수 있음
프론트는 S3/CloudFront 같은 정적 배포에 최적화 가능
백엔드는 API 서버로만 운영 가능
스케일링 전략을 분리할 수 있음
```

단점 또는 주의점:

```text
CORS 설정 필요
쿠키 인증 시 domain, SameSite, Secure 설정 필요
API base URL 관리 필요
프론트/백엔드 배포 버전 불일치 가능
```

---

## Django가 React 빌드 파일을 서빙하는 방식

분리 배포가 아니라 Django 서버가 React 빌드 파일까지 제공하는 방식도 있다.

구조는 대략 다음과 같다.

```text
React npm run build
→ build 또는 dist 폴더 생성
→ Django static/templates 설정에 빌드 결과물 연결
→ Django가 index.html과 assets를 서빙
→ /api/*는 Django API로 처리
→ 나머지 경로는 React Router가 처리
```

예를 들면 다음과 같은 구조다.

```text
backend/
  manage.py
  config/
  static/
  templates/
frontend/
  dist/
    index.html
    assets/
```

Django가 `/` 요청에는 React의 `index.html`을 내려주고, `/api/posts/` 같은 요청은 Django REST API가 처리한다.

장점:

```text
도메인을 하나로 관리하기 쉬움
CORS 문제가 줄어듦
작은 프로젝트에서 단순함
```

단점:

```text
프론트와 백엔드 배포가 강하게 묶임
프론트만 빠르게 재배포하기 어려울 수 있음
정적 파일 캐싱/CloudFront 최적화는 별도 설정 필요
```

---

# 9. 프론트엔드 프로젝트 구조

실무에서 React 프로젝트는 보통 관심사별로 폴더를 나눈다.

예시:

```text
src/
  api/
    client.ts
    authApi.ts
    postApi.ts
    userApi.ts

  components/
    Button.tsx
    Modal.tsx
    Header.tsx

  pages/
    LoginPage.tsx
    PostListPage.tsx
    PostDetailPage.tsx

  hooks/
    usePosts.ts
    useAuth.ts

  store/
    authStore.ts
    postStore.ts

  types/
    auth.ts
    post.ts
    user.ts

  utils/
    formatDate.ts
    token.ts
    validate.ts

  constants/
    routes.ts
    errorMessages.ts
```

---

## components 폴더

재사용 가능한 UI 컴포넌트를 둔다.

```text
Button
Input
Modal
Card
Header
Pagination
```

예:

```tsx
type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({ children, disabled, onClick }: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
```

---

## pages 폴더

라우팅 단위의 화면 컴포넌트를 둔다.

```text
/login
/posts
/posts/:postId
/mypage
```

예:

```tsx
export default function PostDetailPage() {
  return <div>게시글 상세 페이지</div>;
}
```

---

## hooks 폴더

반복되는 상태 로직이나 API 호출 로직을 커스텀 훅으로 분리한다.

예:

```tsx
// src/hooks/usePosts.ts
import { useEffect, useState } from "react";
import { getPosts, type Post } from "../api/postApi";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const data = await getPosts();
        setPosts(data);
      } catch {
        setErrorMessage("게시글을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  return {
    posts,
    isLoading,
    errorMessage,
  };
}
```

페이지에서는 이렇게 쓴다.

```tsx
import { usePosts } from "../hooks/usePosts";

export default function PostListPage() {
  const { posts, isLoading, errorMessage } = usePosts();

  if (isLoading) return <p>불러오는 중...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

## api 폴더

API 호출 함수들을 둔다.

```text
authApi.ts
userApi.ts
postApi.ts
orderApi.ts
```

좋은 예:

```tsx
// src/api/postApi.ts
export async function getPost(postId: number) {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data;
}
```

나쁜 예는 컴포넌트 안에 API URL과 요청 로직이 흩어지는 것이다.

```tsx
// 좋지 않은 예
function PostDetailPage() {
  useEffect(() => {
    axios.get("http://localhost:8000/api/posts/1").then((res) => {
      setPost(res.data);
    });
  }, []);

  return <div>{post.title}</div>;
}
```

이렇게 하면 문제가 생긴다.

```text
API URL 변경 시 수정할 곳이 많아짐
Authorization header 누락 가능
에러 처리 방식이 화면마다 달라짐
테스트하기 어려움
컴포넌트가 너무 복잡해짐
```

---

## store 폴더

전역 상태를 관리하는 코드를 둔다.

예:

```text
로그인 사용자 정보
access token
장바구니
테마
알림 상태
```

Zustand 예시:

```tsx
// src/store/authStore.ts
import { create } from "zustand";

type User = {
  id: number;
  email: string;
  nickname: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## types 폴더

TypeScript 타입을 모아둔다.

```tsx
// src/types/post.ts
export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: number;
    nickname: string;
  };
};
```

API 요청/응답 타입도 정의한다.

```tsx
export type CreatePostRequest = {
  title: string;
  content: string;
};

export type CreatePostResponse = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};
```

---

## utils 폴더

공통 유틸 함수를 둔다.

```tsx
// src/utils/formatDate.ts
export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR");
}
```

```tsx
// src/utils/token.ts
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function removeTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
```

---

## API 호출 코드를 컴포넌트에 직접 쓰지 않고 분리하는 이유

컴포넌트는 UI를 담당하고, API 파일은 서버 통신을 담당해야 한다.

좋은 구조:

```text
Page
→ Hook
→ API function
→ Axios client
→ Backend
```

예:

```tsx
// Page
const { posts, isLoading } = usePosts();

// Hook
const data = await getPosts();

// API
apiClient.get("/posts");

// Client
baseURL, headers, interceptor 관리
```

이렇게 분리하면 장점이 크다.

```text
컴포넌트가 읽기 쉬워짐
API URL 변경에 강해짐
공통 에러 처리 가능
토큰 처리 일원화 가능
테스트하기 쉬워짐
백엔드 명세 변경 시 수정 범위가 줄어듦
```

---

## TypeScript를 쓸 때 API 응답 타입을 정의하는 방법

백엔드 응답을 타입으로 정의하면 실수를 줄일 수 있다.

예를 들어 게시글 응답:

```json
{
  "id": 1,
  "title": "제목",
  "content": "내용",
  "createdAt": "2026-06-03T12:00:00Z"
}
```

타입:

```tsx
export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};
```

API 함수:

```tsx
export async function getPost(postId: number): Promise<Post> {
  const response = await apiClient.get<Post>(`/posts/${postId}`);
  return response.data;
}
```

목록 응답:

```json
{
  "items": [
    {
      "id": 1,
      "title": "제목"
    }
  ],
  "totalCount": 100
}
```

타입:

```tsx
export type PostSummary = {
  id: number;
  title: string;
};

export type PostListResponse = {
  items: PostSummary[];
  totalCount: number;
};
```

API 함수:

```tsx
export async function getPosts(): Promise<PostListResponse> {
  const response = await apiClient.get<PostListResponse>("/posts");
  return response.data;
}
```

단, TypeScript 타입은 컴파일 타임에만 체크한다.
실제 서버 응답이 타입과 달라도 런타임에서 자동으로 막아주지는 않는다.

엄격한 검증이 필요하면 `zod` 같은 런타임 검증 라이브러리를 사용할 수 있다.

---

# 10. 실무에서 자주 터지는 문제

## 1. CORS 에러

증상:

```text
Access to XMLHttpRequest at 'http://localhost:8000/api/posts'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

원인:

```text
백엔드가 프론트엔드 origin을 허용하지 않음
credentials 설정 불일치
허용 method/header 누락
```

대응:

```text
프론트 주소를 백엔드 CORS 허용 목록에 추가
Authorization header 허용 확인
쿠키 인증이면 credentials 설정 확인
운영 도메인도 CORS에 추가
```

Axios에서 쿠키 포함 요청이 필요하면:

```tsx
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

백엔드도 credentials 허용 설정을 해야 한다.

---

## 2. 401 인증 에러

증상:

```text
로그인했는데 마이페이지 API 실패
새로고침 후 인증 풀림
일정 시간 후 API 실패
```

원인:

```text
Authorization header 누락
access token 만료
토큰 저장 실패
Bearer prefix 누락
refresh token 만료
```

확인할 것:

```text
Network 탭에서 Authorization header가 붙었는가?
Bearer accessToken 형식인가?
access token이 localStorage/cookie에 있는가?
백엔드가 요구하는 인증 방식과 일치하는가?
```

---

## 3. API URL 오타

증상:

```text
404 Not Found
Network 탭에 잘못된 URL 표시
```

예:

```tsx
apiClient.get("/post"); // 실제는 /posts
```

대응:

```text
API 명세 확인
baseURL 확인
endpoint 앞뒤 slash 확인
Django trailing slash 확인
```

Django REST Framework는 보통 trailing slash가 있을 수 있다.

```text
/api/posts/
```

프론트에서 이렇게 요청하면 리다이렉트 또는 실패가 날 수 있다.

```text
/api/posts
```

팀 설정에 따라 다르므로 확인해야 한다.

---

## 4. 백엔드 응답 구조 변경

증상:

```text
posts.map is not a function
화면에 데이터가 안 나옴
undefined 출력
```

원인:

```text
배열이 객체로 바뀜
필드명이 바뀜
data wrapper가 추가됨
pagination 구조가 추가됨
```

대응:

```text
Network 탭에서 실제 응답 확인
API 타입 수정
백엔드와 명세 업데이트
변경 사항을 팀에 공유
```

---

## 5. null/undefined 에러

증상:

```text
Cannot read properties of undefined
Cannot read properties of null
```

원인:

```text
API 응답 도착 전 렌더링
nullable 필드 처리 누락
초기 state 값 부적절
```

나쁜 예:

```tsx
const [user, setUser] = useState<any>(null);

return <p>{user.nickname}</p>;
```

좋은 예:

```tsx
if (!user) {
  return <p>사용자 정보를 불러오는 중...</p>;
}

return <p>{user.nickname}</p>;
```

또는:

```tsx
return <p>{user?.nickname ?? "알 수 없음"}</p>;
```

---

## 6. 비동기 처리 실수

나쁜 예:

```tsx
const posts = getPosts();
console.log(posts);
```

`getPosts()`는 Promise를 반환한다.
실제 데이터가 아니다.

좋은 예:

```tsx
const posts = await getPosts();
console.log(posts);
```

React 이벤트 핸들러:

```tsx
const handleClick = async () => {
  const posts = await getPosts();
  setPosts(posts);
};
```

---

## 7. 환경변수 적용 안 됨

증상:

```text
API baseURL이 undefined
수정한 .env 값이 반영되지 않음
배포 후에도 예전 API URL 사용
```

원인:

```text
Vite인데 VITE_ 접두사를 안 붙임
CRA인데 REACT_APP_ 접두사를 안 붙임
.env 수정 후 개발 서버 재시작 안 함
빌드 후 환경변수 바꿈
배포 플랫폼 환경변수 설정 누락
```

확인:

```tsx
console.log(import.meta.env.VITE_API_BASE_URL);
```

단, 운영 환경에서 민감한 값을 프론트 환경변수에 넣으면 안 된다.
프론트엔드 환경변수는 빌드된 JS에 포함되므로 사용자가 볼 수 있다.

API base URL은 괜찮지만, DB 비밀번호나 secret key는 절대 넣으면 안 된다.

---

## 8. 배포 후 localhost URL이 남아 있는 문제

가장 흔한 배포 사고 중 하나다.

나쁜 코드:

```tsx
axios.get("http://localhost:8000/api/posts");
```

운영 배포 후 사용자의 브라우저는 자기 컴퓨터의 `localhost:8000`으로 요청한다.
당연히 실패한다.

대응:

```tsx
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

운영 환경변수:

```env
VITE_API_BASE_URL=https://api.example.com
```

배포 전에 반드시 빌드 결과에서 localhost가 남아 있는지 확인하는 습관이 좋다.

```bash
grep -R "localhost" dist
```

---

# Django/FastAPI/Flask 백엔드와 협업할 때 프론트엔드 입장에서 달라지는 점

## Django / Django REST Framework

프론트엔드가 특히 신경 쓸 것:

```text
trailing slash 여부
CSRF 설정
세션 인증인지 JWT 인증인지
pagination 응답 구조
serializer 필드명
파일 업로드 시 multipart/form-data
```

자주 보는 URL:

```text
/api/posts/
/api/posts/1/
```

자주 보는 페이지네이션 응답:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/posts/?page=2",
  "previous": null,
  "results": []
}
```

프론트엔드 처리:

```tsx
type DjangoPaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const response = await apiClient.get<DjangoPaginatedResponse<Post>>("/posts/");
setPosts(response.data.results);
```

Django 세션 인증을 쓰면 CSRF 토큰이 필요할 수 있다.
JWT를 쓰면 Authorization header 방식으로 처리하는 경우가 많다.

---

## FastAPI

프론트엔드가 특히 신경 쓸 것:

```text
Swagger 문서 확인
Pydantic schema 기반 request/response 타입 확인
422 validation error 처리
snake_case 필드명 여부
인증 scheme 확인
```

FastAPI는 validation error로 `422 Unprocessable Entity`를 자주 반환한다.

예:

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

프론트엔드에서는 이런 응답을 사용자 메시지로 바꿔야 한다.

```tsx
catch (error) {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    setErrorMessage("입력값 형식을 확인해 주세요.");
    return;
  }

  setErrorMessage("요청 처리 중 오류가 발생했습니다.");
}
```

FastAPI는 `/docs` 문서가 잘 되어 있으면 프론트엔드 개발 속도가 빠르다.

---

## Flask

프론트엔드가 특히 신경 쓸 것:

```text
프로젝트별 응답 포맷 차이
에러 응답 통일 여부
API 문서 존재 여부
JWT/세션 인증 구현 방식
CORS 설정 방식
```

Flask는 자유도가 높아서 팀마다 응답 구조가 많이 다를 수 있다.

예:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "게시글"
  },
  "message": null
}
```

또는:

```json
{
  "result": {
    "id": 1,
    "title": "게시글"
  }
}
```

프론트엔드는 초반에 반드시 다음을 맞춰야 한다.

```text
성공 응답 공통 포맷
에러 응답 공통 포맷
인증 실패 응답 포맷
validation error 포맷
pagination 포맷
```

---

# React + Axios 실무형 예시

아래는 실제 프로젝트에서 많이 쓰는 구조다.

```text
src/
  api/
    client.ts
    authApi.ts
    postApi.ts
  types/
    auth.ts
    post.ts
  pages/
    LoginPage.tsx
    PostListPage.tsx
```

## Axios client

```tsx
// src/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 실무에서는 여기서 refresh token 재발급 로직을 넣을 수 있음
      // 재발급 실패 시 로그아웃 처리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    return Promise.reject(error);
  }
);
```

---

## 타입 정의

```tsx
// src/types/post.ts
export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export type CreatePostRequest = {
  title: string;
  content: string;
};

export type PostListResponse = {
  items: Post[];
  totalCount: number;
};
```

---

## API 함수

```tsx
// src/api/postApi.ts
import { apiClient } from "./client";
import type { CreatePostRequest, Post, PostListResponse } from "../types/post";

export async function getPosts(params: {
  page: number;
  size: number;
  keyword?: string;
}): Promise<PostListResponse> {
  const response = await apiClient.get<PostListResponse>("/posts", {
    params,
  });

  return response.data;
}

export async function getPost(postId: number): Promise<Post> {
  const response = await apiClient.get<Post>(`/posts/${postId}`);
  return response.data;
}

export async function createPost(data: CreatePostRequest): Promise<Post> {
  const response = await apiClient.post<Post>("/posts", data);
  return response.data;
}

export async function deletePost(postId: number): Promise<void> {
  await apiClient.delete(`/posts/${postId}`);
}
```

---

## 페이지에서 사용

```tsx
// src/pages/PostListPage.tsx
import { useEffect, useState } from "react";
import { getPosts } from "../api/postApi";
import type { Post } from "../types/post";

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getPosts({
        page: 1,
        size: 20,
        keyword,
      });

      setPosts(data.items);
    } catch (error) {
      setErrorMessage("게시글 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어"
      />
      <button onClick={loadPosts}>검색</button>

      {isLoading && <p>불러오는 중...</p>}
      {errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

# 백엔드와 협업할 때 실무 감각

주니어 프론트엔드 개발자가 빨리 성장하려면 “API 주세요”에서 끝나면 안 된다.

화면을 받으면 먼저 이렇게 쪼개야 한다.

```text
이 화면에서 필요한 데이터는 무엇인가?
최초 진입 시 호출할 API는 무엇인가?
사용자 액션마다 호출할 API는 무엇인가?
인증이 필요한가?
로딩 상태가 필요한가?
빈 데이터일 때 화면은 어떻게 보여줄 것인가?
에러가 나면 어떤 메시지를 보여줄 것인가?
페이지네이션/검색/필터가 있는가?
데이터 생성/수정 후 목록을 다시 불러올 것인가, 로컬 상태만 바꿀 것인가?
```

예를 들어 게시글 목록 화면이면 다음처럼 정리할 수 있어야 한다.

```text
화면: 게시글 목록

필요 데이터:
- 게시글 id
- 제목
- 작성자 닉네임
- 작성일
- 댓글 수

필요 API:
GET /api/posts?page=1&size=20&keyword=

상태:
- loading
- error
- empty
- success

질문:
- 페이지 번호는 0부터인가요, 1부터인가요?
- 작성일은 UTC인가요?
- 댓글 수 필드는 commentCount인가요 comments_count인가요?
- 검색어가 없을 때 keyword를 빈 문자열로 보내나요, 아예 빼나요?
```

이런 식으로 정리하면 백엔드와 대화가 훨씬 명확해진다.

---

# 주니어 프론트엔드 개발자 실무 체크리스트

| 체크 항목           | 확인 질문                                  | 실무에서 해야 할 일                               |
| --------------- | -------------------------------------- | ----------------------------------------- |
| API 명세 확인       | endpoint와 method가 명확한가?                | Swagger, Notion, Postman 문서 확인            |
| 화면별 필요 데이터 정리   | 이 화면에 어떤 필드가 필요한가?                     | 디자인 시안 기준으로 데이터 목록 작성                     |
| 요청 예시 확인        | body, query, path parameter가 구분되어 있는가? | 실제 request 예시 작성                          |
| 응답 예시 확인        | response 구조와 필드 타입이 명확한가?              | JSON 예시를 보고 TypeScript 타입 정의              |
| 에러 케이스 확인       | 실패 시 어떤 status code와 message가 오는가?     | 400, 401, 403, 404, 500별 UI 처리            |
| 인증 필요 여부 확인     | 이 API는 로그인이 필요한가?                      | Authorization header 또는 cookie 설정 확인      |
| 토큰 처리 확인        | access token, refresh token 방식인가?      | 저장 위치, 만료 처리, 재발급 흐름 확인                   |
| CORS 설정 확인      | 프론트 도메인이 백엔드에서 허용되어 있는가?               | localhost와 운영 도메인 모두 전달                   |
| API base URL 확인 | 개발/운영 URL이 분리되어 있는가?                   | `.env.development`, `.env.production` 구성  |
| mock data 준비    | 백엔드 API가 없어도 화면 개발 가능한가?               | mock JSON, MSW, 임시 API 함수 사용              |
| loading 처리      | 요청 중 사용자에게 피드백이 있는가?                   | spinner, skeleton, 버튼 disabled 적용         |
| error 처리        | 실패했을 때 사용자가 이해할 수 있는가?                 | alert보다 화면 내 메시지 우선 고려                    |
| empty 상태 처리     | 데이터가 0개일 때 화면이 자연스러운가?                 | “게시글이 없습니다” 같은 빈 상태 UI 작성                 |
| null 처리         | nullable 필드가 있는가?                      | optional chaining, 기본값 처리                 |
| 응답 구조 변경 대응     | API 변경 시 영향 범위를 아는가?                   | API 함수와 타입을 한곳에서 관리                       |
| Network 탭 확인    | 실제 요청/응답을 볼 수 있는가?                     | URL, method, header, payload, response 확인 |
| 배포 URL 확인       | 빌드 결과에 localhost가 남아 있지 않은가?           | 배포 전 환경변수와 빌드 결과 확인                       |
| SPA 라우팅 확인      | 새로고침 시 404가 나지 않는가?                    | Nginx/S3/CloudFront fallback 설정 확인        |
| 파일 업로드 확인       | `multipart/form-data`가 필요한가?           | FormData 사용, Content-Type 처리 확인           |
| 테스트 방법 정리       | 백엔드에게 재현 가능한 방식으로 전달 가능한가?             | request/response 캡처, 계정 정보, 절차 정리         |

---

# 마지막으로 기억해야 할 핵심

백엔드와 협업하는 프론트엔드 개발자는 다음 네 가지를 계속 확인해야 한다.

```text
1. 내가 어떤 API를 언제 호출하는가
2. 어떤 데이터를 어떤 형태로 보내는가
3. 어떤 응답을 어떤 화면 상태로 바꾸는가
4. 실패했을 때 사용자가 무엇을 보게 되는가
```

화면을 잘 만드는 것도 중요하지만, 실무에서는 **API 명세를 읽고, 백엔드와 계약을 맞추고, 환경 차이를 이해하고, 에러 상황까지 처리하는 능력**이 훨씬 중요하다.

주니어가 여기까지 할 수 있으면 단순 화면 구현자가 아니라, 실제 팀 프로젝트에서 믿고 맡길 수 있는 프론트엔드 개발자로 보이기 시작한다.
