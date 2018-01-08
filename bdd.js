var fs = require('fs');
var SQL = require('sql.js');
var util = require('util');
var path = require('path');
var crypto = require('crypto');
var db;
var DBFile='creationBase/Eloquenzior.sqlite';
var defaultMissionId='1'; //mission vide
var defaultFileUpload='public/DATA/Illustrations';
var sqlite3 = require('sqlite3');
var dbFts = new sqlite3.Database(DBFile)
var lang = "vi";
var tabFieldsArtefact={
	'idArtefact':'Identifiant',
	'numInventaire':'Numéro inventaire',
	'numAutre':'Autre numéro',
	'description':'Description',
	'anatomy':'Anatomie',
	'f_idType': 'type d\'artefact',
	'f_idSupport': 'support',
	'f_idOrientedAnatomy': 'Id direction anatomie',
	'f_idLocation' : 'Lieu de stockage',
	'f_idSubLocation' : 'Lieu alternatif',
	'height':'hauteur',
	'width':'largeur',
	'depth':'profondeur',
	'unit':'unité',
	'f_idMission' : 'Mission'
};


var tabFieldsArtefactLang={
	"fr":{
	'idArtefact':'Identifiant',
	'numInventaire':'Numéro inventaire',
	'numAutre':'Autre numéro',
	'description':'Description',
	'anatomy':'Anatomie',
	'f_idType': 'type d\'artefact',
	'f_idSupport': 'support',
	'f_idOrientedAnatomy': 'Id direction anatomie',
	'f_idLocation' : 'Lieu de stockage',
	'f_idSubLocation' : 'Lieu alternatif',
	'height':'hauteur',
	'width':'largeur',
	'depth':'profondeur',
	'unit':'unité',
	'f_idMission' : 'Mission'},
	"en":{
	'idArtefact':'Identify',
	'numInventaire':'Inventory number',
	'numAutre':'Another Number',
	'description':'Description',
	'anatomy':'Anatomy',
	'f_idType': 'Type',
	'f_idSupport': 'Support',
	'f_idOrientedAnatomy': 'Id direction',
	'f_idLocation' : 'Storage',
	'f_idSubLocation' : 'Alternative place',
	'height':'height',
	'width':'width',
	'depth':'depth',
	'unit':'unit',
	'f_idMission' : 'Mission'},
	"vi":{
	'idArtefact':'Id',
	'numInventaire':'Số lưu trữ',
	'numAutre':'Số khác',
	'description':'Mô tả',
	'anatomy':'Hiện vật',
	'f_idType': 'Kiểu',
	'f_idSupport': 'Hỗ trợ',
	'f_idOrientedAnatomy': 'Mã hướng',
	'f_idLocation' : 'Kho',
	'f_idSubLocation' : 'Nơi khác',
	'height':'Cao',
	'width':'Rộng',
	'depth':'Sâu',
	'unit':'Đơn vị đo',
	'f_idMission' : 'Trạng thái'}
};


var tabFieldsReportArtefactLang={
	"fr":{
	'title': 'Eloquenzior',	
	'summary': 'Sommaire',	
	'artefact': 'Artefact',
	'element': 'Élement',
	'illustration': 'Illustrations',
	'exportDate': 'Date exportation',		
	'idArtefact':'Identifiant',
	'numInventaire':'Numéro inventaire',
	'numAutre':'Autre numéro',
	'description':'Description',
	'anatomy':'Anatomie',
	'f_idType': 'type d\'artefact',
	'f_idSupport': 'support',
	'f_idOrientedAnatomy': 'Id direction anatomie',
	'f_idLocation' : 'Lieu de stockage',
	'f_idSubLocation' : 'Lieu alternatif',
	'height':'hauteur',
	'width':'largeur',
	'depth':'profondeur',
	'unit':'unité',
	'f_idMission' : 'Mission'},
	"en":{
	'idArtefact':'Identify',
	'numInventaire':'Inventory number',
	'numAutre':'Another Number',
	'description':'Description',
	'anatomy':'Anatomy',
	'f_idType': 'Type',
	'f_idSupport': 'Support',
	'f_idOrientedAnatomy': 'Id direction',
	'f_idLocation' : 'Storage',
	'f_idSubLocation' : 'Alternative place',
	'height':'height',
	'width':'width',
	'depth':'depth',
	'unit':'unit',
	'f_idMission' : 'Mission'},
	"vi":{
	'idArtefact':'Id',
	'numInventaire':'Số lưu trữ',
	'numAutre':'Số khác',
	'description':'Mô tả',
	'anatomy':'Hiện vật',
	'f_idType': 'Kiểu',
	'f_idSupport': 'Hỗ trợ',
	'f_idOrientedAnatomy': 'Mã hướng',
	'f_idLocation' : 'Kho',
	'f_idSubLocation' : 'Nơi khác',
	'height':'Cao',
	'width':'Rộng',
	'depth':'Sâu',
	'unit':'Đơn vị đo',
	'f_idMission' : 'Trạng thái'}
};

var tabMultiLang={
  "idArtefact": {
    "en": "Identify",
    "fr": "Identifiant",
	"vi": "Id Hien Vat"
  },
  "numInventaire": {
    "en": "Inventory number",
    "fr": "Numéro inventaire",
	"vi": "Số trong kho",
  }
};
var tabFieldsMission={
	'idMission':'Identifiant',
	'date':'Date',
	'lieu':'Lieu',
	'responsable':'Responsable',
};

var tabFieldsFullView={
	'idArtefact':'Identifiant',
	'numInventaire':'Numéro inventaire',
	'autreInventaire':'Autre numéro',
	'description':'Description',
	'anatomy':'Anatomie',
	'support':'Support',
	'notesSupport':'Commentaires support',
	'type':'Type artefact',
	'stockage':'Lieu de stockage',
	'emplacement':'Emplacement',
	'referenceEmplacement':'Emplacement2',
	'height':'hauteur',
	'width':'largeur',
	'depth':'profondeur',
	'unit':'unité',
	'date':'Mission - Date',
	'lieu':'Mission - Lieu',
	'responsable':'Mission - Resp.'
};

var tabFieldsIllustrationView = {
	"fr":{
	'idIllustration': 'Identifiant',
	'description': 'Description',
	'name': 'Nom',
	'DataPath': 'Chemin',
	'isFile' : 'Fichier',
	'typeName' : 'Type',
	'mimeType' : 'mimeType'
	},
	"en":{
	'idIllustration': 'Id',
	'description': 'Description',
	'name': 'Name',
	'DataPath': 'File Path',
	'isFile' : 'is File',
	'typeName' : 'Type',
	'mimeType' : 'mime Type'
		},
	"vi":{
	'idIllustration': 'Khóa',
	'description': 'Mô tả',
	'name': 'Tên',
	'DataPath': 'Đường dẫn',
	'isFile' : 'Là file',
	'typeName' : 'Kiểu',
	'mimeType' : 'Loại dữ liệu'
	}
};

