
/**
 * Module dependencies.
 */
/// appeler au express
var express = require('express'),
   routes = require('./routes');
///var passport= require('passport');
//var compression = require('compression');
var path    = require("path");
var session = require('express-session');
//var jsdom= require('jsdom');
//var call_jsdom = require('jquery');
//passage https

 var  result = false;
 var typeUser =1;
 var  lang = 'en';

var fs = require ('fs');

var bodyParser = require('body-parser') ;
/*var hskey = fs.readFileSync('certs/eloquenzior-key.pem');
var hscert = fs.readFileSync('certs/eloquenzior-cert.pem')

var optionsHTTPS = {
    key: hskey,
    cert: hscert
};
 var  result = false;
 var typeUser =1;

var app = module.exports = express.createServer(optionsHTTPS); //HTTPS */
//var app = module.exports = express.createServer(); //HTTP

  //~ app.use(express.basicAuth('eloquenzior', 'Th0l0s'));
//http://blog.modulus.io/nodejs-and-express-basic-authentication
// Authenticator
/*app.use(express.basicAuth(function(user, pass, callback) {
  result = (user === 'eloquenzior' && pass === 'Th0l0s');

  typeUser=2;
//console.log(result);

 callback(null , result);
})); */

// Configuration
//module Express
//yenh them vao
//var session = require('express-session');
var app = express()
app.set('view engine', 'jade')
// set evn:= production;
app.set('env', "production");
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('view engine', 'jade');

app.set('port', process.env.PORT || 3000);
app.set('view options', {
  layout: false
});
//var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(app.router);


/// call the Router
  //app.use(app.router);
  //app.use(compression());
  //set environmment is in the folder public : canthiet
  console.log("__dirname"+__dirname);
  app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 

app.get('/', routes.login);
app.get('/login', routes.login);
app.post('/login', routes.verifyLogin);

app.get('/logout', routes.logout);

app.get('/displayDB', routes.displayDB);
app.get('/loadDB', routes.loadDB);
app.get('/saveDB', routes.saveDB);


app.get('/index', routes.index);


app.get('/register', routes.register);
app.post('/register', routes.addUser);
app.get('/displayUser', routes.displayUser);
app.post('/addUser', routes.addUser);
app.post('/changeUser', routes.changeUser);
app.post('/updateUser', routes.updateUser);
app.get('/deleteUser', routes.deleteUser);

//Zone
app.get('/displayZone', routes.displayZone);
app.get('/addZone', routes.addZone);
app.post('/changeZone', routes.changeZone);
app.post('/updateZone', routes.updateZone);
app.post('/insertZone', routes.insertZone);
app.get('/deleteZone', routes.deleteZone);
app.get('/insertZoneFromSelect', routes.insertZoneFromSelect);
//app.post('/insertZoneFromSelect', routes.insertZoneFromSelect);
//ArtefactZone
app.get('/displayArtefactZone', routes.displayArtefactZone);
app.get('/addArtefactZone', routes.addArtefactZone);
app.post('/changeArtefactZone', routes.changeArtefactZone);
app.post('/updateArtefactZone', routes.updateArtefactZone);
app.post('/insertArtefactZone', routes.insertArtefactZone);
app.get('/deleteArtefactZone', routes.deleteArtefactZone);
app.get('/displayArtefactZone', routes.displayArtefactZone);

//nuage
session = null;
app.get('/cloudOfIllustrations', routes.cloudOfIllustrations);
app.post('/cloudOfIllustrations', routes.cloudOfIllustrations);
app.get('/cloudOfIllustrationsResult', routes.cloudOfIllustrationsResult);
app.post('/cloudOfIllustrationsResult', routes.cloudOfIllustrationsResult);
app.get('/cloudOfAnatomies', routes.cloudOfAnatomies);
app.get('/displayImageIllustrationsOfAnatomie', routes.displayImageIllustrationsOfAnatomie);
app.get('/synchronisation', routes.synchronisation);
app.get('/rptPdfMaker', routes.rptPdfMaker);
app.post('/rptPdfMaker', routes.rptPdfMaker);

