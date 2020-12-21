$(document).ready(function () {


    $("#button").on("click", function () {

        var address = $("#address").val();
        var city = $("#city").val();
        var state = $("#state").val();
        var zip = $("#zip").val();


        //ajax request for the geocode(longitude and latitude) to be input to the google maps and zomato
        var geocode = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + city + state + zip + "&key=AIzaSyBsK6ftRatc2anAUk0KLTWAehPJlklUeC8"

        $.ajax({
            method: "GET",
            url: geocode,
        }).then(function (response) {
            let lat = response.results[0].geometry.location.lat
            let lon = response.results[0].geometry.location.lng

            //google maps query and pushed to dom with marker
            function initMap() {
                var options = {
                    zoom: 15,
                    center: {
                        lat: lat,
                        lng: lon
                    }
                }
                var map = new google.maps.Map(document.getElementById('map'), options);
                var marker = new google.maps.Marker({
                    position: {
                        lat: lat,
                        lng: lon
                    },
                    map: map
                });
            }


            //ajax request for the local housing availability
            const housingQuery = {
                "async": true,
                "crossDomain": true,
                "url": "https://realty-mole-property-api.p.rapidapi.com/rentalListings?city=" + city + "&state=" + state,
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "d59a39dd95msh51e63b60bc85ed6p12a346jsnf1aa477a274b",
                    "x-rapidapi-host": "realty-mole-property-api.p.rapidapi.com"
                }
            };

            $.ajax(housingQuery).done(function (rentalList) {
                console.log(rentalList);



                //ajax request for the local bars and restaurants through zomatoAPI
                var zomatoAPIKey = "ea6e879245c6df1e9d1d3c63e8cd78a1"

                const zomatoQuery = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://developers.zomato.com/api/v2.1/geocode?lat=" + lat + "&lon=" + lon,
                    "method": "POST",
                    "headers": {
                        "user-key": "ea6e879245c6df1e9d1d3c63e8cd78a1"
                    },
                    "data": {
                        "accessToken": zomatoAPIKey
                    }
                };

                $.ajax(zomatoQuery).done(function (zomatoResponse) {
                    console.log(zomatoResponse);
                    var nlIndex = zomatoResponse.popularity.nightlife_index;
                    var linkToZomatoSite = zomatoResponse.link;
                    var areaInfo = $("#areaInfo");
                    var zomatoATag = $("<a>");
                    zomatoATag.attr("href", linkToZomatoSite);
                    zomatoATag.text("Go To Zomato");
                    areaInfo.append(zomatoATag);
                    console.log(linkToZomatoSite);

                    //forloop containing the indevidual containers and information pushed to the DOM
                    for (var i = 0; i < rentalList.length; i++) {
                        listingContainer = $("<div>")
                        addTitle = $("<h1>").text(rentalList[i].formattedAddress);
                        price = $("<h4>").text("$ " + rentalList[i].price);
                        propType = $("<p>").text(rentalList[i].propertyType);
                        sqrFoot = $("<p>").text(rentalList[i].squareFootage + " Square Feet");
                        nightLife = $("<p>").text("Nightlife Index: " + nlIndex);


                        listingContainer.attr("class", "listingContainer");
                        listingContainer.append(addTitle, price, propType, sqrFoot, nightLife);

                        $("#testView").append(listingContainer);

                    }
                });



            });

            initMap();
        });


    });
});