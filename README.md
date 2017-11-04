# yilai
[![CircleCI](https://circleci.com/gh/pulento/yilai.svg?style=svg)](https://circleci.com/gh/pulento/yilai)

Yeelight Lights Front/Backend Server

Simple Web App to control Yeelight WiFi LED bulbs

![screenshot](https://github.com/pulento/yilai/raw/master/client/public/images/yilai_landing.png)

## Install

Clone repository
```
git clone https://github.com/pulento/yilai.git
cd yilai
```
Clone yeelight-wifi fork
```
git submodule init
git submodule update
```

Install modules, please note that this will install client modules also
```
npm install
```

Build yeelight-wifi fork
```
cd node_modules/yeelight-wifi/
npm run build
```

Run :)
```
cd ../..
npm run dev
```
