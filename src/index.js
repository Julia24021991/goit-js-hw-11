import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './markup';
//
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;
let currentSum = 0;

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

loadMore.addEventListener('click', onLoadMore);
form.addEventListener('submit', onValueSubmit);

function onValueSubmit(event) {
    event.preventDefault();
    page = 1;
    gallery.innerHTML = '';
    localStorage.clear();

    const enteredValue = event.currentTarget[0].value.trim();
    const currentPage = window.location.pathname;
    if (enteredValue === '') {
        loadMore.classList.add('visibility-hidden');
        return Notiflix.Notify.failure('All fields must be filled!');
    }
    localStorage.setItem('key', enteredValue);
    localStorage.setItem('page', currentPage);
    render();
    form.reset();
}

async function getGallery(page = 1) {

    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '41234154-1228a4e877b16a4c27b1fb598';
    const q = localStorage.getItem('key');
    const image_type = 'photo';
    const orientation = 'horizontal';
    const safesearch = 'true';
    const per_page = 40;

    const queryParams = new URLSearchParams({
        key: API_KEY,
        q,
        image_type,
        page,
        per_page,
        orientation,
        safesearch,
    });
    try {
        const res = await axios.get(`${BASE_URL}?${queryParams}`);
        return res.data;
    } catch (error) {
        throw new Error(error);
    }

}

async function render() {
    try {

        const data = await getGallery(page);

        if (data.hits.length === 0) {

            loadMore.classList.add('visibility-hidden');
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        check(data.hits.length, data.totalHits);
        lightbox.refresh();

    } catch (error) {
        console.log('error!', error);
    }
}


async function onLoadMore() {
    try {
        page += 1;
        await render();
    } catch (error) {
        console.log('error!', error);
    }
    lightbox.refresh();

}


function check(current, total) {
    currentSum += current;
    if (currentSum >= total) {
        loadMore.classList.add('visibility-hidden');
        return Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
        );
    }
    Notiflix.Notify.success(`Hooray! We found ${currentSum} of ${total} images`);
    loadMore.classList.remove('visibility-hidden');
}
