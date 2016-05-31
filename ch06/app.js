var trace = R.curry(function(tag, x) {
    console.log(tag, x);
    return x;
});

var Effects = {
    getJson: R.curry(function (callback, url) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
            callback(eval(this.responseText));
        };

        xhr.onerror = console.log.bind(console);
        xhr.open('GET', url);
        xhr.send();
    }),

    setHtml: R.curry(function (selector, children) {
        document.querySelector(selector).innerHTML = children.join('\n');
    })
};

function img(src) {
    return '<img src="' + encodeURI(src) + '"/>';
}

function url(t) {
    return 'http://api.flickr.com/services/feeds/photos_public.gne?tags=' +
        encodeURIComponent(t) +
        '&format=json&jsoncallback=?';
}

var mediaUrl = R.compose(R.prop('m'), R.prop('media'));

var srcs = R.compose(R.map(mediaUrl), R.prop('items'));

var images = R.compose(R.map(img), srcs);

var renderImages = R.compose(Effects.setHtml('body'), images);

var app = R.compose(Effects.getJson(renderImages), url);

app('cats');
