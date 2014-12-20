
function createSubmitForm(address) {
    var str_form = '<form id="dynamicForm" method="get" action="repsView.html" role="form"><input type="hidden" id="inputAddress" name="inputAddress" value="' +address + '"></form>';;
    $('#locationInput')[0].innerHTML = str_form; 
    $('#dynamicForm')[0].submit();
}

function getUserAddress() {
    var user_location = $("#inputAddress").val() +", " + $("#dropdownCity option:selected").val() + " FL";
    createSubmitForm(user_location);
}

function writeAddressName(latLng) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      "location": latLng
  },  function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var field = results[0];
            var component = field.address_components;
            var len = component.length;
            var addr = 'error';
            for ( var i = 0; i < len; ++i ) {
                if (component[i].long_name === 'Miami-Dade County') {
                    addr = field.formatted_address;
                    break;
                }
            }
            createSubmitForm(addr);
        } else 
        alert('Location search was unsuccesful. Error : ' + status);
    });
}

/*
 * Make request to Google Maps Geocoder API
 */
 function geolocateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            writeAddressName(pos); //comment this line to stop the page from reload when debugging 
        });
    } else {
        alert('Error: The Geolocation service failed.');
    }
}
