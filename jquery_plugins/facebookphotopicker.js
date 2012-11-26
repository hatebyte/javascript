/**



Copyright (c) 2012 Scott Jones

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

(function ($) {

    var GRAPH_URL = "https://graph.facebook.com/";
    var USER_ABLUMS_URL = "https://graph.facebook.com/me/albums?access_token=";
    var ALBUM_COVERS_URL = "/picture?type=thumbnail&access_token=";
    var PICS_URL = "/photos/?fields=source&limit=50&access_token=";
    var albumDiv, galleryDiv, API_KEY, callback;

    getJSONP = function (path, callback) {
        doAjaxCall(path, function (jsonp) {
            callback(jsonp);
        });
    }

    doAjaxCall = function (uri, callback) {
        $.ajax({
            type: "GET",
            async: 'true',
            cache: 'false',
            url: uri,
            dataType: "jsonp",
            success: callback,
            error: onError
        });
    }

    onError = function (XMLHttpRequest, textStatus, errorThrown) {
        //alert('error: ' + textStatus + ' (' + errorThrown + ')');
    }

    loadAlbums = function () {
        getJSONP(USER_ABLUMS_URL + API_KEY, albumsRecieved);
    }

    albumsRecieved = function (jsonp) {
        var that = onAlbumClickedHandler;
        for (var i = 0; i < jsonp.data.length; i++) {

            // Made this a "SELECT" for now. We can change it to a list to be fancy
            var name = jsonp.data[i].name;
            var picspath = GRAPH_URL + jsonp.data[i].id + PICS_URL + API_KEY;
            var item = $("<option/>").attr({ "href": "javascript:void(0);", "picspath": picspath }).html(name).appendTo(albumSelect);

            //var imgsrcpath = GRAPH_URL + jsonp.data[i].cover_photo + ALBUM_COVERS_URL + API_KEY;
            //var picspath = GRAPH_URL + jsonp.data[i].id + PICS_URL + API_KEY;
            //var img = $("<img/>").attr({ "src": imgsrcpath, "picspath": picspath }).appendTo(albumDiv);
            //img[0].width = img[0].height = 50;

            albumSelect.change(function (e) {
                // Too many things happening on this I know.
                //doAjaxCall($(this).attr("picspath"), that);

                galleryDiv.empty();
                continueBtn.removeClass('active');

                doAjaxCall($(item + ':selected').attr("picspath"), that);

            });
        }
    }

    onAlbumClickedHandler = function (jsonp) {
        var that = this;
        galleryDiv.empty();
        for (var i = 0; i < jsonp.data.length; i++) {
            var imgsrcpath = jsonp.data[i].source;
            var img = $("<img/>").attr({ "src": imgsrcpath }).appendTo(galleryDiv);
            img[0].imgData = jsonp.data[i];
            img.click(function (e) {
                continueBtn.unbind("click");
                $('.galleryImages img').removeClass('selected');
                $(this).addClass('selected');
                continueBtn.addClass('active');
                var cdata = $(this)[0].imgData;
                continueBtn.bind("click", function(e) {
                    callback(cdata);
                });

            });
        }
    }



    $.fn.fbphotopicker = function ($API_KEY, $callback) {

        API_KEY = $API_KEY; callback = $callback;

        this.show = function () {
            albumDiv = $('<div/>').addClass('albums').html('<label>Choose an Album:</label>').appendTo(this);
            albumSelect = $('<select/>').addClass('albumImages').html('<option>- Choose -</option>').appendTo(albumDiv);
            galleryDiv = $('<div/>').addClass('galleryImages').appendTo(this);
            continueBtn = $('<a/>').addClass('btn').html('Continue').appendTo(this);
            loadAlbums();
        }

        this.close = function () {
            //if (continueBtn.length > 0 ) continueBtn.unbind("click");
            this.empty();
        }

        return this;
    }



})(jQuery);