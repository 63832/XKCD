var maxComic = -1;
var currentComic = -1;
var preloadedImage = new Image();

window.onload = function () {
    // Hämta senaste comic
    getComic("latest");
    // Sätter funktionalitet för nav knappar
    document.getElementById("first").addEventListener("click", function () {
        getComic(1);
    });
    document.getElementById("prev").addEventListener("click", function () {
        if (currentComic > 1) getComic(currentComic - 1);
    });
    document.getElementById("next").addEventListener("click", function () {
        if (currentComic < maxComic) getComic(currentComic + 1);
    });
    document.getElementById("last").addEventListener("click", function () {
        getComic(maxComic);
    });
    document.getElementById("random").addEventListener("click", function () {
        let randComic = Math.floor(Math.random() * maxComic) + 1;
        getComic(randComic);
    });
};

function getComic(which) {
    // Hämta(fetch) data från xkcd api
    fetch("https://xkcd.vercel.app/?comic=" + which)
        .then(function (response) {
            // Kolla om svaret är ok(200)
            if (response.status === 200) {
                return response.json();
            } else {
                // Kastar ett felmeddelande om status inte är ok
                throw new Error("Failed to load comic");
            }
        })
        .then(function (data) {
            // Uppdatera maxComic värde
            if (maxComic < data.num) {
                maxComic = data.num;
            }
            // Skicka json data för behandling till DOM
            console.log(data);
            appendComic(data);
            preloadNextComic(data.num + 1);
        })
        .catch(function (error) {
            // Logga eventuella errors
            console.log("Error: ", error);
        });
}
// Laddar in nästa comic
function preloadNextComic(nextComicNumber) {
    if (nextComicNumber <= maxComic) {
        preloadedImage.src =
            "https://xkcd.vercel.app/?comic=" + nextComicNumber;
    }
}

function appendComic(data) {
    let comicDiv = document.getElementById("comic");

    //tömmer tidigare data ur comicDiv
    comicDiv.innerHTML = "";

    // Lagar nytt img element för bilden
    let comicImage = document.createElement("img");

    // Läser in bilden från api data
    comicImage.src = data.img;

    // Läser in alt texten från api data
    comicImage.alt = data.alt;
    comicImage.className = "comic-image";

    let comicTitle = document.createElement("h2");
    comicTitle.textContent = data.title;
    comicTitle.className = "comic-title";

    let comicFig = document.createElement("figure");

    let comicAltText = document.createElement("figcaption");
    comicAltText.textContent = data.alt;
    comicAltText.className = "comic-alt-text";

    let comicDate = document.createElement("p");
    let comicPublishDate = new Date(data.year, data.month - 1, data.day);
    comicDate.textContent = `Date: ${comicPublishDate.toLocaleDateString()}`;
    comicDate.className = "comic-date";

    let comicNumber = document.createElement("p");
    comicNumber.textContent = `Comic #${data.num}`;
    comicNumber.className = "comic-number";

    // Lägger till titel, bild och alt text i tomma div:en
    comicDiv.appendChild(comicTitle);
    comicDiv.appendChild(comicDate);
    comicDiv.appendChild(comicNumber);

    comicFig.appendChild(comicImage);
    comicFig.appendChild(comicNumber);
    comicFig.appendChild(comicAltText);

    comicDiv.appendChild(comicFig);

    // Nuvarande numret på comicen
    currentComic = data.num;
}