app.get('/codeImage', routes.codeImage);

//Artefact

//app.post('/changeRecordArtefact', routes.changeRecordArtefact);
app.post('/changeRecord', routes.changeRecord);
app.post('/updateRecord', routes.updateRecord);
app.get('/addRecord', routes.addRecord);
app.post('/insertRecord', routes.insertRecord);
app.get('/deleteArtefact', routes.deleteArtefact);
app.get('/testhtml', routes.testhtml);


app.get('/linkMission', routes.linkMission);
app.post('/addMission', routes.addMission);
app.get('/linkArtefactType', routes.linkArtefactType);
app.post('/addArtefactType', routes.addArtefactType);
app.get('/linkSupport', routes.linkSupport);
app.post('/addSupport', routes.addSupport);
app.get('/linkAnatomy', routes.linkAnatomy);
app.post('/addAnatomy', routes.addAnatomy);

//bao loi khi addlocation
//app.get('/linkLocation', routes.linkLocation);
//app.post('/addLocation', routes.addLocation);

app.get('/manageIllustrations', routes.manageIllustration);
app.post('/addIllustration', routes.addIllustration);
app.post('/insertIllustration', routes.insertIllustration);
app.post('/changeIllustration', routes.changeIllustration);
app.get('/displayIllustration', routes.displayIllustration);
app.get('/displayIllustrationSelection', routes.displayIllustrationSelection);

app.get('/displayIllustrationsForArtefact', routes.displayIllustrationsForArtefact);
app.get('/rptArtefact', routes.rptArtefact);
app.get('/displayImageIllustrations', routes.displayImageIllustrations);
app.post('/addIllustrationToArtefact', routes.addIllustrationToArtefact);
app.post('/linkIllustrationToArtefact', routes.linkIllustrationToArtefact);
//chua khai bao trong index.js
//app.get('/exportArtefactPDF', routes.exportArtefactPDF);

app.get('/testhtml', routes.testhtml);
app.get('/rptImagePDF', routes.rptImagePDF);
app.get('/rptImagePDFhtml', routes.rptImagePDFhtml);

app.get('/rptSummary', routes.rptSummary);
app.get('/indexMesh', routes.indexMesh);

//Recherche
app.get('/queryDB', routes.queryDB);
app.post('/searchDB', routes.searchDB);
app.get('/viewPlaces', routes.viewPlaces);
app.post('/viewPlaces', routes.viewPlaces);
app.get('/viewPlacesRadar', routes.viewPlacesRadar);
app.post('/viewPlacesRadar', routes.viewPlacesRadar);
app.post('/testlag', routes.testlag);
app.get('/testlag', routes.testlag);
/*
var exec = require('child_process').exec;
var sys = require('sys'); */



//executer le fichier .bash pour synchroniquement basses de donnée 
/*function puts(error, stdout, stderr) { sys.puts(stdout) }
//exec("bash creationBase/dbUpdateAnatomyCloudListbd.bash", puts);
exec("bash dbUpdateAnatomyCloudList.bash", puts); */

/*
app.listen(3000, function puts(error, stdout, stderr) { sys.puts(stdout)
 exec("bash dbUpdate.bash", puts);
 console.log("Stage YenHoang123- Serveur actif sur %d, mode %s", app.address().port, app.settings.env);
});*/

//var express = require('express')


    //app.use(express.bodyParser());

   // app.use(express.methodOverride());
    /// call the Router
    //app.use(app.router);

   // app.use(express.static(__dirname + '/public'));






app.listen(3000, function () {
   // console.log('Stage YenHoang123- Serveur actif sur %d, mode %s"'+__dirname);
    console.log("Stage YenHoang123- Serveur actif sur %d, mode %s",  app.get('port'), __dirname);

})

