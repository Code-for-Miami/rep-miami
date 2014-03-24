// http://openstates.org/api/v1/legislators/geo/?apikey=0029739b9483433f95c7036e042a4b4d&lat=25.75&long=-80.36
/**
 * Execute request to look up representative info for provided location.
 */

//openState(25.75,-80.36);

$.getScript("http://apis.google.com/js/client.js?onload=load", function() {});

function openState(lat,long) {
    $.ajax({ 
        type: "GET",
        dataType: "jsonp",
        url: "http://openstates.org/api/v1/legislators/geo/?apikey=0029739b9483433f95c7036e042a4b4d&lat="+lat+"&long="+long,
        success: function(data){
            for (var k = 0; k < data.length; k++) {
                var response = data[k];
                var response_list = response.offices[0];
                var name, party, site, photo;
                var address = '';
                var phone = "";
                var email = "";
                if (response.hasOwnProperty('offices'))  {
                    response_list = response.offices;
                
                    if (response_list.hasOwnProperty('phone'))
                        phone = response_list.phone;
                    else
                        phone = "";
                    
                    if (response_list.hasOwnProperty('address')) {
                    address = response_list.address + "<br> ";
                    address = formatLine(address);
                }
                
                
                }
                var office_name = "Florida State Legislature";
                
                if (response.hasOwnProperty('full_name')) {
                    name = response.full_name;
                }
                else
                    name = "";

                if (response.hasOwnProperty('party'))
                    party = " - " + response.party;
                else
                    party = "";
            

                if (response.hasOwnProperty('url'))
                    site = truncate(response.url);
                else
                    site = "";

                if (response.hasOwnProperty('photo_url'))
                    photo = 'src=' + '"' + response.photo_url + '"';
                else
                    photo = false;
                
                var repNode = writeRepNode(name, office_name, party, phone, site, photo, address);

                $("#state").append(repNode);
                   
            }
       // offices.push({"name" : "Florida Legislature", "level":"city"});
    //members[key] = { "name" : response.full_name, "address":[{"locationName": "response_list.address" }],
          //  "party" : response.party, "phones": [response_list.phone], "urls" : response_list.url, "photoUrl": response.photo_url };
       // alert(value.full_name);
   }
    
   
});

}
function lookup(address, callback) {
    //Request object
    var req = gapi.client.request({
        'path': '/civicinfo/us_v1/representatives/lookup',
        'method': 'POST',
        'params': {'includeOffices': 'true'},
        'body': {'address': address}
    });
    req.execute(callback);
}

function truncate(str) {
    if (str.length > 50) {
        return str.substring(0, 50) + '<br>' + str.substring(50, str.length);
    }
    return str;
}

function formatLine(str) {
    var temp = str.charAt(0).toUpperCase() + str.slice(1);
    var wordArr = temp.split(' ');
    var properString = [];
    for (var i = 0; i < wordArr.length; ++i) {
        var value = wordArr[i];
        properString.push(value.charAt(0).toUpperCase(), value.slice(1), ' ');
    }

    return properString.join('');
}

function writeRepNode(name, officeName, party, phone, site, photo, address) {
    var imgNode;
    if (photo === false)
        imgNode = '<span class= "rep-icon glyphicon glyphicon-user"></span>';
    else
        imgNode = '<img alt = "rep_photo" class="rep-img"' + photo + ' >';
    return '<li class = "rep-list-group-item">' + imgNode + '<div class = "contact-info"><strong>' + name + '</strong>' + party + '<br>' + officeName + '<br>' + address + '</br><abbr title = "Phone"></abbr>' + phone + '<br><a href ="' + site + '">' + site + '</a></div></li>';
}

/**
 * Format and render results in the DOM.
 */
function renderResults(response, rawResponse) {
    var locationId = document.getElementById('locationBlock');
    if (!response || response.error || response.status !== 'success') {
        locationId.innerHTML = '<div class = "alert alert-danger">Sorry, we were unable to locate information for the address entered. <a href = "index.html" class = "alert-link"><br>Try again?</a></div>';
        return;
    }

    var inputObj = response.normalizedInput;
    var normalizedAddress = inputObj.line1 + ', ' + inputObj.city + ' ' +
            inputObj.state + ' ' + inputObj.zip;

    locationId.innerHTML = '<strong>' +
            formatLine(normalizedAddress) + '</strong>';

    var divisionObj = response.divisions;
    for (var key in divisionObj) {
        var value = divisionObj[key];
        if (value.scope === "congressional") {
            document.getElementById('sectionDiv').innerHTML = '<p>' +
                    formatLine(value.name) + '<br></p>';
        }
    }

    var officeArr = [];
    //var officialsObj = response.officials;
    //openState(25.75,-80.36, officialsObj, officeArr);
    
    var officeObj = response.offices;
    for (var key in officeObj) {
        var value = officeObj[key];
        if (value.name !== "President" && value.name !== "Vice President") {
            if (value.name === "United States Senate") {
                officeArr.push(value);
            }
            officeArr.push(value);
        }
    }

    var k = 0;
    var officialsObj = response.officials;
    
  //  openState(25.75,-80.36, officialsObj, officeArr);
    
    for (var key in officialsObj) {
        var value = officialsObj[key];

        if (value.name !== "Barack Hussein Obama II"
                && value.name !== "Joseph (Joe) Robinette Biden Jr.") {
            var name, party, phone, site, photo;
            var address = '';

            if (value.hasOwnProperty('address')) {
                var addr = value.address[0];

                if (addr.hasOwnProperty('line1'))
                    address += addr.line1 + "<br> ";
                if (addr.hasOwnProperty('city'))
                    address += addr.city;
                if (addr.hasOwnProperty('state'))
                    address += ", " + addr.state;
                if (addr.hasOwnProperty('zip'))
                    address += " " + addr.zip;

                address = formatLine(address);
            }

            var thisOffice = officeArr[k++];
            var officeLevel = thisOffice.level;
            var officeName = thisOffice.name;

            if (value.hasOwnProperty('name'))
                name = value.name;
            else
                name = "";

            if (value.hasOwnProperty('party'))
                party = " - " + value.party;
            else
                party = "";

            if (value.hasOwnProperty('phones'))
                phone = value.phones[0];
            else
                phone = "";

            if (value.hasOwnProperty('urls'))
                site = truncate(value.urls[0]);
            else
                site = "";

            if (value.hasOwnProperty('photoUrl'))
                photo = 'src=' + '"' + value.photoUrl + '"';
            else
                photo = false;

            var repNode = writeRepNode(name, officeName, party,
                    phone, site, photo, address);

            switch (officeLevel) {
                case 'city' :
                    $("#city+other").append(repNode);
                    break;
                case 'county' :
                    $("#county").append(repNode);
                    break;
                case 'federal' :
                    $("#federal").append(repNode);
                    break;
                case 'other' :
                    $("#city+other").append(repNode);
                    break;
                case 'state' :
                    $("#state").append(repNode);
                    break;
                default :
                    break;
            }
        }
    }
    
    //openState(25.75,-80.36);
}

function parseUrl(str) {
    str = str.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex_str = "[\\?&]" + str + "=([^&#]*)";
    var regex = new RegExp(regex_str);
    var results = regex.exec(window.location.href);
    if (results === null)
        return "";
    else
        return results[1];
}

/**
 * Initialize the Google Civic Information API client, and make a request.
 */

function load() {
    gapi.client.setApiKey('AIzaSyCN9rkEJ848kuw9-YO7vZ41Mt7v2bhckcs');
    var addr = parseUrl('inputAddress');
    lookup(addr, renderResults);
}
