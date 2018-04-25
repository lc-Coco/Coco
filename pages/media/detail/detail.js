// 导入请求数据模块
import fetch from "../../../utils/fetch.js";
// 解析html标签
import WxParse from "../../../wxParse/wxParse.js";

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 文章详情
		detils: {},
		// 富文本编辑器
		content: "",
		// 评论总数
		commentTotal: 0,
		// 评论列表
		commentsList: [],
		// 文章详情id
		id: 0,
		// 页码
		page: 0,
		//还有更多
		hasMore: true,
		// 评论id
		commentId: 0,
		// 文章是否已点赞
		isThumbs: 0,
		// 文章赞
		articleThumbs: 0,
		// 文章是否已收藏
		isCollect: 0,
		// 文章收藏数
		articleCollect: 0,
		// 文章是否已关注
		isFollow: 0,
		// 文章是否已奖钱
		isAward: 0,
		// 评论的内容
		commentContent: "",
		// 阅读文章获得奖励
		award: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.data.id = options.ArticleId;
		this.getDetails(this.data.id);
		this.getCommentList(this.data.id, this.data.page);
		// 文章点赞
		this.setData({
			articleThumbs: wx.getStorageSync("articleThumbs")
		});
		// 文章收藏
		this.setData({
			articleCollect: wx.getStorageSync("articleCollect")
		});
		if (this.data.isAward) {
			setTimeout(() => {
				this.setData({
					award: true
				});
				this.readArticle(this.data.id);
				setTimeout(() => {
					this.setData({
						award: false
					});
				}, 2500);
			}, 10000);
		}
	},
	// 获取文章详情
	getDetails(id) {
		fetch("post/show", { id: id, uid: 1748 }).then(res => {
			var content = res.data.data.content;
			console.log("文章详情");
			console.log(res);
			console.log("文章详情");

			this.setData({
				detils: res.data.data,
				content: content,
				isThumbs: res.data.data.is_thumbs,
				isCollect: res.data.data.is_collect,
				isFollow: res.data.data.is_follow,
				isAward: res.data.data.is_award
			});
			try {
				wx.setStorageSync("articleThumbs", res.data.data.thumbs_num);
			} catch (e) {}
			try {
				wx.setStorageSync("articleCollect", res.data.data.collect_num);
			} catch (e) {}
			WxParse.wxParse("content", "html", content, this, 5);
			console.log("赞：", this.data.isThumbs);
		});
	},
	// 获取评论列表
	getCommentList(id, page) {
		if (!this.data.hasMore) return;
		this.data.page++;
		fetch("comment", { id: id, uid: 1748, page: ++page }).then(res => {
			// 总页数
			let totalPage = res.data.data.last_page;
			console.log("评论列表");
			console.log(res.data.data);
			console.log("评论列表");
			this.setData({
				commentsList: this.data.commentsList.concat(res.data.data.data),
				commentTotal: res.data.data.total,
				hasMore: this.data.page < totalPage ? true : false
			});

			// console.log("当前页" + this.data.page);
			// console.log("总页数" + totalPage);
			// console.log("hasMore：" + this.data.hasMore);
		});
	},
	// 评论点赞
	getCommentThumbs(id) {
		const url = "comment/thumbs";
		let header = {
			Authorization:
				"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIzYzFjYTljOWVhOGU0MzUwZGRmYWYwMWE1OTlkYTM2NzkwM2QzMWU5N2NiOGEyMjM3YjJjNDAyYWU0NTViMzU5NDJiMTI5NmIxM2EwMGIxIn0.eyJhdWQiOiIxIiwianRpIjoiYjNjMWNhOWM5ZWE4ZTQzNTBkZGZhZjAxYTU5OWRhMzY3OTAzZDMxZTk3Y2I4YTIyMzdiMmM0MDJhZTQ1NWIzNTk0MmIxMjk2YjEzYTAwYjEiLCJpYXQiOjE1MjQxOTY4NjYsIm5iZiI6MTUyNDE5Njg2NiwiZXhwIjoxNTU1NzMyODY2LCJzdWIiOiIxNzQ4Iiwic2NvcGVzIjpbXX0.Qy9Xbsk6zeqQpCe76j4aaimNks_Grq7tq0RArmHvMgJ_Z-JSgZj39Y5aXLlguw-oRk7tDsYa3M75FtLeiBLRDEXTtbE3ywAPOlVq3sNb-9LLYORk3kCi665ZNxguFiNd3a_cdJpr7ewO24m6gv1MYsRgLH-t3mSDV5wdcAwECSuGwkMSovWlkLghTaQp9Gnux0qyHrrud8ivoIFKMwHKpunEwYMqkWlfCXWmDej51wcj9LodhSpf924K5rkynTCEspyn1OJwIwuJOintM-uV0eA-zULCygx3yoZ7Y9HnbOmEcvPbmM4q0hCY6yUA8FMlNftRQvTfIdsgsX-OdkxHsXTm8x6ZxinNZpsFRnx7uzMZ9mTV86GLLNHR2CEbPmJMeGE-JB7VbhyNr0fw3ixx5NtAZNOJbA-hvH8MHM0ugoWyDBxuY9QGVTQhm91AP6ACIqinbCIWuQLqT7-a3cgYsV2FjduIGP6djRcFaH7dnTRKx8XS3qMnzec9PkiZO_Jd2hqvEfZc6nArb45VUuhKOqeB_2bel3sUlZMsO9Q2m48SDYy1JvtrBwIlh6ID5K8bZ3xsRVs8Xn2GVHSzJsUWfu-qQ8MYfX86cgRUe5RfBb1HHrR-SC-WQ3KwjlOXAPHa27ELqueIncKC4V0Am1jFOHAUsNLrW4eVALAtHHLP9RM",
			"content-type": "application/json" // 默认值
		};
		fetch(url, { id: id }, "POST", header).then(res => {
			console.log("评论点赞");
			// console.log(res);
			// console.log("评论点赞");
		});
	},
	// 文章点赞
	getArticleThumbs(id) {
		const url = "thumbs";
		let header = {
			Authorization:
				"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIzYzFjYTljOWVhOGU0MzUwZGRmYWYwMWE1OTlkYTM2NzkwM2QzMWU5N2NiOGEyMjM3YjJjNDAyYWU0NTViMzU5NDJiMTI5NmIxM2EwMGIxIn0.eyJhdWQiOiIxIiwianRpIjoiYjNjMWNhOWM5ZWE4ZTQzNTBkZGZhZjAxYTU5OWRhMzY3OTAzZDMxZTk3Y2I4YTIyMzdiMmM0MDJhZTQ1NWIzNTk0MmIxMjk2YjEzYTAwYjEiLCJpYXQiOjE1MjQxOTY4NjYsIm5iZiI6MTUyNDE5Njg2NiwiZXhwIjoxNTU1NzMyODY2LCJzdWIiOiIxNzQ4Iiwic2NvcGVzIjpbXX0.Qy9Xbsk6zeqQpCe76j4aaimNks_Grq7tq0RArmHvMgJ_Z-JSgZj39Y5aXLlguw-oRk7tDsYa3M75FtLeiBLRDEXTtbE3ywAPOlVq3sNb-9LLYORk3kCi665ZNxguFiNd3a_cdJpr7ewO24m6gv1MYsRgLH-t3mSDV5wdcAwECSuGwkMSovWlkLghTaQp9Gnux0qyHrrud8ivoIFKMwHKpunEwYMqkWlfCXWmDej51wcj9LodhSpf924K5rkynTCEspyn1OJwIwuJOintM-uV0eA-zULCygx3yoZ7Y9HnbOmEcvPbmM4q0hCY6yUA8FMlNftRQvTfIdsgsX-OdkxHsXTm8x6ZxinNZpsFRnx7uzMZ9mTV86GLLNHR2CEbPmJMeGE-JB7VbhyNr0fw3ixx5NtAZNOJbA-hvH8MHM0ugoWyDBxuY9QGVTQhm91AP6ACIqinbCIWuQLqT7-a3cgYsV2FjduIGP6djRcFaH7dnTRKx8XS3qMnzec9PkiZO_Jd2hqvEfZc6nArb45VUuhKOqeB_2bel3sUlZMsO9Q2m48SDYy1JvtrBwIlh6ID5K8bZ3xsRVs8Xn2GVHSzJsUWfu-qQ8MYfX86cgRUe5RfBb1HHrR-SC-WQ3KwjlOXAPHa27ELqueIncKC4V0Am1jFOHAUsNLrW4eVALAtHHLP9RM",
			"content-type": "application/json" // 默认值
		};

		fetch(url, { id: id }, "POST", header).then(res => {
			console.log("文章点赞");
			console.log(res);
			console.log("文章点赞");
		});
	},
	// 发表评论
	publishComment(id, content, callback) {
		const url = "comment";
		let header = {
			Authorization:
				"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIzYzFjYTljOWVhOGU0MzUwZGRmYWYwMWE1OTlkYTM2NzkwM2QzMWU5N2NiOGEyMjM3YjJjNDAyYWU0NTViMzU5NDJiMTI5NmIxM2EwMGIxIn0.eyJhdWQiOiIxIiwianRpIjoiYjNjMWNhOWM5ZWE4ZTQzNTBkZGZhZjAxYTU5OWRhMzY3OTAzZDMxZTk3Y2I4YTIyMzdiMmM0MDJhZTQ1NWIzNTk0MmIxMjk2YjEzYTAwYjEiLCJpYXQiOjE1MjQxOTY4NjYsIm5iZiI6MTUyNDE5Njg2NiwiZXhwIjoxNTU1NzMyODY2LCJzdWIiOiIxNzQ4Iiwic2NvcGVzIjpbXX0.Qy9Xbsk6zeqQpCe76j4aaimNks_Grq7tq0RArmHvMgJ_Z-JSgZj39Y5aXLlguw-oRk7tDsYa3M75FtLeiBLRDEXTtbE3ywAPOlVq3sNb-9LLYORk3kCi665ZNxguFiNd3a_cdJpr7ewO24m6gv1MYsRgLH-t3mSDV5wdcAwECSuGwkMSovWlkLghTaQp9Gnux0qyHrrud8ivoIFKMwHKpunEwYMqkWlfCXWmDej51wcj9LodhSpf924K5rkynTCEspyn1OJwIwuJOintM-uV0eA-zULCygx3yoZ7Y9HnbOmEcvPbmM4q0hCY6yUA8FMlNftRQvTfIdsgsX-OdkxHsXTm8x6ZxinNZpsFRnx7uzMZ9mTV86GLLNHR2CEbPmJMeGE-JB7VbhyNr0fw3ixx5NtAZNOJbA-hvH8MHM0ugoWyDBxuY9QGVTQhm91AP6ACIqinbCIWuQLqT7-a3cgYsV2FjduIGP6djRcFaH7dnTRKx8XS3qMnzec9PkiZO_Jd2hqvEfZc6nArb45VUuhKOqeB_2bel3sUlZMsO9Q2m48SDYy1JvtrBwIlh6ID5K8bZ3xsRVs8Xn2GVHSzJsUWfu-qQ8MYfX86cgRUe5RfBb1HHrR-SC-WQ3KwjlOXAPHa27ELqueIncKC4V0Am1jFOHAUsNLrW4eVALAtHHLP9RM",
			"content-type": "application/json" // 默认值
		};
		fetch(url, { id: id, content: content }, "POST", header).then(res => {
			console.log("评论成功");
			// console.log(res);
			// console.log("评论成功");
			if (callback) {
				callback(res);
			}
		});
	},
	// 阅读文章获得奖励
	readArticle(id) {
		const url = "award";
		let header = {
			Authorization:
				"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIzYzFjYTljOWVhOGU0MzUwZGRmYWYwMWE1OTlkYTM2NzkwM2QzMWU5N2NiOGEyMjM3YjJjNDAyYWU0NTViMzU5NDJiMTI5NmIxM2EwMGIxIn0.eyJhdWQiOiIxIiwianRpIjoiYjNjMWNhOWM5ZWE4ZTQzNTBkZGZhZjAxYTU5OWRhMzY3OTAzZDMxZTk3Y2I4YTIyMzdiMmM0MDJhZTQ1NWIzNTk0MmIxMjk2YjEzYTAwYjEiLCJpYXQiOjE1MjQxOTY4NjYsIm5iZiI6MTUyNDE5Njg2NiwiZXhwIjoxNTU1NzMyODY2LCJzdWIiOiIxNzQ4Iiwic2NvcGVzIjpbXX0.Qy9Xbsk6zeqQpCe76j4aaimNks_Grq7tq0RArmHvMgJ_Z-JSgZj39Y5aXLlguw-oRk7tDsYa3M75FtLeiBLRDEXTtbE3ywAPOlVq3sNb-9LLYORk3kCi665ZNxguFiNd3a_cdJpr7ewO24m6gv1MYsRgLH-t3mSDV5wdcAwECSuGwkMSovWlkLghTaQp9Gnux0qyHrrud8ivoIFKMwHKpunEwYMqkWlfCXWmDej51wcj9LodhSpf924K5rkynTCEspyn1OJwIwuJOintM-uV0eA-zULCygx3yoZ7Y9HnbOmEcvPbmM4q0hCY6yUA8FMlNftRQvTfIdsgsX-OdkxHsXTm8x6ZxinNZpsFRnx7uzMZ9mTV86GLLNHR2CEbPmJMeGE-JB7VbhyNr0fw3ixx5NtAZNOJbA-hvH8MHM0ugoWyDBxuY9QGVTQhm91AP6ACIqinbCIWuQLqT7-a3cgYsV2FjduIGP6djRcFaH7dnTRKx8XS3qMnzec9PkiZO_Jd2hqvEfZc6nArb45VUuhKOqeB_2bel3sUlZMsO9Q2m48SDYy1JvtrBwIlh6ID5K8bZ3xsRVs8Xn2GVHSzJsUWfu-qQ8MYfX86cgRUe5RfBb1HHrR-SC-WQ3KwjlOXAPHa27ELqueIncKC4V0Am1jFOHAUsNLrW4eVALAtHHLP9RM",
			"content-type": "application/json" // 默认值
		};
		fetch(url, { id: id }, "POST", header).then(res => {
			// console.log("获得奖励");
			// console.log(res);
			// console.log("获得奖励");
		});
	},
	// 弹框
	showOk(title, time) {
		wx.showToast({ title: title, icon: "success", duration: time });
	},
	// 关注作者
	focusAuthor(id) {
		const url = "follow";
		let header = {
			Authorization:
				"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIzYzFjYTljOWVhOGU0MzUwZGRmYWYwMWE1OTlkYTM2NzkwM2QzMWU5N2NiOGEyMjM3YjJjNDAyYWU0NTViMzU5NDJiMTI5NmIxM2EwMGIxIn0.eyJhdWQiOiIxIiwianRpIjoiYjNjMWNhOWM5ZWE4ZTQzNTBkZGZhZjAxYTU5OWRhMzY3OTAzZDMxZTk3Y2I4YTIyMzdiMmM0MDJhZTQ1NWIzNTk0MmIxMjk2YjEzYTAwYjEiLCJpYXQiOjE1MjQxOTY4NjYsIm5iZiI6MTUyNDE5Njg2NiwiZXhwIjoxNTU1NzMyODY2LCJzdWIiOiIxNzQ4Iiwic2NvcGVzIjpbXX0.Qy9Xbsk6zeqQpCe76j4aaimNks_Grq7tq0RArmHvMgJ_Z-JSgZj39Y5aXLlguw-oRk7tDsYa3M75FtLeiBLRDEXTtbE3ywAPOlVq3sNb-9LLYORk3kCi665ZNxguFiNd3a_cdJpr7ewO24m6gv1MYsRgLH-t3mSDV5wdcAwECSuGwkMSovWlkLghTaQp9Gnux0qyHrrud8ivoIFKMwHKpunEwYMqkWlfCXWmDej51wcj9LodhSpf924K5rkynTCEspyn1OJwIwuJOintM-uV0eA-zULCygx3yoZ7Y9HnbOmEcvPbmM4q0hCY6yUA8FMlNftRQvTfIdsgsX-OdkxHsXTm8x6ZxinNZpsFRnx7uzMZ9mTV86GLLNHR2CEbPmJMeGE-JB7VbhyNr0fw3ixx5NtAZNOJbA-hvH8MHM0ugoWyDBxuY9QGVTQhm91AP6ACIqinbCIWuQLqT7-a3cgYsV2FjduIGP6djRcFaH7dnTRKx8XS3qMnzec9PkiZO_Jd2hqvEfZc6nArb45VUuhKOqeB_2bel3sUlZMsO9Q2m48SDYy1JvtrBwIlh6ID5K8bZ3xsRVs8Xn2GVHSzJsUWfu-qQ8MYfX86cgRUe5RfBb1HHrR-SC-WQ3KwjlOXAPHa27ELqueIncKC4V0Am1jFOHAUsNLrW4eVALAtHHLP9RM",
			"content-type": "application/json" // 默认值
		};
		fetch(url, { id: id }, "POST", header).then(res => {
			console.log("关注成功");
			// console.log(res);
			// console.log("关注成功");
			this.setData({
				isFollow: 1
			});
		});
	},
	// 收藏文章
	getCollectArticle(id) {
		const url = "collect";
		let header = {
			Authorization:
				"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIzYzFjYTljOWVhOGU0MzUwZGRmYWYwMWE1OTlkYTM2NzkwM2QzMWU5N2NiOGEyMjM3YjJjNDAyYWU0NTViMzU5NDJiMTI5NmIxM2EwMGIxIn0.eyJhdWQiOiIxIiwianRpIjoiYjNjMWNhOWM5ZWE4ZTQzNTBkZGZhZjAxYTU5OWRhMzY3OTAzZDMxZTk3Y2I4YTIyMzdiMmM0MDJhZTQ1NWIzNTk0MmIxMjk2YjEzYTAwYjEiLCJpYXQiOjE1MjQxOTY4NjYsIm5iZiI6MTUyNDE5Njg2NiwiZXhwIjoxNTU1NzMyODY2LCJzdWIiOiIxNzQ4Iiwic2NvcGVzIjpbXX0.Qy9Xbsk6zeqQpCe76j4aaimNks_Grq7tq0RArmHvMgJ_Z-JSgZj39Y5aXLlguw-oRk7tDsYa3M75FtLeiBLRDEXTtbE3ywAPOlVq3sNb-9LLYORk3kCi665ZNxguFiNd3a_cdJpr7ewO24m6gv1MYsRgLH-t3mSDV5wdcAwECSuGwkMSovWlkLghTaQp9Gnux0qyHrrud8ivoIFKMwHKpunEwYMqkWlfCXWmDej51wcj9LodhSpf924K5rkynTCEspyn1OJwIwuJOintM-uV0eA-zULCygx3yoZ7Y9HnbOmEcvPbmM4q0hCY6yUA8FMlNftRQvTfIdsgsX-OdkxHsXTm8x6ZxinNZpsFRnx7uzMZ9mTV86GLLNHR2CEbPmJMeGE-JB7VbhyNr0fw3ixx5NtAZNOJbA-hvH8MHM0ugoWyDBxuY9QGVTQhm91AP6ACIqinbCIWuQLqT7-a3cgYsV2FjduIGP6djRcFaH7dnTRKx8XS3qMnzec9PkiZO_Jd2hqvEfZc6nArb45VUuhKOqeB_2bel3sUlZMsO9Q2m48SDYy1JvtrBwIlh6ID5K8bZ3xsRVs8Xn2GVHSzJsUWfu-qQ8MYfX86cgRUe5RfBb1HHrR-SC-WQ3KwjlOXAPHa27ELqueIncKC4V0Am1jFOHAUsNLrW4eVALAtHHLP9RM",
			"content-type": "application/json" // 默认值
		};
		fetch(url, { id: id }, "POST", header).then(res => {
			console.log("收藏成功");
			console.log(res);
			console.log("收藏成功");
			console.log("是否收藏" + this.data.isCollect);
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
	onReachBottom: function() {
		this.getCommentList(this.data.id, this.data.page);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	// 评论点赞
	commentThumbs(e) {
		console.log();
		// 点赞数+1
		if (this.data.commentsList[e.currentTarget.dataset.index].is_like) {
			this.showOk("您已经点过赞了", 1000);
			return;
		}
		this.data.commentsList[e.currentTarget.dataset.index].thumbs_num++;
		this.data.commentsList[e.currentTarget.dataset.index].is_like = 1;
		this.setData({
			// 点赞的id
			commentId: e.currentTarget.dataset.id,
			// 更新评论列表（更新赞数）
			commentsList: this.data.commentsList
		});
		// 告诉后台有人点赞
		this.getCommentThumbs(this.data.commentId);
	},
	// 文章点赞
	ArticleThumbs(e) {
		if (this.data.isThumbs) {
			this.showOk("您已经点过赞了", 1000);
			return;
		}
		this.data.articleThumbs++;
		this.setData({
			// 更新评论列表（更新赞数）
			articleThumbs: this.data.articleThumbs,
			isThumbs: 1
		});
		console.log("是否点赞" + this.data.articleThumbs);
		// 告诉后台有人点赞
		this.getArticleThumbs(this.data.id);
	},
	// 文章收藏
	ArticleCollect(e) {
		if (this.data.isCollect) {
			this.showOk("您已经收藏过了", 1000);
			return;
		}
		this.data.articleCollect++;
		this.setData({
			// 更新评论列表（更新收藏数）
			articleCollect: this.data.articleCollect,
			isCollect: 1
		});

		// 告诉后台有人收藏
		this.getCollectArticle(this.data.id);
	},
	// 发表评论
	EventHandle(e) {
		console.log(e.detail.value);
		this.setData({
			commentContent: e.detail.value
		});
	},
	// 提交评论
	submitComment(e) {
		this.publishComment(this.data.id, this.data.commentContent, res => {
			if (res.data.status_code == 200) {
				this.setData({ page: 0, hasMore: true, commentsList: [] });
				this.getCommentList(this.data.id, this.data.page);
			}
		});

		this.setData({
			commentContent: "",
			page: 0,
			hasMore: true,
			commentsList: []
		});
		this.showOk("评论成功", 1000);
	},
	// 关注作者
	attention(e) {
		if (this.data.isFollow) {
			this.showOk("您已经关注过了", 1000);
			return;
		}
		this.focusAuthor(this.data.id);
	},
	// 转发
	onShareAppMessage(res) {
		console.log("转发了");
		let sendinfo = { uid: 1 };
		let str = JSON.stringify(sendinfo);
		return {
			title: "梁成" + "向你分享了小程序",
			path: "/page/user?sendinfo=" + sendinfo,

			success: function(res) {
				// 转发成功
				console.log("转发成功");
				console.log(res);
			},
			fail: function(res) {
				// 转发失败
				console.log("转发失败");
			}
		};
	}
});
