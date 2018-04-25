//BASE_URL
const BASE_URL = "https://www.lyue.tech/api/v1/";

export default (fetch = (
	url,
	data,
	method = "GET",
	header = {
		"content-type": "application/json"
	}
) => {
	return new Promise((resolve, reject) => {
		wx.request({
			url: `${BASE_URL}${url}`, //仅为示例，并非真实的接口地址
			data,
			method,
			header,
			success: resolve,
			fail: reject
		});
	});
});
