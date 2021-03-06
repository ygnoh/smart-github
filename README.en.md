<div align="center">
 <a href="https://github.com/ygnoh/smart-github">
  <img src="src/icons/logo128.png">
 </a>
</div>

# Smart Github - Open Source
Smart Github is an **open source** chrome extension to upgrade your github's functionality.

If you want to experience this, [Here](https://github.com/ygnoh/github-template-extension) is a sample repository for you to experience. After [installing this extension](https://chrome.google.com/webstore/detail/nhginomnegcmeelhmmaahlnlgjpdfgnc), try it!

*Read this in other languages: [한국어](README.md), [English](README.en.md)*

## Features
### Multi templates
  * This provides multi templates for issues ~/pull request~.
  * This adds labels you recently used automatically when you create a new issue ~/pull request~.

<img src="https://user-images.githubusercontent.com/13075245/38159156-9903fe90-34dd-11e8-865d-a9fee8315ff2.gif" width="800">

## How to use
### Multi templates
1. Create a directory `.github/ISSUE_TEMPLATE/` in the root directory of the repository where you want to apply this extension.
2. Add template `.md` files in the directory.
> The name of a file `.md` will be a template name in the dropdown.
3. Finish!

## Token?
Smart Github works on your repository. This means it needs an access to your repository. A public repository can be accessed using [Github API](https://developer.github.com/v3/), but **a private repository or Github Enterprise is restricted.**

So we need **a minimal-scoped token to make this extension work.** If you go to the page for generating a token, the minimal scope will be selected automatically.
<img src="https://user-images.githubusercontent.com/13075245/38512503-4a3286ca-3c66-11e8-824e-f41b73db9be2.gif" width="800">

If you want to know about token access range, see [this from github](https://developer.github.com/apps/building-oauth-apps/scopes-for-oauth-apps/).

## Enterprise
If you use a Github Enterprise, you should register your host like this :)

<img src="https://user-images.githubusercontent.com/13075245/38263740-d40272f8-37ab-11e8-935b-63f708fe2500.gif" width="400">

Example: If your enterprise url is `https://vcs.google.com/...`, please enter `vcs.google.com`.

## License
Smart Github is [AGPL-3.0 licensed](LICENSE).
