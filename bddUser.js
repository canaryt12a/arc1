var fs = require('fs');
var SQL = require('sql.js');
var SQLEloquenzior = require('sql.js');
var util = require('util');
var path = require('path');
//var sqlite3 = require('sqlite3');
var crypto = require('crypto');
var sys = require('sys');
//var exec = require('child_process').exec;
//executer le fichier .bash pour synchroniquement basses de donnée 
//function puts(error, stdout, stderr) { sys.puts(stdout) }
//exec("bash creationBase/dbUpdateAnatomyCloudListbd.bash", puts);
//exec("bash dbUpdateAnatomyCloudList.bash", puts);
//exec("bash dbUpdate.bash", puts);
var db;
var dbEloquenzior;
var DBFile='creationBase/EloquenziorUser.sqlite';
var DBFileEloquenzior='creationBase/Eloquenzior.sqlite';
var defaultMissionId='1'; //mission vide
var defaultFileUpload='public/DATA/Illustrations';




//--------------------Declaration les schémas des table------------------------------------------------------------------------------------ 
var tabFieldsUsers = {
	"fr":{
     'username': 'Nom',
     'password': 'Mot de passe',
     'userRight':'Role',
     'userRightDetail':'Droit de utilisateur'
	},
	"en":{
     'username': 'Name',
     'password': 'Password',
     'userRight':'Right',
     'userRightDetail':'Right Detail'
	},
	"vi":{
     'username': 'Tên đăng nhập',
     'password': 'Mật khẩu',
     'userRight':'Quyền đăng nhập',
     'userRightDetail':'Quyền chi tiết'
	}
}; 

//------------------------------------------------------Base donne-----------------------------------------------------------------------------
function openDB(req, res) {
if (typeof db=="undefined")
{
	var filebuffer = fs.readFileSync(DBFile);
	 console.log("db==undefined")
	db = new SQL.Database(filebuffer);
}
return ("Base EloquenziorUser ouverte");
	filebuffer.dispose();
}

function openDBEloquenzior(req, res) {
if (typeof dbEloquenzior=="undefined")
{      console.log("dbEloquenzior==undefined")
	var filebuffer = fs.readFileSync(DBFileEloquenzior);
	dbEloquenzior = new SQLEloquenzior.Database(filebuffer);
}
return ("Base Eloquenzior ouverte");
//filebuffer.dispose();
}


function saveDB() {
//fs.rename(DBFile, DBFile+"_old");
var data=db.export();
var buffer = new Buffer(data);
fs.writeFileSync(DBFile, buffer);
//db.close();
return ('BDDUser sauvée');
}

//--------------------------------------------------USER----------------------------------------------------------------------------

//retouner schema de table users
function getUsersFields(lang) {
console.log("getUsersFields DB");
var tab = tabFieldsUsers[lang];
console.log("getUsersFields DB"+tab);
return tab;
}

//retouner la liste des users
function getUserList() {
console.log("getUserList DB" +openDB());
var tabSupports = Array();
var stmt = db.prepare("SELECT * FROM users");
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tabSupports[cpt] = row;
	cpt++;
	console.log(row);
}
stmt.free();
return tabSupports;
}

//retouner une utilisateur par son id
function getUser(id) {
console.log("getUser DB" +openDB());
var tabSupports = Array();
//var stmt = db.prepare("SELECT username,userRight FROM users WHERE username=$val1");
//var result = stmt.getAsObject({$val1 : id});

var sql = "SELECT * FROM users WHERE username = '"+id +"'" ;
var stmt = db.prepare(sql);
var result = stmt.getAsObject();

console.log("getUser username: " + id);
console.log("sql " + sql);
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tabSupports[cpt] = row;
	cpt++;
	console.log(row);
}
stmt.free();
console.log("tabSupports : ",tabSupports);
return tabSupports;
}
//supprimer une utilisateur
function deleteUser(values) {
console.log("BDDuser deleteUser ");
console.log("values :"+values);
var sqlString="DELETE FROM users "
sqlString+=" WHERE username='" + values + "'";
sqlString+=" ;";
console.log("requete alterRecord : " + sqlString);
db.run(sqlString);
saveDB();
}
//modifier une utilisateur
////////////new vesion remove res
function alterUser(values) {
console.log("BDDuser alterUser ");
var sqlString="UPDATE users SET ";
//console.log("values :"+values);

var cpt=1;

for (var fieldName in tabFieldsUsers) {
	if ( fieldName != 'username' && (typeof values[fieldName]!=='undefined') ) {
		sqlString += fieldName + "=\'" + values[fieldName] + "\'";
			cpt++;
			if ( cpt <  Object.keys(tabFieldsUsers).length )
				sqlString+= " ,";
	}
}
sqlString=sqlString.trim();
console.log("charAt( sqlString.length-1): " + sqlString.charAt( sqlString.length-1) );
if( sqlString.charAt( sqlString.length-1 ) == ',' )
// supprimer le dernier caractère
sqlString = sqlString.substring(0, sqlString.length - 1)
sqlString+=" WHERE username=\'" + values['username'] + "\'";
sqlString+=" ;";
console.log("requete d alterRecord : " + sqlString);
db.run(sqlString);
saveDB();
}
//ajouter une utilisateur
function insertUser(username, password, userRight) {
console.log("BDD insertLogin, basse ouvert "+openDB());
console.log("db: "+ db);
console.log(username + "  " + password);
var salt='';
// convertir le mot de passe au hachage
var hash = hashPassword(password, salt);
console.log("insertUser hash : " +  hash);
var  sqlString = "INSERT INTO users ";
		sqlString += "(username, password, userRight) ";
		sqlString += "VALUES (";
		sqlString += "\'" + username + "\', ";
		sqlString += "\'" + hash + "\', ";
		sqlString += "\'" + userRight + "\' );";

console.log(sqlString);
db.run(sqlString);
//vérifier le nouvel enregistrement existe déjà
var stmt = db.prepare("SELECT username,userRight FROM users WHERE username=$val1");
var result = stmt.getAsObject({$val1 : username});
console.log("insertUser username: " + result.username);
stmt.free();
saveDB();
if (typeof result.username =='undefined')
{
 console.log("Insert not successfully!");
}
else
{
  console.log("Insert successfully!");
}
return (result.username);
}


