'use strict';

const api_key = '3fd67b0a75a2861ff71511c8065512a7';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

// const fetchDataFromServer = function (url, callback, optionalParam) {
//   fetch(url)
//     .then(response => response.json())
//     .then(data => callback(data, optionalParam));
// }

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