var tabFieldsArtefactType = {
	'idType' : 'Identifiant',
	'typeName' : 'Nom'
};

var tabFieldsSupport = {
	'idSupport' : 'Identifiant',
	'name' : 'Nom',
	'comment' : 'Commentaire'
};

var tabFieldsIllustration = {
	'idIllustration': 'Identifiant',
	'description' : 'Description',
	'f_idIllustrationType' : 'IdType',
	'f_idIllustrationData' : 'IdDonnées'
};

var tabFieldsZone = {
	'idZone': 'Identifiant',
	'name' : 'Nom',
	'coordonnees' : 'Coordonneés',
	'commentaire' : 'Commentaire'
};

var tabFieldsArtefactZoneView = {
	'idArtefactZone': 'Selection ID',
	'f_idArtefact': 'id Artefact',
	'f_idZone': 'id zone',
	'zoneName': 'Nom de zone',
	'coordonnees': 'Coordonnées',
	'commentaire': 'Commentaire',
};


var tabFieldsArtefactZone = {
	'idArtefactZone': 'Identifiant',
	'f_idArtefact': 'id Artefact',
	'f_idZone': 'id zone',
	};


/*function openDB(req, res) {
var filebuffer = fs.readFileSync(DBFile);
// Load the db
db = new SQL.Database(filebuffer);

//console.log("OpenDB ok");
return ("Base ouverte");
}*/

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

function getDB(req, res) {
if (typeof db=="undefined")
{
	var filebuffer = fs.readFileSync(DBFile);
	 console.log("db==undefined")
	db = new SQL.Database(filebuffer);
}
return db;
}

function insertMission(values) {
console.log("BDD insertMission ");

var sqlString='INSERT INTO Mission (';

var cpt=1;

for (var fieldName in tabFieldsMission) {
	if ( fieldName != 'idMission' ) {
		sqlString += fieldName;
		cpt++;
		if ( cpt <  Object.keys(tabFieldsMission).length )
				sqlString += ', ';
	}
}
sqlString+=') VALUES (';

cpt=1;

for (var fieldName in tabFieldsMission) {
	if ( fieldName != 'idMission' ) {
		sqlString += '\'' + values[fieldName] + '\'';
			cpt++;
			if ( cpt <  Object.keys(tabFieldsMission).length )
				sqlString += ', ';
	}
}

sqlString+=');';

console.log("requete d insertMission : "+sqlString);

db.run(sqlString);

sqlString='SELECT idMission FROM Mission WHERE ';
cpt=1;

for (var fieldName in tabFieldsMission) {
	if ( fieldName != 'idMission' ) {
		sqlString += fieldName+' = '+'\'' + values[fieldName] + '\'';
			cpt++;
			if ( cpt <  Object.keys(tabFieldsMission).length )
				sqlString += ' AND ';
	}
}

sqlString+=';';

var stmt = db.prepare(sqlString);
stmt.step();
var row = stmt.getAsObject();
var result = row.idMission;

console.log("idMission insérée "+result);
stmt.free();
return(result);
}

function alterMission(_idArtefact, _idMission) {
console.log("BDD alterMission ");
var sqlString='UPDATE Artefact SET f_idMission =';
sqlString+='\'' + _idMission + '\' ';
sqlString+=' WHERE idArtefact=\'' + _idArtefact + '\'';
sqlString+=' ;';

console.log("requete d alterMission : "+sqlString);
db.run(sqlString);

return('Modification de la mission effectuée');
}

//----------------------------------------------Region Artefact---------------------------------------------------------

function insertRecord(values) {
console.log("BDD insertRecord ");
console.log(values);
var sqlString='INSERT INTO Artefact (';
var cpt=1;
var sqlStringValue = ' VALUES (';
for (var fieldName in tabFieldsArtefact) {
	if ( fieldName != 'idArtefact' && (typeof values[fieldName]!=='undefined') ) {
		sqlString += fieldName + " ,"
		sqlStringValue +=  '\'' + values[fieldName] + '\' ,';
		cpt++;
	}
}
sqlString = sqlString.substring(0, sqlString.length - 1)
sqlString +=")";
console.log("requete d sqlString1 : "+sqlString);
sqlStringValue = sqlStringValue.substring(0, sqlStringValue.length - 1)
sqlStringValue +=");";
sqlString += sqlStringValue;
db.run(sqlString);
saveDB();

openDB();
console.log("values['idArtefact']: "+values['idArtefact']);
console.log("requete d sqlString : "+sqlString);

//var stmt = db.prepare("SELECT * FROM Artefact WHERE idArtefact=$val1");
//var result = stmt.getAsObject({$val1 : values['idArtefact']});
var stmt = db.prepare("select last_insert_rowid() as last_id;");
var result = stmt.getAsObject();


stmt.free();
if (typeof result =='undefined')
{
 	console.log("Insert id="+result.last_id+" not successfully!");
	console.log("Insert result=" +result+ " not successfully!");
}
else
{
 	 console.log("Insert id="+result.last_id+" successfully!");
	console.log("Insert id="+result+" successfully!");
	console.log("Insert result="+result[1]+" successfully!");
        console.log("Insert result.length="+result.length+" successfully!");
}
return ('Requête d\'ajout d\'enregistrement exécutée');
}

function alterRecord(values, id) {
console.log("BDD alterRecord ");
var sqlString="UPDATE Artefact SET ";
console.log(values);

var cpt=1;

for (var fieldName in tabFieldsArtefact) {
	if ( fieldName != 'idArtefact' ) {
		sqlString += fieldName + "=\'" + values[fieldName] + "\'";
			cpt++;
			if ( cpt <  Object.keys(tabFieldsArtefact).length )
				sqlString+= " ,";
	}
}
sqlString=sqlString.trim();
if( sqlString.charAt( sqlString.length-1 ) == ',' )
// supprimer le dernier caractère
sqlString = sqlString.substring(0, sqlString.length - 1)
sqlString+=" WHERE idArtefact=\'" + id + "\'";
sqlString+=" ;";
console.log("requete d alterRecord : " + sqlString);
db.run(sqlString);
saveDB();
}

function getRecord(_id) {
console.log("BDD get Record : selectionné = "+_id);

var stmt = db.prepare("SELECT * FROM Artefact WHERE idArtefact=:id");
var row=stmt.getAsObject({':id':_id});

//console.log("Row in GetRecord\n"+row);
return row;
stmt.free();
}

