angular.module('xs1h').factory('timestampMarker', [ function() {
    var timestampMarker = {
        request: function(config) {
            var headersGetter = arguments[0].headers;
            if ((headersGetter["Accept"] && headersGetter["Accept"].split(",")[0]) == "application/json"&&config["url"].indexOf("template")<0) {
                config.url = httpBase + config.url;
                // config.headers = {"content-Type":"application/json"};
            }
            return config;
        },
        response: function(response) {
            return response;
        }
    };
    return timestampMarker;
}])