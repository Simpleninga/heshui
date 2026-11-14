// 告诉网页「我在电脑上」，界面底部好显示 Windows / Mac
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('heshuiDesktop', { platform: process.platform });
