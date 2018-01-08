
var fs = require('fs');
var SQL = require('sql.js');
var SQLEloquenzior = require('sql.js');
var util = require('util');
var path = require('path');
var db;
var dbEloquenzior;
var DBFile='creationBase/EloquenziorUser.sqlite';
var DBFileEloquenzior='creationBase/Eloquenzior.sqlite';



var sys = require('sys');
var exec = require('child_process').exec;
//executer le fichier .bash pour synchroniquement basses de donnée 
function puts(error, stdout, stderr) { sys.puts(stdout) }
//exec("bash creationBase/dbUpdateAnatomyCloudListbd.bash", puts);
//exec("bash dbUpdateAnatomyCloudList.bash", puts);
exec("bash dbUpdate.bash", puts);

function saveDB() {
//fs.rename(DBFile, DBFile+"_old");
var data=db.export();
var buffer = new Buffer(data);
fs.writeFileSync(DBFile, buffer);
//db.close();
return ('BDD sauvée');
}

function executeSys() {


return ('executeSys !');
}


//--------------------------------------Déclaration de la fonction publique----------------------------------------------------------------

exports.executeSys = executeSys;
exports.saveDB = saveDB;




