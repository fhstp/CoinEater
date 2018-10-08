# CoinEater
![](/src/img/logo_base.png?raw=true)

CoinEater is a browser extension aiming to block coin miners such as Coinhive. The blocklist is based on results of modern IT security research.

*Made by the Institute of IT Security Research of the St. Pölten University of Applied Sciences (https://www.fhstp.ac.at/en/research/institute-of-it-security-research)*

The extension is available at: 

[![Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/coineater/mphghokdjcoojfjbmldmjodgmbjchnlp) [![FireFox Add-on](https://addons.cdn.mozilla.net/static/img/addons-buttons/AMO-button_1.png)](https://addons.mozilla.org/de/firefox/addon/coineater/)

## Research Project
During our research project [PriSAd](https://www.fhstp.ac.at/en/research/projects-1/prisad-privacy-and-security-in-online-advertising) we examined cryptojacking on various websites. Cryptojacking is the process of mining a cryptocurrency inside a web page visitor's web browser without their consent. While doing this with the consent of the user, for instance to replace advertisements, is a legitimate application, cryptojacking abuses the user's resources. 

We periodically scan the Alexa Top 1 million websites for cryptojacking and perform various analyses. Additionally, we use the results to create a blocklist, which blocks the WebSocket traffic often used by cryptojacking scripts. Therefore, this extension utilises our most recent research results in order to protect against cryptojacking.

## Base repository
This repository is based on the browser extension [No Coin](https://github.com/keraf/NoCoin) by Rafael Keramidas (keraf [at] protonmail [dot] com - [@iamkeraf](https://www.twitter.com/iamkeraf) - [ker.af](https://ker.af/).

## Icons
The Icons are derivatives of the following original work:
Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> and <a href="http://www.freepik.com" title="Freepik">Freepik</a>  from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> are licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
