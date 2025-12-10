const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  try {
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });

    if (resp.ok) {
      const respData = await resp.json();
      showMovies(respData);
    } else {
      console.log("Error HTTP: " + resp.status);
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  }
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesContainer = document.querySelector(".film");
  moviesContainer.innerHTML = "";

  const movies = data.items || data.films;

  movies.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("film_card");

    movieEl.innerHTML = `
      <div class="film_poster-inner">
        <img
          src="${movie.posterUrlPreview}"
          alt="${movie.nameRu}"
          class="film_poster"
        />
        <div class="film_poster-info">
          <h5 class="film_poster-title">${movie.nameRu}</h5>
          <p class="film_poster-genre">${movie.genres
            .map((g) => g.genre)
            .join(", ")}</p>
          <div class="film_poster-average film_poster-average--${getClassByRate(
            movie.ratingKinopoisk || movie.rating
          )}">${(movie.ratingKinopoisk || movie.rating) ?? "-"}</div>
        </div>
      </div>
    `;

    moviesContainer.append(movieEl);
  });
}

const form = document.querySelector("form");
const search = document.getElementById("header_search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;

  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = "";
  }
});
