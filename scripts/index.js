const ID_CONTAINER_WITH_RESULTS_SEARCH = "results-search-id";
const KEY_ARRAY_WITH_RESULTS_SEARCH_FILMS = "resultsSearch";
const MODIFIER_OPEN_MODAL_WINDOW = "popup_open";
const CLASS_CONTAINER_POPUP = "js-popup";

const DURATION_FILM_IN_MINUTES = "минут";

const btnSearchFilmNode = document.querySelector('.js-btn-search-films');
const inputSearchFilmsNode = document.querySelector('.js-input-search-film');
const btnBackSearchNode = document.querySelector(".js-btn-back-search");
const resultsSearchNode = document.querySelector(".js-results-search");

const popupNode = document.querySelector(".js-popup");

const posterMovieNode = document.querySelector(".js-popup__poster");
const nameMovieNode = document.querySelector(".js-name-movie");
const yearNode = document.querySelector(".js-year");
const ratingNode = document.querySelector(".js-rating");
const durationMovieNode = document.querySelector(".js-duration");
const genreMovieNode = document.querySelector(".js-genre");
const nameStatesNode = document.querySelector(".js-name-state");
const filmDescriptionNode = document.querySelector(".js-film-description");

const resultsSearchLocalStorageString = localStorage.getItem(KEY_ARRAY_WITH_RESULTS_SEARCH_FILMS);
const resultsSearchLocalStorage = JSON.parse(resultsSearchLocalStorageString);

let listFilms = null;

// На случай, если локальное хранилище окажется пустым, в нём автоматически создастся массив с ключём
window.onload = function () {
    if (resultsSearchLocalStorageString === null) {
        localStorage.setItem(KEY_ARRAY_WITH_RESULTS_SEARCH_FILMS, JSON.stringify([]));
    };
};

if (Array.isArray(resultsSearchLocalStorage)) {
    listFilms = resultsSearchLocalStorage;
};

btnSearchFilmNode.addEventListener('click', () => {
    if (inputSearchFilmsNode.value === "") {
        return;
    };
    searchFilms();
});

btnBackSearchNode.addEventListener('click', function () {
    popupNode.classList.remove(MODIFIER_OPEN_MODAL_WINDOW);
});

// Закрытие модального окна при клике по пустой области
window.onclick = function (e) {
    const itemHTML = e.target;
    if (!itemHTML.classList.contains(CLASS_CONTAINER_POPUP)) return;
    else popupNode.classList.remove(MODIFIER_OPEN_MODAL_WINDOW);
};

