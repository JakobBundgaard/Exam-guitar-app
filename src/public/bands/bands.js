(async function getBands() {
    try {
        fetch('/resource', {

            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {

                var listEl = document.getElementById("band-list");
                var strHTML = "";
                data.bands.forEach(element => {
                    strHTML += "<li>" + element + "</li>"
                });

                listEl.innerHTML = strHTML;


            });




    } catch (error) {
        console.log(error);
    }

})();

