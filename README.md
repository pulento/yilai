# yilai
Yeelight Lights Front/Backend Server

Simple Web App to control Yeelight WiFi LED bulbs

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

Instal modules, please note that this will install client modules also
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
