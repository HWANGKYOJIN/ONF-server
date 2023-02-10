<div align = 'center', fontsize=90 > <h1>💡 TeamProject - ON & OFF</h1> </div>



<div align = 'center'>
<img width="400" alt="스크린샷 2023-01-27 오후 4 39 46" src="https://user-images.githubusercontent.com/108543999/215396621-6c5e7b0c-485b-414c-8170-6d92564752a2.png">
</div>


## 🏷️ 주제선정
 평소에 자주 사용하던 웹사이트는 어떻게 구성되어있고 어떻게 작동하는지 궁금했습니다. 평소에 자주 사용하는 웹사이트를 기준으로 주제를 선정하기로 하였습니다. 그 중에서 우리가 매일매일 사용했던 시프티(출퇴근기록, 인사괸리어플)를 직접 구현해보았습니다.

## 📅개발기간
  - 2022년 11월 28일 ~ 2023년 1월 13일
  
## ⚙️사용기술
<div aling = 'center'>
<img src = "https://user-images.githubusercontent.com/108543999/215445104-3f68e908-c19d-4ad3-b078-579cd975a9d7.png">
</div>

## <img width="30" alt="스크린샷 2023-01-30 오후 7 02 51" src="https://user-images.githubusercontent.com/108543999/215448230-ec85f58d-970e-473c-a8a4-5cb8728f4aac.png"> ERD
<div align = 'center'>
<img src="https://user-images.githubusercontent.com/108543999/215436064-dbb53aef-59ae-4d69-b9b8-5af6a3828138.png">
</div>

## ✔️담당업무 
- 백엔드

## ✔️세부업무
- graphql context, JWT을 활용하여 로그인 기능 및 인증,인가 구현
- NestJs Role Guard 활용하여 인가 구현
- 근로정보(CRUD) 구현
- OpenAPI(공공데이터포털)를 활용하여 공휴일데이터 저장
- GCP 인스턴스를 활용하여 서버배포

---

## ❔ 문제 해결 과정


### ⁉ NestJs Role Guard를 활용하여 인가구현하기(로그인 프로세스 파악하기)
 Role Guard를 활용하여 인가를 구현하면서 기능구현에만 급급했던 나를 돌아보는 계기가 되었습니다. 전반적인 로그인 프로세스의 흐름에 대한 지식이 없이 Docks를 보고 그대로 코드를 작성하여 최종적으로 Role Guard를 적용하기까지에 오랜 시간이 소요되었습니다. 
 
 이번 프로젝트를 하면서 관리자와 일반직원과의 권한 분기가 필요하였습니다. Docs에서 설명하고 있는 인가 방법인 Role Guard를 사용하여 권한 분기를 구현하였습니다. 하지만 에러가 발생하였고 에러를 해결하기 위해 로그인의  처음단계 부터 차례차례 console을 통해 데이터를 확인하였습니다. 이러한 과정을 통해 원인을 찾았습니다. 원인은 프로젝트에서 인증 & 인가 기능에 대해 JWT를 활용하여 JWT의 PAYLOAD에 필요한 유저정보를 담아 cookie에 저장하여 context를 활용하여 사용하였는데 토큰의 Role에 대한 데이터를 넣어주지 않아서 발생한 에러였습니다. JWT의 PAYLOAD에 권한 정보를 넣어주었습니다. 그리고 토큰을 디코딩하여 열어보니 PAYLOAD에 원하는 데이터가 들어있었습니다.
 
 
### ☑ index설정을 통한 조회시간 줄이기

 인덱스 설정을 통해 데이터 조회 시간을 1.8s에서 30ms로 줄인 경험이 있습니다. 팀 프로젝트에서는 대용량의 외부 데이터를 다루어볼 기회가 없었지만, 프로시저를 활용한 더미 데이터를 통해 대용량 데이터를 테스트해 보았습니다. 조인되어있지 않은 데이터를 조회하는 것만으로도 index의 유무가 데이터 조회에 엄청난 차이를 만든다는 것을 확인하였고, DB 설계의 중요성을 다시 한번 상기할 수 있는 경험이었습니다.
 
 프로젝트에서 OpenAPI를 활용하여 공휴일 데이터를 DB에 저장하였습니다. 조회할 때 오름차순으로 조회하면 순서대로 볼 수 있지만, 저장단계에서부터 순차적으로 저장하면 조회할 때 정렬하지 않아도 되니 조회 속도가 더 빠를 것으로 생각했습니다. DB에서 PK값 설정에서 increment를 적용하여 1월~12월까지 순차적으로 데이터를 저장하였습니다. 테스트를 위해 프로시저를 활용해 50,000개의 더미 데이터를 생성하였습니다. 순서대로 저장되어있는 데이터는 index를 고려할 만큼 조회속도에 유의미한 차이를 보이지는 않았습니다. 하지만 오름차순으로 정렬해서 조회할 경우 대용량의 데이터를 처리함에 있어서는 index설정 여부에 따라 조회 속도가 확연히 차이가 났습니다. index 설정 전 50,000개 데이터 조회 속도는 1.8m에서 index 설정 후 조회 속도는 30ms로 약 60배의 차이가 났습니다. 
 

### 🤔 프론트 코드 활용하여 에러 해결하기(목마른사람이 우물 판다)

 능동적이고 적극적으로 문제해결을 하려고 노력합니다. 로그인을 구현하면서 로컬, 백엔드 서버를 배포하고 쿠키가 제대로 헤더에 담기는 것을 확인한 후 소스 코드를 올렸으나 프론트에서 배포된 서버에서 로그인을 하고 새로고침을 하면 자꾸 로그인이 풀린다고 하였습니다. 자꾸 로그인이 풀린다고 하여 '나는 다 테스트한 건데 클라이언트 문제 아니야?' 라는 생각을 잠깐 했었습니다.  프론트 팀원 한 명을 붙잡아 같이 테스트하기엔 민폐가 된다고 생각하였습니다. 그래서 클라이언트 코드를 받아 직접 테스트해 보았습니다. 클라이언트는 배포전이였고, 서버배포만 완료되어있는 상태에서 Access-Control-Allow-Origin 설정에서 Origin이 뜻하는 것을 제대로 이해하지 못해서 발생한 오류였습니다. 클라이언트 코드를 다운받아 직접 로그인을 하면서 ssh와 네트워크 탭을  통해 서버 로그와 요청을 확인하면서 스스로 오류를 잡을 수 있었습니다.
 
---