//retouner le code crypté
function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256').update(password).digest("hex");
  console.log('hashPassword hash:'+ hash);
 salt =hash;
 //console.log('hashPassword salt:'+ salt);
return hash;

}

//vérifier le nom d'utilisateur et mot de passe existant dans le systeme, retourer le droit de l'utilisateur
function getUserRightEcrypt(username, password) {
console.log("getUserEcrypt: "+ openDB());
var salt='';
// invert password to hash
var hash = hashPassword(password, salt);

var sqlString ='SELECT  username, password, userRight FROM users WHERE username = ';
sqlString += '\'' + username + '\'';
sqlString += 'AND password = \'' + hash + '\'';
console.log("sqlString: "+ sqlString);
var stmt = db.prepare(sqlString);
// Bind values to the parameters and fetch the results of the query
stmt.step();
var result = stmt.getAsObject();
console.log('result:'+result);

if(typeof result.username == 'undefined') {
	console.log("no exist username " + result.username);
	stmt.free();
        return '';
}
console.log("userRight " + result.userRight);
stmt.free();
return result.userRight;
}

//--------------------------------------------------NUAGES----------------------------------------------------------------------------------

//obtenir une liste fréquence d'apparition, nom de anatomies qui apparaissent dans la field anatomy de Artefact

function getAnatomyList() {
console.log("getAnatomyList DB"+ openDB());
//exec('sh creationBase/dbUpdateAnatomyCloudList.bash' )
var tab = Array();
Sqlquery= "SELECT * from AnatomyCloudList ";
console.log(db);
console.log(Sqlquery);
var stmt = db.prepare(Sqlquery);
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tab[cpt] = row;
	cpt++;
}

stmt.free();
return tab;
}

//obtenir une liste des illustrations par une tag 
function getImageIllustrationOfAnatomie(tag) {
console.log("getImageIllustrationOfAnatomie DB" + openDBEloquenzior());
var tab = Array();
var sqlString ="SELECT Artefact.idArtefact, Artefact.numInventaire, Artefact.anatomy, Artefact.description as artDescription, Illustration.idIllustration,  IllustrationData.idIllustrationData, Illustration.description, IllustrationData.name, IllustrationData.dataPath, IllustrationData.isFile, IllustrationData.mimeType, IllustrationType.typeName ";
sqlString +=" FROM Illustration, illustrateArtefact, Artefact, IllustrationData, IllustrationType WHERE Artefact.anatomy like ";
sqlString+= '\'%' + tag + '%\'';
sqlString+=" AND illustrateArtefact.f_idArtefact = Artefact.idArtefact AND  illustrateArtefact.f_idIllust = Illustration.idIllustration AND IllustrationData.idIllustrationData = Illustration.f_idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType ;";

console.log(sqlString);
var stmt = dbEloquenzior.prepare(sqlString);
console.log(db);
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tab[cpt] = row;
	cpt++;
	//console.log("IllustrationForRecord " + _idArtefact + " : [" + cpt + "] " +row);
}

stmt.free();
return tab;

}

function getImageIllustrationOfAnatomieByWhere(_where) {
console.log("getImageIllustrationOfAnatomieByWhere DB" + openDBEloquenzior());
var tab = Array();
var sqlString ="SELECT Artefact.idArtefact, Artefact.numInventaire, Artefact.anatomy, Artefact.description as artDescription, Illustration.idIllustration,  IllustrationData.idIllustrationData, Illustration.description, IllustrationData.name, IllustrationData.dataPath, IllustrationData.isFile, IllustrationData.mimeType, IllustrationType.typeName ";
sqlString+=" FROM Illustration, illustrateArtefact, Artefact, IllustrationData, IllustrationType "+ _where;
sqlString+=" AND illustrateArtefact.f_idArtefact = Artefact.idArtefact AND  illustrateArtefact.f_idIllust = Illustration.idIllustration AND IllustrationData.idIllustrationData = Illustration.f_idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType ;";

console.log(sqlString);
var stmt = dbEloquenzior.prepare(sqlString);
console.log(db);
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tab[cpt] = row;
	cpt++;
	//console.log("IllustrationForRecord " + _idArtefact + " : [" + cpt + "] " +row);
}

stmt.free();
return tab;

}

//--------------------------------------Déclaration de la fonction publique----------------------------------------------------------------
exports.openDB = openDB;
exports.openDBEloquenzior = openDBEloquenzior;
exports.saveDB = saveDB;
exports.getUsersFields=getUsersFields;
exports.getUserList =getUserList;
exports.getUser =getUser;
exports.insertUser = insertUser;
exports.getUserRightEcrypt = getUserRightEcrypt;
exports.hashPassword = hashPassword;
exports.getAnatomyList = getAnatomyList;
exports.getImageIllustrationOfAnatomie = getImageIllustrationOfAnatomie;
exports.getImageIllustrationOfAnatomieByWhere = getImageIllustrationOfAnatomieByWhere;
exports.alterUser = alterUser;
exports.deleteUser = deleteUser;