const searchFilms = () => {
    fetch(`https://api.kinopoisk.dev/v1.3/movie?name=${getNameFilm()}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'X-API-KEY': 'SEGZ246-6BA4NM7-KKB7HFV-9BG9K9N',
        },
    })
        .then(response => response.json())
        .then(resultsRequest => {
            listFilms = resultsRequest.docs;
            console.log(listFilms);
            createCardFilm(listFilms);
            localStorage.setItem(KEY_ARRAY_WITH_RESULTS_SEARCH_FILMS, JSON.stringify(listFilms));
        });
};

const getNameFilm = () => {
    let nameFilmInput = inputSearchFilmsNode.value;
    return nameFilmInput
};

const getUrlPoster = (urls) => {
    for (let key in urls) {
        return urls[key];
    };
};

const getListGenresFilm = (film) => {
    let genresFilmArray = [];
    let genresFilm = film.genres;
    for (let i = 0; i < genresFilm.length; i++) {
        genresFilmArray.push(genresFilm[i].name);
    };
    let genresFilmString = genresFilmArray.join(', ');
    return genresFilmString;
};

const getIndexSelectedHtmlItem = (selectedItem, classSelectedItem) => {
    let arraySelectedHtmlItems = [].slice.call(document.querySelectorAll(`.${classSelectedItem}`));
    let indexSelectedHtmlItem = arraySelectedHtmlItems.indexOf(selectedItem);
    return indexSelectedHtmlItem;
};

const getNamesStates = (indexTargetItem) => {
    console.log(listFilms[indexTargetItem]);
    let namesStates = listFilms[indexTargetItem].countries.reduce((accumulator, state) =>
        `${accumulator}, ${state.name}`, 0).slice(2);
    return namesStates;
};

// Получаем индекс элемента, на который кликнули и передаём в функцию показа модального окна
document.getElementById(ID_CONTAINER_WITH_RESULTS_SEARCH).onclick = function (e) {
    const selectedItem = e.target;
    const classSelectedItem = e.target.classList[0];
    if (selectedItem.classList.contains(`${classSelectedItem}`)) {
        // show data movie in window
        showDataMovieInModalWindow(getIndexSelectedHtmlItem(selectedItem, classSelectedItem));
    };
    showModalWindow();
};

const showModalWindow = () => {
    if (popupNode.classList.contains(CLASS_CONTAINER_POPUP)) {
        popupNode.classList.add(MODIFIER_OPEN_MODAL_WINDOW);
    };
};

const showDataMovieInModalWindow = (indexTargetItem) => {
    posterMovieNode.src = getUrlPoster(listFilms[indexTargetItem].poster);
    nameMovieNode.textContent = listFilms[indexTargetItem].name;
    yearNode.textContent = listFilms[indexTargetItem].year;
    ratingNode.textContent = listFilms[indexTargetItem].rating.imdb;
    durationMovieNode.textContent = `${listFilms[indexTargetItem].movieLength} ${DURATION_FILM_IN_MINUTES}`;
    genreMovieNode.textContent = getListGenresFilm(listFilms[indexTargetItem]);
    nameStatesNode.textContent = getNamesStates(indexTargetItem);
    filmDescriptionNode.textContent = listFilms[indexTargetItem].description;
};

const createCardFilm = (listFilms) => {
    resultsSearchNode.innerHTML = "";
    console.log(listFilms);
    for (let i = 0; i < listFilms.length; i++) {
        const cardFilm = document.createElement("div");
        cardFilm.id = "id-results-request__card";
        cardFilm.className = "js-results-request__card results-request__card";

        const imagePosterWrapper = document.createElement("div");
        imagePosterWrapper.className = "image-poster-wrapper";

        const imagePoster = document.createElement("img");
        imagePoster.className = "js-image-poster image-poster";
        imagePoster.src = getUrlPoster(listFilms[i].poster);
        imagePoster.alt = "Постер фильма";

        cardFilm.appendChild(imagePosterWrapper);
        imagePosterWrapper.appendChild(imagePoster);

        const mainInformationFilm = document.createElement("div");
        mainInformationFilm.className = "main-information-film";

        const nameFilm = document.createElement("p");
        nameFilm.className = "js-name-film name-film";
        nameFilm.textContent = listFilms[i].name;

        const genreFilm = document.createElement("p");
        genreFilm.className = "js-genre-film genre-film";
        genreFilm.textContent = getListGenresFilm(listFilms[i]);

        const durationFilm = document.createElement("p");
        durationFilm.className = "js-duration-film duration-film";
        durationFilm.textContent = `${listFilms[i].movieLength} ${DURATION_FILM_IN_MINUTES}`;

        const dateReleaseFilm = document.createElement("p");
        dateReleaseFilm.className = "js-date-release-film date-release-film";
        dateReleaseFilm.textContent = listFilms[i].year;

        mainInformationFilm.appendChild(nameFilm);
        mainInformationFilm.appendChild(genreFilm);
        mainInformationFilm.appendChild(durationFilm);
        mainInformationFilm.appendChild(dateReleaseFilm);
        cardFilm.appendChild(mainInformationFilm);

        resultsSearchNode.appendChild(cardFilm);
    };
};

createCardFilm(listFilms);