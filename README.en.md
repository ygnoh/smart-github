# Smart Github - Open Source
Smart Github is a **open source** chrome extension to upgrade your github's functionality.

If you want to experience this, [Here](https://github.com/ygnoh/github-template-extension) is a sample repository for you to experience. After installing this extension, try it!

*Read this in other languages: [한국어](README.md), [English](README.en.md)*

## Features
### Multi templates
  * This provides multi templates for issue/pull request.
  * This adds labels you recently used automatically when you create a new issue/pull request.

<img src="https://user-images.githubusercontent.com/13075245/38159156-9903fe90-34dd-11e8-865d-a9fee8315ff2.gif" width="800">

## How to use
### Multi templates
1. Create a directory `.github/ISSUE_TEMPLATE/` in the root directory of the repository where you want to apply this extension.
> In the case of Pull request, create a directory `.github/PULL_REQUEST_TEMPLATE/`.
2. Add template `.md` files in the directory.
> The name of a file `.md` will be a template name in the dropdown.
3. Finish!

## Token?
Smart Github은 여러분의 저장소 위에서 동작합니다. 이는 여러분 저장소에 대한 접근을 필요로 합니다. 공개 저장소는 자유롭게 [Github API](https://developer.github.com/v3/)로 접근이 가능하지만, **비공개 저장소 혹은 Enterprise 버전의 github에 대해서는 접근이 제한됩니다.**

그래서 **동작을 위해 최소한의 토큰이 필요합니다!** 토큰의 접근 범위에 대한 자세한 정보는 Github의 [이 글](https://developer.github.com/apps/building-oauth-apps/scopes-for-oauth-apps/)에서 확인하실 수 있습니다.

## Enterprise
If you use a Github Enterprise, you should register your host like this :)

<img src="https://user-images.githubusercontent.com/13075245/38159257-b65afeb0-34df-11e8-9c3d-8c4f50770514.gif" width="400">
