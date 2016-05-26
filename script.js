var BASE_URL = "https://api.twitch.tv/kraken/channels/";
$(document).ready(function () {
    $("form").submit(mainCallback);
    $(".btn").click(mainCallback);
});

$.fn.digits = function () {
    return this.each(function () {
        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    })
}

var mainCallback = function () {
    console.log("clicked");
    //get user value
    user = $("#input").val();
    var userArray = user.split(); //conditional if you have multiple vals
    //check to see if input string contains comma
    if (user.indexOf(',') > -1) {
        userArray = user.split(',');
        console.log(userArray);
        userArray = unique(userArray);
        console.log(userArray);

    }
    getJSONData(userArray);
    return false;
};

function getJSONData(userArray) {
    sorter(userArray);
    for (i = 0; i < userArray.length; i++) {
        (function (i) { //protect i from callback
            $.getJSON(BASE_URL + userArray[i] + "/?callback=?", function (json) {
                if (json.status !== 422 && json.status !== 404) {
                    //helpers
                    var card = '.card.' + i;
                    var cardCon = '.card-content.' + i;

                    $("<div class='row " + i + "'></div>").appendTo(".boxer");
                    $("<div class='col s12 m6 offset-m3 " + i + "'></div>").appendTo('.row.' + i);
                    $("<div class='card " + i + "'></div>").appendTo(".col." + i);

                    $("<div class='card-image " + i + "'></div>").appendTo(card);
                    $("<img src='" + json.logo + "' />").appendTo(".card-image." + i);

                    $("<div class='card-content " + i + "'></div>").appendTo(card);
                    $("<h2><a href='https://www.twitch.tv/" + userArray[i] + "'>" + json.name + "</a></h2>").appendTo(cardCon);
                    $("<h5>Total Views: " + json.views + "</h5>").appendTo(cardCon);
                    $('h5:first-of-type').digits(); //neuroticism...
                } else {
                    //do this uh...later
                    //                    $('img').attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
                    //                    $("h2:not(:first)").empty();
                    //                    $('#error').text(json.message);
                }
            })
        })(i);
    }
}

function sorter(userArray) { //make another JSON call for comparing views
    var dict = {};
    var values = [];
    if (userArray.length > 1) {
        for (i = 0; i < userArray.length; i++) {
            (function (i) {
                $.getJSON(BASE_URL + userArray[i] + "/?callback=?", function (json) {
                    values[i] = json.views;
                })
            })(i);
        }
    }
    dict = toObject(userArray, values);
    console.log(values);

    console.log(dict);
}

function unique(list) {
    var result = [];
    $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function toObject(names, values) {
    console.log(values);
    var result = {};
    for (var i = 0; i < names.length; i++)
        result[names[i]] = values[i];
    console.log(result);
    return result;
}