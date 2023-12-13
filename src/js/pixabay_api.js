import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '41234154-1228a4e877b16a4c27b1fb598';

export async function fetchPhoto(q, page, perPage) {
    const url = `${URL}?key=${API_KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;
}
