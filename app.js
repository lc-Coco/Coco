//app.js
import fetch from "./utils/fetch.js";
App({
	onLaunch: function(options) {
		// 展示本地存储能力
		var logs = wx.getStorageSync("logs") || [];
		logs.unshift(Date.now());
		wx.setStorageSync("logs", logs);

		// 登录
		wx.login({
			success: res => {
				try {
					wx.setStorageSync("code", res.code);
				} catch (e) {}
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
			}
		});
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting["scope.userInfo"]) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							try {
								wx.setStorageSync("res", res);
							} catch (e) {}
							// 可以将 res 发送给后台解码出 unionId

							this.globalData.userInfo = res.userInfo;

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res);
							}
						}
					});
				}
			}
		});
		// 取值
		var myRes = wx.getStorageSync("res");
		var myCode = wx.getStorageSync("code");
		var lcc = {
			code: myCode,
			iv: myRes.iv,
			encryptedData: myRes.encryptedData,
			token_string: "",
			password: "123456",
			user_info: myRes.userInfo
		};
		// fetch("login",lcc,"POST").then(res => {
		//     console.log(res);
		// })
	},
	globalData: {
		userInfo: null
	}
});
