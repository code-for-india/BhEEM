var api = require("./api");

var parameters = {
  location:[12.9937286, 77.6606035],
  types:"police"
};

api.get(parameters,function(data){
  console.log(data);
})