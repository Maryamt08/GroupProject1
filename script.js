$(document).ready(function() {


    $("#button").on("click", function () {

        var address = $("#address").val();
        var city = $("#city").val();
        var state = $("#state").val();
        var zip = $("#zip").val();

        var geocode = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + city + state + zip + "&key=AIzaSyBsK6ftRatc2anAUk0KLTWAehPJlklUeC8"

        $.ajax({
            method: "GET",
            url: geocode,
        }).then(function(response){
            let lat = response.results[0].geometry.location.lat
            let lon = response.results[0].geometry.location.lng

            function initMap() {
                var options = {     
                    zoom: 15,
                    center: { lat: lat, lng: lon}
                }
                var map = new google.maps.Map(document.getElementById('map'), options);
                var marker = new google.maps.Marker({
                    position: { lat: lat, lng: lon},
                    map: map
                });
            }
    
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

                for(var i = 0; i < rentalList.length; i++){
                    listingContainer = $("<div>")
                    addTitle = $("<h1>").text(rentalList[i].formattedAddress);
                    price = $("<h4>").text("$ " + rentalList[i].price);
                    propType = $("<p>").text(rentalList[i].propertyType);
                    sqrFoot = $("<p>").text(rentalList[i].squareFootage + " Square Feet");

                    listingContainer.attr("class", "listingContainer");
                    listingContainer.append(addTitle, price, propType, sqrFoot);

                    $("#testView").append(listingContainer);

                }
            });

            initMap();
        });
    });
});