const root = document.querySelector('body');
const themeButton = document.querySelector('.btn-theme');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.modal__close');
const rewind = document.querySelector('.btn-prev');
const forward = document.querySelector('.btn-next');
const searchBar = document.querySelector('.input');
const currentTheme = localStorage.getItem('theme');

currentTheme === 'dark' ? darkMode() : lightMode();

let globalList = requireMoviesDB('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

printf(globalList, 0);
movieOfDay();

themeButton.addEventListener('click', changeTheme);
modal.addEventListener('click', closeModal);
closeButton.addEventListener('click', closeModal);
rewind.addEventListener('click', rewindAction);
forward.addEventListener('click', forwardAction);
searchBar.addEventListener('keydown', searchMovies);

async function requireMoviesDB(endpoint) {
    const require = await fetch(endpoint);
    const promise = await require.json();
    return promise.results;
}

async function requireMoviesDBv2(endpoint) {
    const require = await fetch(endpoint);
    const promise = await require.json();
    return promise;
}

async function printf(db, index) {
    const database = await db;
    const allPreviousMovies = document.querySelectorAll('.movie');
    for (const previousMovie of allPreviousMovies) {
        previousMovie.remove()
    }

    for (let current = index; current < index + 5; current++) {
        if (current >= database.length) return;
        const unit = database[current];
        const displayMovies = document.querySelector('.movies');
        const movieBody = document.createElement('div');
        const movieInfo = document.createElement('div');
        const movieTitle = document.createElement('span');
        const movieRating = document.createElement('span');
        const ratingStar = document.createElement('img');
        const movieId = document.createElement('div');
        movieBody.classList.add('movie');
        movieInfo.classList.add('movie__info');
        movieTitle.classList.add('movie__title');
        movieRating.classList.add('movie__rating');
        movieId.classList.add('hidden');
        movieBody.style.backgroundImage = unit.poster_path ? `url(${unit.poster_path})` : '';
        // .style.backgroundImage = `url('${catalogo[7].poster_path}')`;
        ratingStar.src = "./assets/estrela.svg";
        ratingStar.alt = "Estrela";

        if (unit.title.length > 9) {
            unit.title = unit.title.substr(0, 9).padEnd(12, '...')
        }
        movieId.textContent = unit.id;
        movieTitle.textContent = unit.title;
        movieRating.append(ratingStar, unit.vote_average);
        movieInfo.append(movieTitle, movieRating);
        movieBody.append(movieInfo);
        movieBody.append(movieId);
        displayMovies.append(movieBody);
        movieBody.addEventListener('click', modalBuffer);
        movieInfo.addEventListener('click', stopPropagation);
        movieTitle.addEventListener('click', stopPropagation);
        movieRating.addEventListener('click', stopPropagation);
    }
}

async function movieOfDay() {
    const localeList = await globalList;
    const baseLab = [];
    for (const moviesList of localeList) {
        baseLab.push(moviesList.id)
    }
    let baseId = Math.trunc(Math.random() * 10);
    let id = `${baseLab[baseId]}`;

    let filmOfTheDay = await requireMoviesDBv2(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);
    let filmOfTheDayMovie = await requireMoviesDB(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}/videos?language=pt-BR`);

    const highlightMovieScreen = document.querySelector('.highlight__video');
    const highlightMovieTitle = document.querySelector('.highlight__title');
    const highlightMovieRating = document.querySelector('.highlight__rating');
    const highlightMovieGenres = document.querySelector('.highlight__genres');
    const highlightMovieLaunch = document.querySelector('.highlight__launch');
    const highlightMovieDescription = document.querySelector('.highlight__description');
    const highlightMovieBuffer = document.querySelector('.highlight__video-link');

    highlightMovieScreen.style.backgroundImage = `url('${filmOfTheDay.backdrop_path}')`;
    highlightMovieTitle.textContent = filmOfTheDay.title;
    highlightMovieRating.textContent = filmOfTheDay.vote_average;

    let movieGenres = []
    for (const unit of filmOfTheDay.genres) {
        movieGenres.push(unit.name)
    }
    movieGenres = movieGenres.join(', ');
    highlightMovieGenres.textContent = movieGenres;

    let data = filmOfTheDay.release_date.split('-');
    data[1] = data[1].toString().padStart(2, '0');

    if (data[1] === '01') {
        data[1] = "janeiro"
    }

    if (data[1] === '02') {
        data[1] = "fevereiro"
    }

    if (data[1] === '03') {
        data[1] = "março"
    }

    if (data[1] === '04') {
        data[1] = "abril"
    }

    if (data[1] === '05') {
        data[1] = "maio"
    }

    if (data[1] === '06') {
        data[1] = "junho"
    }

    if (data[1] === '07') {
        data[1] = "julho"
    }

    if (data[1] === '08') {
        data[1] = "agosto"
    }

    if (data[1] === '09') {
        data[1] = "setembro"
    }

    if (data[1] === '10') {
        data[1] = "outubro"
    }

    if (data[1] === '11') {
        data[1] = "novembro"
    }

    if (data[1] === '12') {
        data[1] = "dezembro"
    }

    data = `${data[2]} de ${data[1]} de ${data[0]}`;
    highlightMovieLaunch.textContent = data;
    highlightMovieDescription.textContent = filmOfTheDay.overview;

    let keys = [];
    for (const searchEngine of filmOfTheDayMovie) {
        keys.push(searchEngine.key)
    }
    
    keys.length !== 0 ? highlightMovieBuffer.href = `https://www.youtube.com/watch?v=${keys[0]}` : highlightMovieScreen.style.backgroundImage = '';
}

async function searchMovies(event) {
    if (event.key !== 'Enter') return;

    if (!searchBar.value) {
        globalList = requireMoviesDB('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');
        printf(globalList, 0);
    } else {
        globalList = await requireMoviesDB(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${searchBar.value}`);
        if (!globalList.length) return;
        printf(globalList, 0);
    }
}

async function modalBuffer(event) {
    const database = await globalList;

    for (const unit of database) {
        if (event.target.childNodes[1].textContent.includes(unit.id)) {
            const movieSelected = await requireMoviesDBv2(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${unit.id}?language=pt-BR`);
            const modalTitle = document.querySelector('.modal__title');
            const modalImg = document.querySelector('.modal__img');
            const modalDescription = document.querySelector('.modal__description');
            const modalAverage = document.querySelector('.modal__average');
            const modalAllGenresContainer = document.querySelector('.modal__genres');

            modalTitle.textContent = movieSelected.title;
            modalImg.src = movieSelected.backdrop_path ? movieSelected.backdrop_path : '';
            modalDescription.textContent = movieSelected.overview;
            modalAverage.textContent = movieSelected.vote_average ? movieSelected.vote_average : '-';

            for (const genre of movieSelected.genres) {
                const movieGenre = document.createElement('span');
                movieGenre.classList.add('modal__genres__code');
                movieGenre.textContent = genre.name;
                modalAllGenresContainer.append(movieGenre);
            }
        }
    }
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    root.style.overflow = 'hidden';
}

