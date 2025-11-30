import axios from 'axios';

export const fetchBookByIsbn = async (isbn: string) => {
  const response = await axios.get('https://openapi.naver.com/v1/search/book.json', {
    params: { query: isbn, d_isbn: isbn },
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
    },
  });
  return response.data;
};
