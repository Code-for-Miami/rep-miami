
function createSubmitForm(address) {
    var str_form = '<form id ="dynamicForm" method ="get" action="repsView.html" role="form"><input type= "hidden" id = "inputAddress" name="inputAddress" value ="' + address + '"></form>';
    document.getElementById('locationInput').innerHTML = str_form;
    document.getElementById('dynamicForm').submit();
}

function getUserAddress() {
    var user_location = $("#inputAddress").val() +", " + $("#dropdownCity option:selected").text() + " FL";
    createSubmitForm(user_location);
}

function writeAddressName(latLng) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      "location": latLng
    },  function(results, status) {
            if (status === google.maps.GeocoderStatus.OK){
                var field = results[0];
                var component = field.address_components;
                var len = component.length;
                var addr = 'error';
                for ( var i = 0; i < len; ++i ) {
                    if (component[i].long_name.indexOf('Miami-Dade') !== -1) {
                        addr = field.formatted_address;
                        console.log(component[i].long_name);
                        break;
                    }
                }
                createSubmitForm(addr);
            }
            else
                console.log('Location search was unsuccesful. Error : ' + status);
        });
}

/*
 * Make request to Google Maps Geocoder API
 */
function geolocateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
           // alert(pos);
            writeAddressName(pos);
        });
    }
    else
        console.log('Error: The Geolocation service failed.');
}
