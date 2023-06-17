'use strict';

const api_key = 'b5658e8df07f4045180a6caab1e870bd';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

const fetchDataFromServer = async function (url, callback, optionalParam) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    callback(data, optionalParam);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error('Lỗi khi lấy dữ liệu từ máy chủ:', error);
  }
};


export { imageBaseURL, api_key, fetchDataFromServer };