(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    const nytAPIKey = 'b4b7ec43b7094cad9beca692a0229fbc';
    const unsplashedAPIKey = '8381626eb96c2d2f7e5019348738ea54892f39e1f13f2e4169bdcff7cf8c2ea4';
    const unsplashedSecret = '1f51ca15f8eaad64a328dfaf368693e3d18197f4a749c793e3078f5fca3bdad0';


    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        //UNSPLASHED API
        const unsplashRequest = new XMLHttpRequest();

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: `Client-ID ${unsplashedAPIKey}`
            }
        }).done(addImage)
            .fail(function (err) {
                requestError(err, 'images');
            });

        function addImage(data) {
            let htmlContent = '';

            if (data && data.results && data.results[0]) {
                const firstImage = data.results[0];
                htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
            } else {
                htmlContent = '<div class="error-no-image">No images available </div>';
            }
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        };

        //NYT API
        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytAPIKey}`
        }).done(addArticles)
            .fail(function (err) {
                requestError(err, 'images');
            });

        function addArticles(data) {
            let htmlContent = '';

            if (data && data.response.docs && data.response.docs[0]) {

                htmlContent = '<ul>' + data.response.docs.map(article = > `<li class="article">
                    <h1><a href="${article.web_url}" target="_blank">${article.headline.print_headline}</h1></a>
                    <h2>${article.headline.main}</h2>
                    <p>${article.snippet}</p></li>`
            ).
                join("") + '</ul>'


            } else {
                htmlContent = '<div class="error-no-articles">No articles available </div>';
            }

            responseContainer.insertAdjacentHTML('afterend', htmlContent);
        };

    });
})();
