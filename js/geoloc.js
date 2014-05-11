var geoloc =(function () {
    var
    updateLinks  = function () {
        navigator.geolocation.getCurrentPosition(
            function(data){
                var elm = document.getElementsByTagName("a");
                for(var i = 0; i < elm.length; ++i) {
                    elm[i].href += "?latitude="+data.coords.latitude+"&longitude="+data.coords.longitude;
                }
            },
            function(err){}
        );
    };
    return {
        get: updateLinks
    };
}());

