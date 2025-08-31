// =======================
// Movie Finder App Script
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "df69ff6";
  const baseUrl = "https://www.omdbapi.com/";

  

  // DOM Elements
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results");
  const messageContainer = document.getElementById("message");
  const spinner = document.getElementById("spinner");

  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.getElementById("close-modal");



  // =======================
  // Modal Open /CloseFunction
  // =======================
  function openModal(movieData) {
  modalBody.innerHTML = `
    <img src="${
      movieData.Poster !== "N/A" ? movieData.Poster : "assets/placeholder.jpg"
    }" alt="${movieData.Title}">
    <h2>${movieData.Title} (${movieData.Year})</h2>
    <p><strong>Genre:</strong> ${movieData.Genre}</p>
    <p><strong>IMDB Rating:</strong> ${movieData.imdbRating}</p>
    <p><strong>Actors:</strong> ${movieData.Actors}</p>
    <p><strong>Plot:</strong> ${movieData.Plot}</p>
  `;
  modal.classList.add("show");
}

closeModal.addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});

  // =======================
  // Search Form Submit
  // =======================
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
      messageContainer.textContent = "Please enter a movie title.";
      resultsContainer.innerHTML = "";
      return;
    }

    messageContainer.textContent = "";
    spinner.classList.remove("hidden");
    searchMovies(query);
  });

  // =======================
  // Fetch Movies
  // =======================
  function searchMovies(query) {
    fetch(`${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        spinner.classList.add("hidden");
        if (data.Response === "True") {
          displayMovies(data.Search);
        } else {
          resultsContainer.innerHTML = "";
          messageContainer.textContent = "No movies found.";
        }
      })
      .catch((err) => {
        spinner.classList.add("hidden");
        resultsContainer.innerHTML = "";
        messageContainer.textContent = "Error fetching movies.";
        console.error(err);
      });
  }

  // =======================
  // Display Movies
  // =======================
  function displayMovies(movies) {
    resultsContainer.innerHTML = "";

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/placeholder.jpg"}" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <p>${movie.Type}</p>
      `;

      movieCard.addEventListener("click", () => {
        fetch(`${baseUrl}?apikey=${apiKey}&i=${movie.imdbID}`)
          .then((res) => res.json())
          .then((data) => openModal(data))
          .catch((err) => console.error(err));
      });

      resultsContainer.appendChild(movieCard);
    });
  }
});