function closeModal() {
    const modalAllGenres = document.querySelectorAll('.modal__genres__code');

    for (const genre of modalAllGenres) {
        genre.remove()
    }

    modal.classList.add('hidden');
    modal.style.display = 'none';
    root.style.overflowY = 'scroll';
}

function stopPropagation(event) {
    event.stopPropagation()
}

async function forwardAction() {
    const database = await globalList;
    const moviesListDB = document.querySelectorAll('.movie');
    let index = 0;
    for (let n = 0; n < database.length; n++) {
        if (moviesListDB[0].childNodes[1].textContent.includes(database[n].id)) {
            if (database.length % 5 !== 0) {
                for (let j = 0; j < database.length; j++) {
                    if (moviesListDB[moviesListDB.length - 1].childNodes[1].textContent.includes(database[j].id)) {
                        index = n === 0 && j === (database.length - 1) ? 0 : (n === 0 ? database.length - (database.length % 5) : n - 5);
                    }
                }
            } else {
                index = n === 0 ? n + 5 : (n === (database.length - 5) ? 0 : n + 5);
            }
        }
    }
    printf(globalList, index);
}

async function rewindAction() {
    const database = await globalList;
    const moviesListDB = document.querySelectorAll('.movie');
    let index = 0;
    for (let n = 0; n < database.length; n++) {
        if (moviesListDB[0].childNodes[1].textContent.includes(database[n].id)) {
            if (database.length % 5 !== 0) {
                for (let j = 0; j < database.length; j++) {
                    if (moviesListDB[moviesListDB.length - 1].childNodes[1].textContent.includes(database[j].id)) {
                        index = n === 0 && j === (database.length - 1) ? 0 : (n === 0 ? database.length - (database.length % 5) : n - 5);
                    }
                }
            } else {
                index = n === 0 ? database.length - 5 : n - 5;
            }
        }
    }
    printf(globalList, index)
}

function changeTheme() {
    themeButton.attributes[1].nodeValue === './assets/light-mode.svg' ? darkMode() : lightMode();
}

function lightMode() {
    themeButton.src = './assets/light-mode.svg';
    forward.src = './assets/seta-direita-preta.svg';
    rewind.src = './assets/seta-esquerda-preta.svg';
    root.style.setProperty('--backgroundColor', '#FFFFFF');
    root.style.setProperty('--inputColor', '#979797');
    root.style.setProperty('--fontColor', '#000000');
    root.style.setProperty('--highlightBgColor', '#ffffff');
    root.style.setProperty('--ratingColor', '#A785ED');
    root.style.setProperty('--subdescriptionColor', '#000000b3');
    root.style.setProperty('--highlightShadowColor', '#00000026');
    localStorage.setItem('theme', 'light');
}

function darkMode() {
    themeButton.src = './assets/dark-mode.svg';
    forward.src = './assets/seta-direita-branca.svg';
    rewind.src = './assets/seta-esquerda-branca.svg';
    root.style.setProperty('--backgroundColor', '#000000');
    root.style.setProperty('--inputColor', '#FFFFFF');
    root.style.setProperty('--fontColor', '#FFFFFF');
    root.style.setProperty('--highlightBgColor', '#454545');
    root.style.setProperty('--ratingColor', '#A987ED');
    root.style.setProperty('--subdescriptionColor', '#ffffffb3');
    root.style.setProperty('--highlightShadowColor', '#ffffff26');
    localStorage.setItem('theme', 'dark');
}

console.log(window.screen);