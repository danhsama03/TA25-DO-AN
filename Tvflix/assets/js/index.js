'use strict';

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming"
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending/movie/week"
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated"
  }
]

const genreList = {

  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }

    return newGenreList.join(", ");
  }

};

fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);
});

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.className = "banner";
  banner.setAttribute("aria-label", "Popular Movies");

  const bannerSlider = document.createElement("div");
  bannerSlider.className = "banner-slider";
  banner.appendChild(bannerSlider);

  const sliderControl = document.createElement("div");
  sliderControl.className = "slider-control";
  const controlInner = document.createElement("div");
  controlInner.className = "control-inner";
  sliderControl.appendChild(controlInner);
  banner.appendChild(sliderControl);

  let controlItemIndex = 0;

  movieList.forEach((movie, index) => {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.className = "slider-item";
    sliderItem.setAttribute("slider-item", "");
    sliderItem.innerHTML = `
      <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading="${index === 0 ? "eager" : "lazy"}">
      <div class="banner-content">
        <h2 class="heading">${title}</h2>
        <div class="meta-list">
          <div class="meta-item">${release_date?.split("-")[0] ?? "Not Released"}</div>
          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${genreList.asString(genre_ids)}</p>
        <p class="banner-text">${overview}</p>
        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
          <span class="span">Watch Now</span>
        </a>
      </div>
    `;
    bannerSlider.appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.className = "poster-box slider-item";
    controlItem.setAttribute("slider-control", controlItemIndex);
    controlItemIndex++;
    controlItem.innerHTML = `
      <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
    `;
    controlInner.appendChild(controlItem);
  });

  pageContent.appendChild(banner);

  addHeroSlide();

  homePageSections.forEach(({ title, path }) => {
    fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`, createMovieList, title);
  });
};


const addHeroSlide = function () {

  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    const controlIndex = Number(this.getAttribute("slider-control"));
    sliderItems[controlIndex].classList.add("active");
    this.classList.add("active");

    lastSliderItem = sliderItems[controlIndex];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);

}

const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.setAttribute("aria-label", title);

  const titleWrapper = document.createElement("div");
  titleWrapper.classList.add("title-wrapper");
  const titleLarge = document.createElement("h3");
  titleLarge.classList.add("title-large");
  titleLarge.textContent = title;
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