'use strict';

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

const getGenres = function (genreList) {
  return genreList.map(genre => genre.name).join(", ");
};

const getCasts = function (castList) {
  const newCastList = castList.slice(0, 10).map(cast => cast.name);
  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  return crewList.reduce((directorList, { job, name }) => {
    if (job === "Director") {
      directorList.push(name);
    }
    return directorList;
  }, []).join(", ");
};


const filterVideos = function (videoList) {
  return videoList.filter(({ type, site }) => (type === "Trailer" || type === "Teaser") && site === "YouTube");
}

fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`, function (movie) {

  const {
    backdrop_path,
    poster_path,
    title,
    release_date,
    runtime,
    vote_average,
    releases: { countries: [{ certification } = { certification: "N/A" }] },
    genres,
    overview,
    casts: { cast, crew },
    videos: { results: videos }
  } = movie;

  document.title = `${title} - Tvflix`;

  const movieDetail = document.createElement("div");
  movieDetail.classList.add("movie-detail");

  movieDetail.innerHTML = `
    <div class="backdrop-image" style="background-image: url('${imageBaseURL}${"w1280" || "original"}${backdrop_path || poster_path}')"></div>
    
    <figure class="poster-box movie-poster">
      <img src="${imageBaseURL}w342${poster_path}" alt="${title} poster" class="img-cover">
    </figure>
    
    <div class="detail-box">
    
      <div class="detail-content">
        <h1 class="heading">${title}</h1>
    
        <div class="meta-list">
    
          <div class="meta-item">
            <img src="./assets/images/star.png" width="20" height="20" alt="rating">
    
            <span class="span">${vote_average.toFixed(1)}</span>
          </div>
    
          <div class="separator"></div>
    
          <div class="meta-item">${runtime}m</div>
    
          <div class="separator"></div>
    
          <div class="meta-item">${release_date?.split("-")[0] ?? "Not Released"}</div>
    
          <div class="meta-item card-badge">${certification}</div>
    
        </div>
    
        <p class="genre">${getGenres(genres)}</p>
    
        <p class="overview">${overview}</p>
    
        <ul class="detail-list">
    
          <div class="list-item">
            <p class="list-name">Starring</p>
    
            <p>${getCasts(cast)}</p>
          </div>
    
          <div class="list-item">
            <p class="list-name">Directed By</p>
    
            <p>${getDirectors(crew)}</p>
          </div>
    
        </ul>
    
      </div>
    
      <div class="title-wrapper">
        <h3 class="title-large">Trailers and Clips</h3>
      </div>
    
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    
    </div>
  `;

  for (const { key, name } of filterVideos(videos)) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");

    videoCard.innerHTML = `
      <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
        frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
    `;

    movieDetail.querySelector(".slider-inner").appendChild(videoCard);
  }

  pageContent.appendChild(movieDetail);

  fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`, addSuggestedMovies);

});

const addSuggestedMovies = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.setAttribute("aria-label", "You May Also Like");

  const titleWrapper = document.createElement("div");
  titleWrapper.classList.add("title-wrapper");
  const titleLarge = document.createElement("h3");
  titleLarge.classList.add("title-large");
  titleLarge.textContent = "You May Also Like";
  titleWrapper.appendChild(titleLarge);
  movieListElem.appendChild(titleWrapper);

  const sliderList = document.createElement("div");
  sliderList.classList.add("slider-list");
  const sliderInner = document.createElement("div");
  sliderInner.classList.add("slider-inner");
  sliderList.appendChild(sliderInner);
  movieListElem.appendChild(sliderList);

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);
    sliderInner.appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};

search();