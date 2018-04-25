// 导入请求数据模块
import fetch from "../../../utils/fetch.js";
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 分类列表
		categoryList: [],
		// 文章列表
		RecommendList: [],
		// 分类id
		sortId: 0,
		// 页码
		page: 0,
		//还有更多
		hasMore: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		// 获取分类列表
		this.getCategoryList();
		// 获取分类列表数据
		this.loadMore(this.data.sortId, this.data.page);
	},
	// 获取分类列表
	getCategoryList() {
		fetch("category").then(res => {
			this.setData({
				categoryList: res.data.data
			});
		});
	},
	// 加载更多文章列表
	loadMore(id, page) {
		if (!this.data.hasMore) return;
		this.data.page++;
		fetch("post", { id: id, page: page }).then(res => {
			// 总页数
			console.log("文章列表", res);
			const totalPage = res.data.data.last_page - 1;
			//停止下拉刷新
			wx.stopPullDownRefresh();
			this.setData({
				RecommendList: this.data.RecommendList.concat(res.data.data.data),
				hasMore: this.data.page < totalPage ? true : false
			});
			console.log("当前页" + this.data.page);
			console.log("总页数" + totalPage);
			console.log("hasMore：" + this.data.hasMore);
		});
	},
	// 切换文章列表
	tabCategory() {
		fetch("post", { id: this.data.sortId, page: 1 }).then(res => {
			this.setData({
				page: 1,
				hasMore: true,
				RecommendList: res.data.data.data
			});
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
	onPullDownRefresh: function() {
		this.setData({
			page: 1,
			hasMore: true,
			RecommendList: []
		});
		this.loadMore(this.data.sortId, this.data.page);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		this.loadMore(this.data.sortId, this.data.page);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	// 获取分类id
	tabChange(e) {
		let id = e.currentTarget.dataset.id;
		this.setData({
			sortId: e.currentTarget.dataset.id
		});

		this.tabCategory(id);
		console.log("当前id" + this.data.sortId);
	},
	// 获取文章id
	navigateToDetail(e) {
		wx.navigateTo({
			url: `/pages/media/detail/detail?ArticleId=${e.currentTarget.dataset.id}`
		});
	}
});
