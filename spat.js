
$(function() {

        var wikifiers = {};

        var notify = function(msg, data) {
            $("#notify").append("<pre>" + msg + ':' + data + "</pre>")
        };

        var errorHandler = function(xhr, status, exc) {
            notify("failure", status);
        };

        var setTitle = function(tiddler) {
            $('#title').text(tiddler.title);
            $('title').text(tiddler.title);
        };
        
        var displayTiddler = function(tiddler) {
            var tiddlerSection = $('<section class="tiddler">')
                .text(tiddler.text);
            $("article").append(tiddlerSection);
        };

        var formatTiddler = function(tiddler) {
            setTitle(tiddler);
            var recipe = tiddler.recipe.name;
            var collection_uri = tiddler.recipe.route() + '/tiddlers.json';


            var useCache = false;
            var globals, wikify, store, Tiddler;
            if (wikifiers[collection_uri] === undefined) {
                globals = createWikifier(window, $);
                wikifiers[collection_uri] = globals;
            } else {
                globals = wikifiers[collection_uri];
                useCache = true;
            }
            wikify = globals[0];
            store = globals[1];
            Tiddler = globals[2];

            if (useCache) {
                wikify(tiddler.text, $("article")
                    .append('<section class="tiddler">')[0], null, null);
            } else {
                $.ajax({
                    url:  collection_uri + '?fat=1',
                    type: 'GET',
                    success: function(data, status, xhr) {
                        twik.loadRemoteTiddlers(store, Tiddler, collection_uri, data);
                        wikify(tiddler.text, $("article")
                            .append('<section class="tiddler">')[0], null, null);
                    },
                    error: errorHandler,
                    dataType: "text", // loadRemoteTiddlers does its own json processing
                });
            }

        };

        var tid = new tiddlyweb.Tiddler("Prototype with SPA");
        tid.recipe = new tiddlyweb.Recipe("cdent_public",
                "http://cdent.tiddlyspace.com");
        tid.get(formatTiddler, errorHandler);
        /*
        var tid = new tiddlyweb.Tiddler("Review of Original TiddlySpace Manifesto");
        tid.recipe = new tiddlyweb.Recipe("cdent_public",
                "http://cdent.tiddlyspace.com");
        tid.get(formatTiddler, errorHandler);
        */

}); 
