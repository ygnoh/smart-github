<div align="center">
 <a href="https://github.com/ygnoh/smart-github">
  <img src="src/icons/logo128.png">
 </a>
</div>

# Smart Github - Open Source
Smart Github은 Github의 기능을 더 확장시켜주는 **오픈 소스** 크롬 익스텐션입니다.

체험을 해보시고 싶은 분은 [여기](https://github.com/ygnoh/github-template-extension)에 저장소를 마련해두었으니, 익스텐션 설치 후 자유롭게 체험 해보세요!

*Read this in other languages: [한국어](README.md), [English](README.en.md)*

## Features
### 멀티 템플릿
  * 이슈 ~/풀리퀘스트~ 에 대해서 멀티 템플릿 기능을 제공합니다.
  * 사용자가 최근에 사용한 label들을 기억하고 재 작성 시 자동으로 삽입하여 줍니다.

<img src="https://user-images.githubusercontent.com/13075245/38159156-9903fe90-34dd-11e8-865d-a9fee8315ff2.gif" width="800">

## How to use
### 멀티 템플릿
1. 사용하고자 하는 저장소의 루트 경로에 `.github/ISSUE_TEMPLATE/` 디렉토리를 만들어주세요.
2. 해당 디렉토리 안에 템플릿으로 사용될 `.md` 파일을 넣어주세요
> `.md` 파일의 이름이 드랍다운에서 나타나는 각 템플릿의 이름이 됩니다.
3. 끝났습니다! 이제 사용해보세요!

## Token?
Smart Github은 여러분의 저장소 위에서 동작합니다. 이는 여러분 저장소에 대한 접근을 필요로 합니다. 공개 저장소는 자유롭게 [Github API](https://developer.github.com/v3/)로 접근이 가능하지만, **비공개 저장소 혹은 Enterprise 버전의 github에 대해서는 접근이 제한됩니다.**

그래서 **동작을 위해 최소한의 토큰이 필요합니다!** 토큰의 접근 범위에 대한 자세한 정보는 Github의 [이 글](https://developer.github.com/apps/building-oauth-apps/scopes-for-oauth-apps/)에서 확인하실 수 있습니다.

## Enterprise
github.com이 아닌, enterprise(기업용) 버전을 사용할 경우 아래처럼 호스트를 등록 해주세요 :)

<img src="https://user-images.githubusercontent.com/13075245/38159257-b65afeb0-34df-11e8-9c3d-8c4f50770514.gif" width="400">