function displayDB(req, res) {
console.log("Display DB");
openDB();
var stmt = db.prepare("SELECT * FROM completeArtefactView");


var artefactsTable = Array();

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	artefactsTable[cpt] = row;
	cpt++;
	//console.log(row);
}

console.log("displayDB : "+cpt+ " artefacts chargés");
stmt.free();
return(artefactsTable);
}


function display(){
alert("display");
}


function getArtefactView(_id) {
openDB();
console.log("BDD get Record : selectionné = "+_id);
var stmt = db.prepare("SELECT * FROM completeArtefactView WHERE idArtefact=:id");
var row=stmt.getAsObject({':id':_id});
return row;
stmt.free();
}



function getArtefactViewArray(_idArtefact) {
console.log("getArtefactView DB");

var tab = Array();
var sqlString ="SELECT idArtefact, numeroInventaire, autreInventaire, description, anatomy, support, notesSupport, type, stockage ,emplacement,date,lieu";
sqlString +=" FROM completeArtefactView where idArtefact = ";
sqlString+= '\'' + _idArtefact + '\'';

console.log(sqlString);
var stmt = db.prepare(sqlString);

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tab[cpt] = row;
	cpt++;
}

stmt.free();
return tab;

}

//supprimer une Artefact
function deleteArtefact(values) {
console.log("BDD deleteArtefact ");
console.log("values :"+values);
var sqlString="DELETE FROM Artefact "
sqlString+=" WHERE idArtefact='" + values + "'";
sqlString+=" ;";
console.log("requete alterRecord : " + sqlString);
db.run(sqlString);
saveDB();
}

//----------------------------------------------------------------------------------------------------------------

function saveDB() {
//fs.rename(DBFile, DBFile+"_old");
var data=db.export();
var buffer = new Buffer(data);
fs.writeFileSync(DBFile, buffer);
//db.close();
return ('BDD sauvée');
}

function getMissionList() {
console.log("getMissionList DB");

var tabMissions = Array();

var stmt = db.prepare("SELECT * FROM Mission");

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tabMissions[cpt] = row;
	cpt++;
}

stmt.free();
return tabMissions;

}

function getArtefactTypesList() {
console.log("getArtefactTypesList DB");

var tabArtefactType = Array();

var stmt = db.prepare("SELECT * FROM ArtefactType");

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tabArtefactType[cpt] = row;
	cpt++;
	//console.log(row);
}

stmt.free();
return tabArtefactType;
}

function getSupportList() {
console.log("getSupportList DB");

var tabSupports = Array();

var stmt = db.prepare("SELECT * FROM Support");

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tabSupports[cpt] = row;
	cpt++;
	//console.log(row);
}

stmt.free();
return tabSupports;
}

/// get login user

function getUserList() {
console.log("getUserList DB");
var tabSupports = Array();
var stmt = db.prepare("SELECT * FROM Username");
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


function checkUser(username, password) {

var filebuffer = fs.readFileSync(DBFile);
// Load the db
db = new SQL.Database(filebuffer);

console.log("DBFile: "+ DBFile);
console.log("filebuffter: "+ filebuffer);
console.log("db: "+ db);



var tabSupports = Array();



var sqlString ="SELECT * FROM Username WHERE ";
if (username != '') {
	//isTaken=true;
	sqlString += " username=" + "'" + params['username'] + "'";
}
if (password != "") {
	if (isTaken == true)
		sqlString += " AND ";
	else
	//	isTaken=true;
	sqlString += "password=" + "'" + params['password'] + "'";
}



sqlString += " ;";

console.log("searchDB SQL string -> " + sqlString);
var stmt = db.prepare(sqlString);

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

function getAnatomyList() {
console.log("getAnatomyList DB");

var tab = Array();

var stmt = db.prepare("SELECT * FROM Anatomy");

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tab[cpt] = row;
	cpt++;
	//console.log(row);
}

stmt.free();
return tab;
}

function getIllustrationList() {
console.log("getIllustration DB");

var tab = Array();

var stmt = db.prepare("SELECT * FROM Illustration");

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tab[cpt] = row;
	cpt++;
	//console.log(row);
}

stmt.free();
return tab;
}




function getArtefactFields(lang) {
console.log("getArtefactFields DB");
var tab = tabFieldsArtefactLang[lang];
//tab = tabFieldsArtefact;
return tab;
}

function getArtefactReportFields(lang) {
console.log("getArtefactReportFields DB");
var tab = tabFieldsReportArtefactLang[lang];
//tab = tabFieldsArtefact;
return tab;
}

function getArtefactTypeFields() {
console.log("getArtefactTypeFields DB");
var tab = tabFieldsArtefactType;
return tab;
}

function getSupportFields() {
console.log("getArtefactSupport DB");
var tab = tabFieldsSupport;
return tab;
}

function getFullViewFields() {
var tab = tabFieldsFullView;
return tab;
}

function getZoneFields() {
var tab = tabFieldsZone;
return tab;
}

function getArtefactZoneFields() {
var tab = tabFieldsArtefactZone;
return tab;
}

function getArtefactZoneViewFields() {
var tab = tabFieldsArtefactZoneView;
return tab;
}



function getMissionFields() {
var tab = tabFieldsMission;
return tab;
}


function getLocationList() {
console.log("getLocationList DB");
var tabLocations = Array();
var stmt = db.prepare("SELECT * FROM Location");
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tabLocations[cpt] = row;
	cpt++;
}

stmt.free();
return tabLocations;
}

function getIllustrationsView(req, res) {
console.log("display getIllustrationsView DB");
openDB();
var stmt = db.prepare("SELECT *, '' as imageData FROM completeIllustrationView order by typeName");
var illustrationsTable = Array();
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	illustrationsTable[cpt] = row;
	cpt++;
	//console.log(row);
}

stmt.free();
return(illustrationsTable);
}



