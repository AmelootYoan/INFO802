var soap = require('soap');
var url = 'http://localhost:8000/wsdl?wsdl';
var args = { poids: 5, distance: 150 };
soap.createClient(url, function (err, client) {
    //console.log(client);
    client.coutLivraison(args, function (err, result, raw) {
        console.log(result);
    });
});