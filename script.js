const movieContainer = document.getElementById("movie-container");
const prevBtn = document.getElementById("prev-page");
const NextBtn = document.getElementById("next-page");
const movieInput = document.getElementById("movie-name");
const pageCount = document.getElementById("page-count");
const ApiKey = "f5d5baf0";
let currentPage = 1;

const MovieSearchForm = document.getElementById("movie-search-form");
MovieSearchForm.addEventListener("submit", search )

window.addEventListener("DOMContentLoaded", () => {
    const savedMovies = localStorage.getItem("lastSearch");
    if(savedMovies){
        const data = JSON.parse(savedMovies);
        displayMovieData(data)
    }
})

async function search(event) {

        event.preventDefault();
        const movieName = movieInput.value.trim();
        currentPage = 1;
        try{
            if(movieName !== ""){
                const MovieData = await getMovieData(movieName, currentPage)
                // console.log(MovieData)
                displayMovieData(MovieData);

                function saveMovieList(){
                    localStorage.setItem("lastSearch", JSON.stringify(MovieData))
                }

                saveMovieList()

                if(parseInt(MovieData.totalResults) >= 20){
                    NextBtn.style.display = "flex";
                    prevBtn.style.display = "flex";
                }else{
                    NextBtn.style.display = "none";
                    prevBtn.style.display = "none";
                }
                // loadMore()
            }else{
                throw new Error("input cannot be empty")
            }
        }catch(error){
            handleErrorMessage(error)
        }
}

async function getMovieData(movieName, page){
        const ApiURL = `http://www.omdbapi.com/?apikey=f5d5baf0&s=${movieName}&page=${page}`;
        const response = await fetch(ApiURL)
        // console.log(response);
        if(!response.ok) throw new Error("network error");
        // if (data.Response === "False") throw new Error(data.Error || "movie not found");
        return response.json();
}
async function getMovieDetails(id) {
        const ApiURL = `http://www.omdbapi.com/?apikey=${ApiKey}&i=${id}&plot=full`;
        const response = await fetch(ApiURL);
        // console.log(response)
        if (!response.ok) throw new Error("Network error");
        return response.json();
}

async function displayMovieData(data){
    movieContainer.innerHTML = "";
    // console.log(data)
    if(data.Response === "True"){

        for ( const movie of data.Search ) {

            const details = await getMovieDetails(movie.imdbID);
            console.log(details)
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie");

            movieCard.innerHTML = `
            <img src="${details.Poster !== "N/A" ? details.Poster : "placeholder.jpg"}" alt="${details.Title}" />

            <div class="details-text-info">
            <h2>${details.Title} ${details.Year}</h2>
            <p><strong class="details.genre">Genre:</strong> ${details.Genre || "N/A"}</p>
            <p class="details-actors"><strong>Actors:</strong> ${details.Actors || "N/A"}</p>
            <p><strong>Plot:</strong> ${details.Plot || "No plot available"}</p>
            <a href="https://www.imdb.com/title/${details.imdbID}/" target="_blank" class="movie-link">More Info on IMDb</a>
            </div>
            `;
            movieContainer.appendChild(movieCard);
        }

        const totalPage = Math.ceil(data.totalResults / 10);
        pageCount.textContent = `Page: ${currentPage} / ${totalPage}`;

    }else{
        movieContainer.innerHTML = `<p> <strong> ${data.error || "movie not found"} </strong> </p>`;
    }

}

function handleErrorMessage(message){
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    movieContainer.innerHTML = "";
    errorMsg.textContent = message || error;

    movieContainer.appendChild(errorMsg);
}


NextBtn.addEventListener("click", loadNext)
prevBtn.addEventListener("click", loadPrev)
async function loadNext() {
    currentPage++;
    const nextData = await getMovieData(movieInput.value, currentPage);
    localStorage.setItem("lastSearch", JSON.stringify(nextData));
    displayMovieData(nextData);
}

async function loadPrev(){
    currentPage--;
    const prevData = await getMovieData(movieInput.value, currentPage);
    localStorage.setItem("lastSearch", JSON.stringify(prevData));
    saveMovieList()
    displayMovieData(prevData)
}

// using Key event to control next and prev bottons