function getIllustrationsArtefactView(req, res) {
console.log("display Illustration DB");

/*CREATE VIEW IllustrationsArtefactView AS SELECT   illustrateArtefact.f_idArtefact as  idArtefact,   Illustration.idIllustration, Illustration.description, IllustrationData.name, IllustrationData.DataPath, IllustrationData.isFile,  IllustrationType.typeName, IllustrationData.mimeType, illustrateArtefact.f_idArtefact as  idArtefact 
 FROM Illustration, IllustrationData, IllustrationType , illustrateArtefact  WHERE Illustration.f_idIllustrationDATA=idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType AND illustrateArtefact.f_idIllust  =  Illustration.idIllustration 
Order by  illustrateArtefact.f_idArtefact,  Illustration.idIllustration;

CREATE VIEW IllustrationsArtefactView AS SELECT   illustrateArtefact.f_idArtefact as  idArtefact,   Illustration.idIllustration, Illustration.description, IllustrationData.name, IllustrationData.DataPath, IllustrationData.isFile,  IllustrationType.typeName, IllustrationData.mimeType, illustrateArtefact.f_idArtefact as  idArtefact 
 FROM Illustration, IllustrationData, IllustrationType , illustrateArtefact , Artefact  WHERE Illustration.f_idIllustrationDATA=idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType AND illustrateArtefact.f_idIllust  =  Illustration.idIllustration 
AND   illustrateArtefact.f_idArtefact = Artefact.idArtefact
Order by  illustrateArtefact.f_idArtefact,  Illustration.idIllustration;
CREATE VIEW completeIllustrationView AS SELECT    Illustration.idIllustration, Illustration.description, IllustrationData.name, IllustrationData.DataPath, IllustrationData.isFile,  IllustrationType.typeName, IllustrationData.mimeType
 FROM Illustration, IllustrationData, IllustrationType   WHERE Illustration.f_idIllustrationDATA=idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType;

//DROP VIEW completeIllustrationView ; 
CREATE VIEW completeIllustrationView AS SELECT   illustrateArtefact.f_idArtefact as  idArtefact,   Illustration.idIllustration, Illustration.description, IllustrationData.name, IllustrationData.DataPath, IllustrationData.isFile,  IllustrationType.typeName, IllustrationData.mimeType, illustrateArtefact.f_idArtefact as  idArtefact 
FROM Illustration, IllustrationData, IllustrationType , illustrateArtefact  WHERE Illustration.f_idIllustrationDATA=idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType AND illustrateArtefact.f_idIllust  =  Illustration.idIllustration 
Order by  illustrateArtefact.f_idArtefact,  Illustration.idIllustration;

*/

var stmt = db.prepare("SELECT * FROM IllustrationsArtefactView order by idArtefact, typeName");
var illustrationsTable = Array();
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	illustrationsTable[cpt] = row;
	cpt++;
	//console.log(row);
}

stmt.free();
return(illustrationsTable);
}


function getIllustrationsArtefactViewForExportPdf (req, res) {
console.log("display IllustrationsArtefactViewForExportPdf  DB");
var stmt = db.prepare("SELECT * FROM IllustrationsArtefactViewForExportPdf order by idArtefact, typeName");
var illustrationsTable = Array();
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	illustrationsTable[cpt] = row;
	cpt++;
	//console.log(row);
}
stmt.free();
return(illustrationsTable);
}

function getIllustrationViewFields(lang) {
console.log("lang="+lang);
var tab = tabFieldsIllustrationView[lang];
return tab;
console.log("getIllustrationViewFields="+tab);
}


function insertIllustration(values) {
console.log("BDD insertIllustration ");

console.log(values);

//insertion de la description dans la base
/*entrée de values :
 *description: req.body.description,
	name: req.body.nom,
	isFile: true,
	typeName: req.body.idTypeSelected,
	illustrationPath: req.files.fileIllustration.path,
	illustrationType: req.files.fileIllustration.type,
	illustrationName: req.files.fileIllustration.name,
	illustrationSize: req.files.fileIllustration.size
 * description -> Illustration.description,
 * name, path, isFile -> IllustrationData
 * typeName from IllustrationType
*/

//creation d'une ligne vide dans Illustration
db.run('INSERT INTO IllustrationData(name) VALUES (\'LASTINSERT\')');
var stmt = db.prepare("SELECT idIllustrationData, name FROM IllustrationData WHERE name=\'LASTINSERT\'");

// Bind values to the parameters and fetch the results of the query
stmt.step();
var result = stmt.getAsObject();
console.log("Selection Id Dernier " + result.idIllustrationData);

//requete idIllustration
var newIdIllustrationData = result.idIllustrationData;

//répertoire idIllustration
var illustrationPath = defaultFileUpload + "/" + newIdIllustrationData;
var filename = values.name;

var tmpPath = values.illustrationPath;
console.log("fichier temporaire " + tmpPath);

var newPath = illustrationPath + "/" + filename + path.extname(values.illustrationName);
console.log ("newPath " + newPath);

fs.mkdir(illustrationPath,function(err){
	if(err)
		console.log("Erreur à la création du rép. " + illustrationPath +" -> " +err);
	else {
		console.log("ok Création du rép. " + illustrationPath);

		//copie du fichier dans le rép Upload
		var readStream = fs.createReadStream(tmpPath)
		var writeStream = fs.createWriteStream(newPath);
		util.pump(readStream, writeStream, function() {
			fs.unlinkSync(tmpPath);
		});

		//Insertion dans IllustrationData
		var sqlString = "UPDATE IllustrationData SET ";
		sqlString += " name = \'" + values.name + "\', ";
		sqlString += "dataPath = \'" + newPath + "\', ";
		sqlString += "isFile = \'" + values.isFile + "\', ";
		sqlString += "mimeType = \'" + values.illustrationType + "\' "
		sqlString += "WHERE idIllustrationData = \'" + newIdIllustrationData + "\'";
		sqlString += " ;";

		console.log("Update de IllustrationData "+ sqlString);
		db.run(sqlString);

		//Insertion de l'enregistrement dans la table Illustration
		sqlString = "INSERT INTO Illustration ";
		sqlString += "(description, f_idIllustrationType, f_idIllustrationData) ";
		sqlString += "VALUES (";
		sqlString += "\'" + values.description + "\', ";
		sqlString += "\'" + values.typeName + "\', ";
		sqlString += "\'" + newIdIllustrationData + "\' );";

		console.log("INSERT de Illustration "+ sqlString);
		db.run(sqlString);
	}
});

return('Requête d\'ajout d\'illustration exécutée');
}

function insertArtefactType(values) {
console.log("BDD insertArtefactType ");

//creation d'une ligne vide dans Illustration
var sqlString ='INSERT INTO ArtefactType(typeName) VALUES';
sqlString += '(\'' + values + '\')';

db.run(sqlString);

sqlString ='SELECT idType, typeName FROM ArtefactType WHERE typeName=';
sqlString += '\'' + values + '\'';

var stmt = db.prepare(sqlString);

// Bind values to the parameters and fetch the results of the query
stmt.step();
var result = stmt.getAsObject();
console.log("Selection Id Dernier " + result.idType);
saveDB();
stmt.free();
return (result.idType);
}

function getIllustrationTypes() {
console.log("getIllustrationTypes DB");

var tab = Array();

var stmt = db.prepare("SELECT * FROM IllustrationType");

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tab[cpt] = row;
	cpt++;
}

stmt.free();
return tab;

}

function getIllustrationData() {
console.log("getIllustrationData DB");

var tab = Array();

var stmt = db.prepare("SELECT * FROM IllustrationData");

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	tab[cpt] = row;
	cpt++;
}

