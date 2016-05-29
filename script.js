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
    var user = $("#input").val();
    var userArray = user.split(); //conditional if you have multiple vals
    //check to see if input string contains comma
    if (user.indexOf(',') > -1) {
        userArray = user.split(',');
    }
    userArray = Array.from(new Set(userArray));
    userArray = sorter(userArray);
    return false;
};

function getJSONData(userArray) {
    for (i = 0; i < userArray.length; i++) {
        (function (i) { //protect i from callback
            $.getJSON(BASE_URL + userArray[i] + "/?callback=?", function (json) {
                if (json.status !== 422 && json.status !== 404) {
                    //helpers
                    var card = '.card.' + i;
                    var cardCon = '.card-content.' + i;

                    $("<div class='row " + i + "'></div>").appendTo(".boxer");
                    $("<div class='col s12 m6 offset-m3 l4 offset-l4 " + i + "'></div>").appendTo('.row.' + i);
                    $("<div class='card " + i + "'></div>").appendTo(".col." + i);

                    $("<div class='card-image " + i + "'></div>").appendTo(card);
                    $("<img src='" + json.logo + "' />").appendTo(".card-image." + i);

                    $("<div class='card-content " + i + "'></div>").appendTo(card);
                    $("<h2><a href='https://www.twitch.tv/" + userArray[i] + "'>" + json.name + "</a></h2>").appendTo(cardCon);
                    $("<h5>Total Views: " + json.views + "</h5>").appendTo(cardCon);
                    $('h5:first-of-type').digits(); //neuroticism...
                } else {
                    alert(json.message);
                }
            })
        })(i);
    }
}

function sorter(userArray) { //make another JSON call for comparing views
    var sortPromise;
    //var dict = {};
    var values = [];
    if (userArray.length > 1) {
        for (i = 0; i < userArray.length; i++) {
            (function (i) {
                sortPromise = $.getJSON(BASE_URL + userArray[i] + "/?callback=?", function (json) {
                    values[i] = json.views;
                })
            })(i);
        }
        $.when(sortPromise).done(function () {
            var swapped;
            //cheapo sorting w/o assoc.
            do {
                swapped = false;
                for (var i = 0; i < userArray.length - 1; i++) {
                    if (values[i] > values[i + 1]) {
                        var temp1 = userArray[i];
                        var temp2 = values[i];

                        values[i] = values[i + 1];
                        userArray[i] = userArray[i + 1];
                        values[i + 1] = temp2;
                        userArray[i + 1] = temp1;
                        swapped = true;
                    }
                }
            } while (swapped);
            console.log("after sort " + userArray);
            console.log("after sort " + values);
            return getJSONData(userArray.reverse());
        })
        console.log("before sort " + userArray);
        console.log("before sort " + values);
    } else {
        return getJSONData(userArray);
    }
}