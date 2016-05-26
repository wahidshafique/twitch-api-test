    $(document).ready(function () {
        $(".btn").click(function () {
            console.log("clicked");
            //get user value
            user = $("#input").val();
            var userArray = user.split(); //conditional if you have multiple vals
            //check to see if input string contains comma
            if (user.indexOf(',') > -1) {
                userArray = user.split(',');
            }
            getJSONData(userArray);
            return false;
        });
    });

    $.fn.digits = function () {
        return this.each(function () {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        })
    }

    function getJSONData(userArray) {
        console.log(userArray.length);
        for (i = 0; i < userArray.length; i++) {
            (function (i) { //protect i from callback
                $.getJSON("https://api.twitch.tv/kraken/channels/" + userArray[i] + "/?callback=?", function (json) {
                    if (json.status !== 422 && json.status !== 404) {
                        //use anon function or whatever later
                        //helpers
                        var card = '.card.' + i;
                        var cardCon = '.card-content.' + i;
                        var br = '<br/>';

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
                        $('img').attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
                        $("h2:not(:first)").empty();
                        $('#error').text(json.message);
                    }
                })
            })(i);
        }
    }