stmt.free();
return tab;

}
//obtenir des éléments du base de donné
//note
function getIllustrationForArtefact(_idArtefact) {
console.log("getIllustrationForArtefact DB");

var tab = Array();

var sqlString ="SELECT Artefact.idArtefact, Illustration.idIllustration,  IllustrationData.idIllustrationData, Illustration.description, IllustrationData.name, IllustrationData.dataPath, IllustrationData.isFile, IllustrationData.mimeType, IllustrationType.typeName ";
sqlString +=" FROM Illustration, illustrateArtefact, Artefact, IllustrationData, IllustrationType WHERE Artefact.idArtefact= ";
sqlString+= '\'' + _idArtefact + '\'';
sqlString+=" AND illustrateArtefact.f_idArtefact = Artefact.idArtefact AND  illustrateArtefact.f_idIllust = Illustration.idIllustration AND IllustrationData.idIllustrationData = Illustration.f_idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType ;";

console.log(sqlString);
var stmt = db.prepare(sqlString);

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


//obtenir des éléments du base de donné
function getIllustrationByID(_id) {
console.log("getIllustrationForArtefact DB");

var tab = Array();

var sqlString ="SELECT Artefact.idArtefact, Illustration.idIllustration,  IllustrationData.idIllustrationData, Illustration.description, IllustrationData.name, IllustrationData.dataPath, IllustrationData.isFile, IllustrationData.mimeType, IllustrationType.typeName ";
sqlString +=" FROM Illustration, illustrateArtefact, Artefact, IllustrationData, IllustrationType WHERE Illustration.idIllustration= ";
sqlString+= '\'' + _id + '\'';
sqlString+=" AND illustrateArtefact.f_idArtefact = Artefact.idArtefact AND  illustrateArtefact.f_idIllust = Illustration.idIllustration AND IllustrationData.idIllustrationData = Illustration.f_idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType ;";

console.log(sqlString);
var stmt = db.prepare(sqlString);

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


//obtenir des éléments du base de donné
function getAllImageIllustration() {

console.log("getAllImageIllustration DB" + openDB());

var tab = Array();

var sqlString ="SELECT Artefact.numInventaire, Artefact.idArtefact, Illustration.idIllustration,  IllustrationData.idIllustrationData, Illustration.description, IllustrationData.name, IllustrationData.dataPath, IllustrationData.isFile, IllustrationData.mimeType, IllustrationType.typeName ";
sqlString +=" FROM Illustration, illustrateArtefact, Artefact, IllustrationData, IllustrationType WHERE   illustrateArtefact.f_idArtefact = Artefact.idArtefact AND  illustrateArtefact.f_idIllust = Illustration.idIllustration AND IllustrationData.idIllustrationData = Illustration.f_idIllustrationData AND Illustration.f_idIllustrationType = IllustrationType.idType ;";

console.log(sqlString);
var stmt = db.prepare(sqlString);

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

//obtenir des éléments des images group par Artefact

function getAllImageIllustrationGroupByArtefact() {

console.log("getAllImageIllustrationGroupByArtefact DB" + openDB());

var tab = Array();

var sqlString = "SELECT x.name , x.dataPath, x.mimeType, x.idIllustrationData,x.isFile, 'picture' as typeName ";
sqlString += " FROM IllustrationData x ";
sqlString +=" JOIN (SELECT p.f_idIllustrationData ,p1.f_idArtefact FROM Illustration p, illustrateArtefact p1  on p.idIllustration= p1.f_idIllust  and p.f_idIllustrationType = 1 GROUP BY p1.f_idArtefact ) y ";
sqlString +=" ON y.f_idIllustrationData = x.idIllustrationData ";

/*
var sqlString = "SELECT x.name , x.dataPath, x.mimeType, x.idIllustrationData,x.isFile, 'picture' as typeName ";
sqlString += " FROM IllustrationData x WHERE x.idIllustration IN ";
sqlString +="  (SELECT p.f_idIllustrationData  FROM Illustration p, illustrateArtefact p1  on p.idIllustration= p1.f_idIllust  and p.f_idIllustrationType = 1 GROUP BY p1.f_idArtefact )  ";
*/
console.log(sqlString);
var stmt = db.prepare(sqlString);
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


function alterArtefactType(_idArtefact, idArtefactType) {
console.log("alterArtefactType DB");

var sqlString='UPDATE Artefact SET f_idType =';
sqlString+='\'' + idArtefactType + '\' ';
sqlString+=' WHERE idArtefact=\'' + _idArtefact + '\'';
sqlString+=' ;';

console.log("alterArtefactType " + sqlString);
db.run(sqlString);
saveDB();

return('Modification du type d\'artefact effectuée');
}

function insertSupport(idSupportName, idSupportComment) {
console.log("BDD insertSupport ");

console.log(idSupportName + "  " + idSupportComment);

//creation d'une ligne vide dans Illustration
var sqlString ='INSERT INTO Support(name, comment) VALUES';
sqlString += '(\'' + idSupportName + '\', ';
sqlString += '\'' + idSupportComment + '\')';

db.run(sqlString);
console.log ("sqlString insertSupport: "+sqlString);
sqlString ='SELECT idSupport, name FROM Support WHERE ';
sqlString += 'name = \'' + idSupportName + '\' ';
sqlString += 'AND comment = \'' + idSupportName + '\'';


var stmt = db.prepare(sqlString);

// Bind values to the parameters and fetch the results of the query
stmt.step();
var result = stmt.getAsObject();

//console.log("Selection Id Dernier " + result.idSupport);
saveDB();
stmt.free();
return (result.idSupport);
}


function alterSupport(_idArtefact, idSupport) {
console.log("alterSupport DB");

var sqlString='UPDATE Artefact SET f_idSupport =';
sqlString+='\'' + idSupport + '\' ';
sqlString+=' WHERE idArtefact=\'' + _idArtefact + '\'';
sqlString+=' ;';

console.log("alterSupport " + sqlString);
db.run(sqlString);
saveDB();
return('Modification du support d\'artefact effectuée');
}

function insertAnatomy(idAnatomyName, idAnatomyType, idAnatomyParent) {
console.log("BDD insertAnatomy ");
var sqlString ='INSERT INTO Anatomy(name, type, parent) VALUES';
sqlString += '(\'' + idAnatomyName + '\', ';
sqlString += '\'' + idAnatomyType + '\', ';
sqlString += '\'' + idAnatomyParent + '\')';

db.run(sqlString);

sqlString ='SELECT idAnatomy, name FROM Anatomy WHERE ';
sqlString += 'name = \'' + idAnatomyName + '\' ';
sqlString += 'AND type = \'' + idAnatomyType + '\' ';
sqlString += 'AND parent = \'' + idAnatomyParent + '\'';

var stmt = db.prepare(sqlString);

// Bind values to the parameters and fetch the results of the query
stmt.step();
var result = stmt.getAsObject();

//console.log("Selection Id Dernier " + result.idAnatomy);
saveDB();
stmt.free();
return (result.idAnatomy);
}

function alterAnatomy(_idArtefact, idAnatomy) {
console.log("alterAnatomy DB");

var sqlString='UPDATE Artefact SET f_idOrientedAnatomy =';
sqlString+='\'' + idAnatomy + '\' ';
sqlString+=' WHERE idArtefact=\'' + _idArtefact + '\'';
sqlString+=' ;';

console.log("alterAnatomy " + sqlString);
db.run(sqlString);
saveDB();
return('Modification de la représentation anatomique effectuée');
}

function linkIllustrationToArtefact(_idArtefact, _idIllustration) {
console.log("linkIllustrationToArtefact DB: " + _idArtefact+ "/" + _idIllustration);

var sqlString = 'INSERT INTO IllustrateArtefact(f_idArtefact, f_idIllust) VALUES ('
sqlString += '\'' + _idArtefact + '\', ';
sqlString += '\'' + _idIllustration + '\' ) ;';


console.log("linkIllustrationToArtefact " + sqlString);
db.run(sqlString);

return('Liaison effectuée');
}


function searchDB (params) {
console.log("search DB: " + params);

console.log("search DB element: " + params[0]+","+params[1]+","+params[2]+","+params[3]+","+params[4] );
console.log("search DB Anotomy: "+params["Anotomy"]);
console.log("select.Anotomy: "+params["select.Anotomy"]);
var isTaken=false;

var sqlString ="SELECT * FROM completeArtefactView WHERE 1=1 ";
if (params['numInventaire'] != '') {
	isTaken=true;
	sqlString += " AND ";
	sqlString += " numeroInventaire=" + "'" + params['numInventaire'] + "'";
}
if (params['description'] != "") {
	sqlString += " AND ";
	sqlString += "description like " + "'%" + params['description'] + "%'";
	//sqlString+= '\'%' + tag + '%\'';
}
if (params['Anatomy'] != "") {
	sqlString += " AND ";
	sqlString += "anatomy like " + "'%" + params['Anatomy'] + "%'";
	//sqlString+= '\'%' + tag + '%\'';
}

if (params['allField'] != "") {
	sqlString += " AND idArtefact in  ( ";
	sqlString += " SELECT idArtefact FROM fts3CompleteArtefactView WHERE fts3CompleteArtefactView MATCH  " + "'" + params['allField'] + "')";
	
} 


if (params['idSupport']) {
	sqlString += " AND ";
	sqlString += "support = (SELECT name FROM Support WHERE Support.idSupport = " + "'" + params['idSupport'] + "')";
}
if (params['idLocation']) {
	sqlString += " AND ";
	sqlString += "stockage= (SELECT name FROM Location WHERE Location.idLocation = " + "'" + params['idLocation'] + "')";
}
/*if (params['idIllustrationType'] != 'undefined') {
	if (isTaken == true)
		sqlString += " AND ";
	else
		isTaken=true;
	sqlString += "idIllustrationType=" + "'" + params['idIllustrationType'] + "'";
}*/
sqlString += " ;";
//sqlString = "SELECT * FROM CompleteArtefactView";
console.log("searchDB SQL string -> " + sqlString);
//var stmt = db.prepare(sqlString);

//var sqlStringFts = "";
//sqlStringFts += " SELECT * FROM fts3CompleteArtefactView WHERE fts3CompleteArtefactView MATCH  " + "'" + params['allField'] + "'";
//console.log("sqlStringFts: "+ sqlStringFts);




var tab = Array();

var cpt = 0;
if (params['allField'] == '')
{

//stmt = db.prepare(sqlString);


stmt = db.prepare(sqlString);
	while(stmt.step()) {
		var row = stmt.getAsObject();
		tab[cpt] = row;
		cpt++;
	
	}
}
else
{

dbFts.all(sqlString, function(err, rows) {
	 if (err) {
	      console.error("error dbFts")
	      console.error(err);
	      return;
	    } 
 	tab = rows.concat();
        rows.forEach(function (row) {  
            console.log(row.idArtefact, row.numeroInventaire);  
	    //tab[cpt] = row;    
	    cpt++;
	    console.log("cpt:"+cpt);
	   
        } )  // for forEach

	console.log(cpt);
	//tab = rows;
	console.log("tab dbFts: "+tab);
	console.log(tab);
	return rows;
    }); //for function  all

//dbFts.close();
//console.log("tab : "+tab);
//return tab;



	
}

//tab = GetSQL(sqlString);

console.log("tababc : "+tab);
//stmt.free();
return tab;

}

//////////////////////////////////////////////////////////////////////////////////////////////

function GetSQLSearchArtefact (params) {

 console.log("GetSQLSearchArtefact");
 //sai cho nay
//console.log(String(params));
//console.log("search DB Anotomy: "+params["Anotomy"]);
//console.log("select.Anotomy: "+params["select.Anotomy"]);
var isTaken=false;

var sqlString ="SELECT * FROM CompleteArtefactView WHERE 1=1 ";
//chu y: phai convert sang string
 console.log("GetSQLSearchArtefact"+sqlString);
if (params['allField'] != "") {
	/*sqlString += " AND idArtefact in  ( ";
	sqlString += " SELECT idArtefact FROM ftsCompleteArtefactView WHERE ftsCompleteArtefactView MATCH  " + "'" + params['allField'] + "')";
	*/
	sqlString = "SELECT * FROM ftsCompleteArtefactView WHERE 1=1 ";
	sqlString += " AND ";
	sqlString += " ftsCompleteArtefactView MATCH  " + "'" + params['allField'] + "'";

} 

if (params['numInventaire'] != '') {
	isTaken=true;
	sqlString += " AND ";
	sqlString += " numeroInventaire=" + "'" + params['numInventaire'] + "'";
}
if (params['description'] != "") {
	sqlString += " AND ";
	sqlString += "description like " + "'%" + params['description'] + "%'";
	//sqlString+= '\'%' + tag + '%\'';
}
if (params['Anatomy'] != "") {
	sqlString += " AND ";
	sqlString += "anatomy like " + "'%" + params['Anatomy'] + "%'";
	//sqlString+= '\'%' + tag + '%\'';
}




if (params['idSupport']) {
	sqlString += " AND ";
	sqlString += "support = (SELECT name FROM Support WHERE Support.idSupport = " + "'" + params['idSupport'] + "')";
}
if (params['idLocation']) {
	sqlString += " AND ";
	sqlString += "stockage= (SELECT name FROM Location WHERE Location.idLocation = " + "'" + params['idLocation'] + "')";
}
/*if (params['idIllustrationType'] != 'undefined') {
	if (isTaken == true)
		sqlString += " AND ";
	else
		isTaken=true;
	sqlString += "idIllustrationType=" + "'" + params['idIllustrationType'] + "'";
}*/
sqlString += " ;";

console.log("searchDB SQL string -> " + sqlString);
return sqlString;

}






//-------------------------------------------------------------------Zone---------------------------------------------------------------------

function displayZone (req, res) {
console.log("Display Zone");
openDB();
var stmt = db.prepare("SELECT * FROM Zone");

var valueTable = Array();

var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	valueTable[cpt] = row;
	cpt++;
}

console.log("displayZone : "+cpt+ " Zone chargés");
stmt.free();
return(valueTable);
}


function insertZone(values) {
console.log("BDD insertZone ");
console.log(values);
var sqlString='INSERT INTO Zone (';
var cpt=1;
var sqlStringValue = ' VALUES (';
for (var fieldName in tabFieldsZone) {
	if ( fieldName != 'idZone' && (typeof values[fieldName]!=='undefined') ) {
		sqlString += fieldName + " ,"
		sqlStringValue +=  '\'' + values[fieldName] + '\' ,';
		cpt++;
	}
}
sqlString = sqlString.substring(0, sqlString.length - 1)
sqlString +=")";
console.log("requete d sqlString1 : "+sqlString);
sqlStringValue = sqlStringValue.substring(0, sqlStringValue.length - 1)
sqlStringValue +=");";
sqlString += sqlStringValue;
db.run(sqlString);
saveDB();

openDB();
console.log("values['idZone']: "+values['idZone']);
console.log("requete d sqlString : "+sqlString);

var stmt = db.prepare(" select last_insert_rowid();");
var result = stmt.getAsObject();

stmt.free();
if (typeof result =='undefined')
{
 	console.log("Insert id="+result.idZone+" not successfully!");
	console.log("Insert result=" +result+ " not successfully!");
}
else
{
 	 console.log("Insert id="+result.idZone+" successfully!");
	console.log("Insert id="+result+" successfully!");
	console.log("Insert result="+result[1]+" successfully!");
        console.log("Insert result.length="+result.length+" successfully!");
}
return ('Requête d\'ajout d\'enregistrement exécutée');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// le fonction de sauvegarder la région selectionnée à base donnés.
function insertZoneFromSelect(artefactID,selectionPoints,nameIllustration,idIllustration) {
console.log("BDD insertZoneFromSelect ");
console.log(selectionPoints);
var cpt=1;
var name="";
var sqlstring = "INSERT INTO zone (name,coordonnees) VALUES ('"+idIllustration+"/"+nameIllustration+"','"+selectionPoints+"')";
console.log(sqlstring);
db.run(sqlstring);
saveDB();
openDB();
var stmt = db.prepare(" select last_insert_rowid() as last_id ;");
var result = stmt.getAsObject();


stmt.free();
if (typeof result =='undefined')
{
 	console.log("Insert id="+result.last_id+" not successfully!");
	console.log("Insert result=" +result+ " not successfully!");
}
else
{
 	console.log("Insert id="+result[0]+" successfully!");
	console.log("Insert id="+result.last_id+" successfully!");
	console.log("Insert result="+result+" successfully!");
        console.log("Insert result.length="+result.length+" successfully!");

	sqlstring= "select Max(idZone) as idZone from zone"
	stmt = db.prepare(sqlstring);
	var cpt = 0;
	while(stmt.step()) {
	var row = stmt.getAsObject();
	var MaxIdZone= row.idZone;
        console.log("max"+row.idZone);	
	}
	
	console.log("artefactID"+artefactID);
	if ((artefactID !="") && (typeof artefactID !=='undefined'))
	{
	sqlstring="INSERT INTO ArtefactZone (f_idArtefact ,f_idZone ) VALUES ('"+artefactID+"' ,'"+MaxIdZone+"' )";
	console.log(sqlstring);
	db.run(sqlstring);
	saveDB();
	}
}



return ('Requête d\'ajout d\'enregistrement exécutée');
}



function alterZone(values, id) {
console.log("BDD alterZone ");
var sqlString="UPDATE Zone SET ";
console.log(values);

var cpt=1;
//mark
for (var fieldName in tabFieldsZone) {
	if ( fieldName != 'idZone' ) {
		sqlString += fieldName + "=\'" + values[fieldName] + "\'";
			cpt++;
			sqlString+= " ,";
	}
}
sqlString=sqlString.trim();
if( sqlString.charAt( sqlString.length-1 ) == ',' )
// supprimer le dernier caractère
sqlString = sqlString.substring(0, sqlString.length - 1)

sqlString+=" WHERE idZone=\'" + id + "\'";
sqlString+=" ;";
console.log("requete d alterZone: " + sqlString);
db.run(sqlString);
saveDB();
}

function getZone(_id) {
console.log("BDD get Record : selectionné = "+_id);

var stmt = db.prepare("SELECT * FROM Zone WHERE idZone=:id");
var row=stmt.getAsObject({':id':_id});

//console.log("Row in GetRecord\n"+row);
return row;
stmt.free();
}


//supprimer une zone
function deleteZone(values) {
console.log("BDD deletezone ");
console.log("values :"+values);
var sqlString="DELETE FROM zone "
sqlString+=" WHERE idZone='" + values + "'";
sqlString+=" ;";
console.log("requete alterzone : " + sqlString);
db.run(sqlString);
saveDB();
}

//-------------------------------------------------ArtefactZone--------------------------------------------------------------------
function displayArtefactZone(_idArtefact) {
console.log("Display Zone");
openDB();
var strSql = "SELECT * FROM ArtefactZoneView WHERE f_idArtefact= '"+_idArtefact+"'";
//var strSql = "SELECT idArtefactZone, f_idArtefact, f_idZone, zoneName, coordonnees, commentaire FROM ArtefactZoneView WHERE f_idArtefact= '"+_idArtefact+"'";
var stmt = db.prepare(strSql);
console.log("strSql :"+strSql);
var valueTable = Array();
var cpt = 0;
while(stmt.step()) {
	var row = stmt.getAsObject();
	valueTable[cpt] = row;
	cpt++;
}
console.log("displayArtefactZone : "+cpt+ " Zone chargés");
stmt.free();
return(valueTable);
}

function insertArtefactZone(values) {
console.log("BDD insertArtefactZone ");
console.log(values);
var sqlString='INSERT INTO ArtefactZone (';
var cpt=1;
var sqlStringValue = ' VALUES (';
for (var fieldName in tabFieldsArtefactZone) {
	if ( fieldName != 'idArtefactZone' && (typeof values[fieldName]!=='undefined') ) {
		sqlString += fieldName + " ,"
		sqlStringValue +=  '\'' + values[fieldName] + '\' ,';
		cpt++;
	}
}
sqlString = sqlString.substring(0, sqlString.length - 1)
sqlString +=")";
console.log("requete d sqlString1 : "+sqlString);
sqlStringValue = sqlStringValue.substring(0, sqlStringValue.length - 1)
sqlStringValue +=");";
sqlString += sqlStringValue;
db.run(sqlString);
saveDB();

openDB();
console.log("values['idArtefactZone']: "+values['idArtefactZone']);
console.log("requete d sqlString : "+sqlString);

var stmt = db.prepare(" select last_insert_rowid();");
var result = stmt.getAsObject();

stmt.free();
if (typeof result =='undefined')
{
 	console.log("Insert id="+result.idArtefactZone+" not successfully!");
	console.log("Insert result=" +result+ " not successfully!");
}
else
{
 	console.log("Insert id="+result.idArtefactZone+" successfully!");
	console.log("Insert id="+result+" successfully!");
	
}
return ('Requête d\'ajout d\'enregistrement exécutée');
}
//-------------------------------------------------------------------------------------------------------------------------

function alterArtefactZone(values, id) {
console.log("BDD alterArtefactZone ");
var sqlString="UPDATE ArtefactZone SET ";
console.log(values);

var cpt=1;
//mark
for (var fieldName in tabFieldsArtefactZone) {
	if ( (fieldName != 'idArtefactZone') && (typeof values[fieldName]!=='undefined')) {
		sqlString += fieldName + "=\'" + values[fieldName] + "\'";
			cpt++;
			sqlString+= ", ";
	}
}
sqlString=sqlString.trim();
if( sqlString.charAt( sqlString.length-1 ) == ',' )
// supprimer le dernier caractère
sqlString = sqlString.substring(0, sqlString.length - 1)
sqlString+=" WHERE idArtefactZone=\'" + id + "\'";
sqlString+=" ;";
console.log("requete d alterArtefactZone: " + sqlString);
db.run(sqlString);
saveDB();
}

function getArtefactZoneView(_idArtefactZone) {
console.log("BDD get getArtefactZoneView : selectionné = "+_idArtefactZone);
var stmt = db.prepare("SELECT idArtefactZone, f_idArtefact,f_idZone, zoneName, coordonnees,commentaire FROM ArtefactZoneView WHERE idArtefactZone=:id");
var row=stmt.getAsObject({':id':_idArtefactZone});
return row;
stmt.free();
}
function getArtefactZone(_id) {
console.log("BDD get getArtefactZone : selectionné = "+_id);
var stmt = db.prepare("SELECT idArtefactZone, f_idArtefact,f_idZone FROM ArtefactZone WHERE idArtefactZone=:id");
var row=stmt.getAsObject({':id':_id});
return row;
stmt.free();
}



//supprimer une ArtefactZone
function deleteArtefactZone(values) {
console.log("BDD deleteArtefactZone ");
console.log("values :"+values);
var sqlString="DELETE FROM ArtefactZone "
sqlString+=" WHERE idArtefactZone='" + values + "'";
sqlString+=" ;";
console.log("requete alterArtefactZone : " + sqlString);
db.run(sqlString);
saveDB();
}

//obtenir des éléments du base de donné
//note
function getRegionsOfArtefact(_idArtefact) {
console.log("getRegionsOfArtefact DB");

var tab = Array();

return tab;

}
//-------------------------------------------------End ArtefactZone--------------------------------------------------------------------


exports.openDB = openDB;
exports.saveDB = saveDB;

exports.displayDB = displayDB;

exports.searchDB = searchDB;

exports.getUserList =getUserList;
//exports.checkUser =checkUser;

exports.getArtefactFields = getArtefactFields;
exports.alterRecord = alterRecord;
exports.getRecord = getRecord;
exports.insertRecord = insertRecord;
exports.deleteArtefact = deleteArtefact;


exports.getMissionList = getMissionList;
exports.insertMission = insertMission;
exports.alterMission = alterMission;
exports.getMissionFields = getMissionFields;

exports.getArtefactTypesList = getArtefactTypesList;
//manque insert et alter
exports.getArtefactTypeFields = getArtefactTypeFields;
exports.alterArtefactType = alterArtefactType;
exports.insertArtefactType = insertArtefactType;
exports.GetSQLSearchArtefact = GetSQLSearchArtefact;
exports.getArtefactView = getArtefactView;

exports.getSupportList = getSupportList;
exports.getSupportFields = getSupportFields;
exports.insertSupport = insertSupport;
exports.alterSupport = alterSupport;

exports.getLocationList = getLocationList;

exports.getIllustrationList = getIllustrationList;
exports.getIllustrationViewFields = getIllustrationViewFields;
exports.getIllustrationsView = getIllustrationsView;
exports.insertIllustration = insertIllustration;
exports.getIllustrationTypes = getIllustrationTypes;
exports.getIllustrationForArtefact = getIllustrationForArtefact;
exports.getIllustrationByID = getIllustrationByID
exports.linkIllustrationToArtefact = linkIllustrationToArtefact;

exports.getFullViewFields = getFullViewFields;

exports.getAnatomyList = getAnatomyList;
exports.insertAnatomy = insertAnatomy;
exports.alterAnatomy = alterAnatomy;
exports.getAllImageIllustration=getAllImageIllustration;
exports.getAllImageIllustrationGroupByArtefact=getAllImageIllustrationGroupByArtefact;

exports.displayZone = displayZone
exports.getZone = getZone
exports.alterZone = alterZone
exports.insertZone = insertZone
exports.deleteZone = deleteZone
exports.getZoneFields = getZoneFields



exports.displayArtefactZone = displayArtefactZone
exports.getArtefactZone = getArtefactZone
exports.getArtefactZoneView = getArtefactZoneView
exports.alterArtefactZone = alterArtefactZone
exports.insertArtefactZone = insertArtefactZone
exports.deleteArtefactZone = deleteArtefactZone
exports.getArtefactZoneFields = getArtefactZoneFields
exports.getArtefactZoneViewFields = getArtefactZoneViewFields
exports.getArtefactViewArray = getArtefactViewArray
exports.getIllustrationsArtefactView = getIllustrationsArtefactView
exports.getIllustrationsArtefactViewForExportPdf = getIllustrationsArtefactViewForExportPdf
exports.insertZoneFromSelect=insertZoneFromSelect
exports.getRegionsOfArtefact=getRegionsOfArtefact
exports.getArtefactReportFields=getArtefactReportFields
exports.getDB = getDB

