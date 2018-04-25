// pages/eject/eject.js
// 引用百度地图微信小程序JSAPI模块 换成你的文件路径
var bmap = require("../../../utils/bmap-wx.min.js");
// import bmap from "../../utils/bmap-wx.min.js";
var wxMarkerData = []; //定位成功回调对象

Page({
	/**
	 * 百度地图
	 *
	 * 页面的初始数据
	 */
	data: {
		ak: "NoaHK3jcSWElHyF9YupK5lOCxj2IqL7U", //填写申请到的ak
		markers: [], //地图标记 这里暂没用到
		longitude: "", //经度
		latitude: "", //纬度
		address: "", //地址
		business: {}, //商圈
		desc: "" //描述
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		console.log("定位");
		var that = this;
		//新建百度地图对象
		var BMap = new bmap.BMapWX({
			ak: that.data.ak,
		});
		var success = function(data) {
			wxMarkerData = data.wxMarkerData;
			var site = wxMarkerData[0].address;
			var province = site.indexOf("省");
			if (province) {
				var city = site.slice(site.indexOf("省") + 1, site.indexOf("市") + 1);
			} else {
				var city = site.slice(0, site.indexOf("市") + 1);
            }
            console.log(city);
			that.setData({
				markers: wxMarkerData,
				latitude: wxMarkerData[0].latitude,
				longitude: wxMarkerData[0].longitude,
				address: wxMarkerData[0].address,
				business: wxMarkerData[0].business,
				desc: wxMarkerData[0].desc,
				city: city
			});
		};
		var fail = function(data) {
			console.log(data);
		};
		BMap.regeocoding({
			fail: fail,
			success: success
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {}
});
