const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_URL_POPULAR);

//Запрос к АПИ за фильмами
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
      showMovies(respData); //данные переходят в отрисвоку дома
    } else {
      console.log("Error HTTP: " + resp.status);
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  }
}

//Отрисовка карточек фильмов
function showMovies(data) {
  const moviesContainer = document.querySelector(".film");
  moviesContainer.innerHTML = "";

  const movies = data.items || data.films;

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("film_card");

    movieElement.innerHTML = `
      <div class="film_poster-inner">
        <img
          src="${movie.posterUrl}"
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
          )}">${
      (movie.ratingKinopoisk && movie.ratingKinopoisk !== "null") ||
      (movie.rating && movie.rating !== "null")
        ? movie.ratingKinopoisk || movie.rating
        : "-"
    }</div>


        </div>
      </div>
    `;
    const id = movie.filmId || movie.kinopoiskId;
    movieElement.addEventListener("click", () => openModal(id));

    moviesContainer.append(movieElement);
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
  } else {
    getMovies(API_URL_POPULAR);
  }
});

//Рейтинг по цвету
export function getClassByRate(vote) {
  if (vote >= 7) return "green";
  else if (vote > 5) return "orange";
  else if (!vote) return "grey";
  else return "red";
}

//Модальное окно
const modalElement = document.querySelector(".modal");
async function openModal(id) {
  if (!id) return;
  const response = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const responseData = await response.json();

  modalElement.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");

  const modalPoster = responseData.posterUrl;

  modalElement.innerHTML = `
      <div class="modal__card">
            
             <img
                class="modal__movie-backdrop"
                src="${modalPoster}" 
                alt="Постер фильма"
              />

        <div class="modal__content">
            <div>
              <h2 class="modal__movie-title">
                <a href="${
                  responseData.webUrl
                }" target="_blank" rel="noopener noreferrer">
                ${responseData.nameRu}
                </a>
              </h2>

              <h2 class="modal__movie-release-year"> (${
                responseData.year ? `${responseData.year}` : ""
              })</h2>
            </div>

            <ul class="modal__movie-info">
              <div class="loader"></div>
              ${
                responseData.countries
                  ? `<li class="modal__movie-country">
                  Страна: ${
                    responseData.countries
                      .map((c) => `<span>${c.country}</span>`)
                      .join(", ") || "—"
                  }.
                  </li>`
                  : ""
              }

              
              <li class="modal__movie-genre">Жанр:
               ${
                 responseData.genres
                   ?.map((g) => `<span>${g.genre}</span>`)
                   .join(", ") || ""
               }.
              </span>
              </li>

              ${
                responseData.filmLength
                  ? `<li class="modal__movie-runtime">Время: 
                ${Math.floor(responseData.filmLength / 60)} ч. ${
                      responseData.filmLength % 60
                    } мин.
              </li>`
                  : ""
              }

              ${
                responseData.description
                  ? `
                <li>
                  <p>Сюжет: ${responseData.description}</p>
                </li>
                `
                  : ""
              }

            </ul>
            <button class="modal__button-close">✕</button>
          </div>
        </div>
    
  `;
  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

//Функции закрытия модалки через классЛист
function closeModal() {
  modalElement.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
  //закрытие на фон
  if (e.target === modalElement) {
    closeModal();
  }
});
window.addEventListener("keydown", (e) => {
  //По клавише Esc
  if (e.keyCode == 27) {
    closeModal();
  }
});

//Пагинация

let currentPage = 1;

async function loadMovies(page) {
  getMovies(`${API_URL_POPULAR}&page=${page}`);
}

const pageSpan = document.querySelector(".pageNumber");

document.querySelector(".nextPage").addEventListener("click", () => {
  currentPage++;
  loadMovies(currentPage);
  pageSpan.textContent = currentPage;
});
document.querySelector(".prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadMovies(currentPage);
    pageSpan.textContent = currentPage;
  }
});
