(() => {

  // Variables
  const characterCount = 12;
  const peopleUrl = "https://swapi.info/api/people";

  const characterBox = document.querySelector("#character-box");
  const peopleStatus = document.querySelector("#people-status");

  const movieCon = document.querySelector("#movie-con");
  const movieStatus = document.querySelector("#movie-status");
  const movieTemplate = document.querySelector("#movie-template");

  const menu = document.querySelector("#menu");
  const hamburger = document.querySelector("#hamburger");
  const closeButton = document.querySelector("#close");
  const menuLinks = document.querySelectorAll("#menu nav ul li a");

  // menu

  function toggleMenu() {

    if (!menu) return;

    menu.classList.toggle("open");

    if (menu.classList.contains("open")) {
      menu.setAttribute("aria-hidden", "false");
    } else {
      menu.setAttribute("aria-hidden", "true");
    }

  }

  function handleHamburgerClick(e) {
    e.preventDefault();
    toggleMenu();
  }

  function handleCloseClick(e) {
    e.preventDefault();
    toggleMenu();
  }

  function handleMenuLinkClick() {
    toggleMenu();
  }

  function registerMenuEvents() {

    if (hamburger)
      hamburger.addEventListener("click", handleHamburgerClick);

    if (closeButton)
      closeButton.addEventListener("click", handleCloseClick);

    menuLinks.forEach(link =>
      link.addEventListener("click", handleMenuLinkClick)
    );

  }
  // load characters

  function loadCharacters() {

    peopleStatus.textContent = "Loading characters...";
    characterBox.innerHTML = `<p class="hint">Loading characters...</p>`;

    fetch(peopleUrl)

      .then(res => res.json())

      .then(data => {

        const people = Array.isArray(data)
          ? data.slice(0, characterCount)
          : data.results.slice(0, characterCount);

        const ul = document.createElement("ul");

        people.forEach(person => {

          const li = document.createElement("li");
          const link = document.createElement("a");

          const film = person.films?.[0] || "";

          link.textContent = person.name;
          link.href = film || "#";
          link.dataset.film = film;

          link.addEventListener("click", handleCharacterClick);

          li.appendChild(link);
          ul.appendChild(li);

        });

        characterBox.innerHTML = "";
        characterBox.appendChild(ul);

        peopleStatus.textContent =
          `Loaded ${people.length} characters.`;

      })

      .catch(error => {

        console.log(error);

        peopleStatus.textContent =
          "Could not load characters.";

        characterBox.innerHTML =
          `<p class="hint">Could not load characters.</p>`;

      });

  }

  // character click

  function handleCharacterClick(e) {

    e.preventDefault();

    const filmUrl = e.currentTarget.dataset.film;

    if (!filmUrl) {

      movieStatus.textContent =
        "No movie found.";

      movieCon.innerHTML =
        `<p class="hint">No movie found.</p>`;

      return;

    }

    loadMovie(filmUrl);

  }

  // load movie

  function loadMovie(filmUrl) {

    movieStatus.textContent = "Loading movie...";

    movieCon.innerHTML =
      `<div class="spinner"></div>`;

    fetch(filmUrl)

      .then(res => res.json())

      .then(film => {

        const clone =
          movieTemplate.content.cloneNode(true);

        clone.querySelector(".movie-title")
          .textContent = film.title;

        clone.querySelector(".movie-meta")
          .textContent =
          `Director: ${film.director} • Release: ${film.release_date}`;

        clone.querySelector(".movie-crawl")
          .textContent = film.opening_crawl;


        const filmId =
          film.url.match(/\/(\d+)\/?$/)?.[1];

        const poster =
          clone.querySelector(".movie-poster");

        poster.src = `images/${filmId}.jpg`;
        poster.alt = film.title;

        poster.addEventListener("error", () => {
          poster.removeAttribute("src");
          poster.alt = "Poster not found";
        });

        movieCon.innerHTML = "";
        movieCon.appendChild(clone);

        movieStatus.textContent = "Movie loaded.";

      })

      .catch(error => {

        console.log(error);

        movieStatus.textContent =
          "Could not load movie.";

        movieCon.innerHTML =
          `<p class="hint">Could not load movie.</p>`;

      });

  }

  //

  registerMenuEvents();
  loadCharacters();

})();