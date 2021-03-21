var soap = require('soap');
var express = require('express');
var app = express();
var xml = require("fs").readFileSync("service.wsdl", "utf-8");

var port = process.env.PORT || 8000;

app.use(express.urlencoded({
    extended: true
}));

var serviceCalcul = {
    service : {
        soapService : {
            coutLivraison : function(args) {
                let dist = args.dist || 0;
                let pds = args.pds || 0;
                let result = 0.1*dist + 2.0*pds;
                console.log(args.dist);
                console.log(args.pds);
                return {
                    prixDeLaBanqueroute : result
                };
            }
        }
    }
};



app.set('view engine', 'ejs');
app.use(express.json())
app.listen(port, function(){
    console.log("Saucisse à l'écoute...");
    soap.listen(app, '/wsdl', serviceCalcul, xml, function(){console.log("Test")});
});

app.get("/", function(req,res){res.render("client")});

app.post("/prix", function (req, res){
    var url = 'http://localhost:8000/wsdl?wsdl';
    var args = { pds: req.body.pds, dist: req.body.dist };
    soap.createClient(url, function (err, client) {

        client.coutLivraison({
            pds: req.body.pds, 
            dist: req.body.dist}, 
            function (err, result, raw) {
            console.log(result);
                res.render('prix', {
                    pds: req.body.pds, 
                    dist: req.body.dist,
                    livraisonPrix: result.prixDeLaBanqueroute
                });
            }
        );
    });
});
