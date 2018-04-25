// pages/release/release.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		radioIndex: 0,
		radioCheckVal: 0,
		itemsMy: [
			{
				src: "/images/yue.png",
				itemsName: "余额支付",
				hasExtra: "66.00"
				// checked:false
			},
			{
				src: "/images/yue.png",
				itemsName: "微信支付",
			}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
		wx.setNavigationBarTitle({
			title: "发布红包"
		});
	},

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
	onShareAppMessage: function() {},
	radioChange: function(e) {
		console.log("radio发生change事件，携带value值为：", e.detail.value);
	},
	radioCheckedChange: function(e) {
		console.log(e);
		this.setData({
			radioCheckVal: e.detail.value
		});
	},
	radioChange(e) {
		console.log(e.currentTarget.dataset.radioItem);

		this.setData({
			radioIndex: e.currentTarget.dataset.radioItem
		});
	}
});
