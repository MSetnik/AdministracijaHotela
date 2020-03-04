var aHoteliList=[];

//Pravimo Listu Hotela i u nju pohranjujemo objekte hotela iz baze podataka
oDbHoteli.on('value', function(oOdgovorPosluzitelja)
{
	aHoteliList=[];
	oOdgovorPosluzitelja.forEach(function (oHoteliSnapshot)
	{

		var sHoteliKey = oHoteliSnapshot.key;
		var oHotel = oHoteliSnapshot.val();
		aHoteliList.push({
			hotelKey: sHoteliKey,
			naziv: oHotel.naziv,
			adresa : oHotel.adresa,
			grad : oHotel.grad,
			zupanija:oHotel.zupanija,
			kapacitet: oHotel.kapacitet
		});
		
		
	});
	PopuniTablicuHoteli();
	console.log(aHoteliList);

});

var aBoravakList=[];
oDbBoravak.on('value', function(oOdgovorPosluzitelja)
{
	aBoravakList=[];
	oOdgovorPosluzitelja.forEach(function (oBoravakSnapshot)
	{

		var sBoravakKey = oBoravakSnapshot.key;
		var oBoravak = oBoravakSnapshot.val();
		aBoravakList.push({
			boravakKey: sBoravakKey,
			brojKreveta: oBoravak.brojKreveta,
			hotelId: oBoravak.hotelId
		});
		
		
	});
	Statistika();
	PopuniTablicuHoteli();
	console.log(aBoravakList);
});

function PopuniTablicuHoteli()
{
	var oTablica = $('#TablicaHoteli');
	oTablica.find('tbody').empty();
	var nRbr = 1;
	var Slobodno;

	aHoteliList.forEach(function (oHotel){
		var kapacitet = oHotel.kapacitet;
		var brojRezervacija = 0;
		var brojSlobodnihMjesta =kapacitet;
		var HotelDisabled="";
		aBoravakList.forEach(function(oBoravak){
			if(oHotel.hotelKey == oBoravak.hotelId )
			{
				brojRezervacija += parseInt(oBoravak.brojKreveta)
				brojSlobodnihMjesta = parseInt(oHotel.kapacitet) - brojRezervacija;
			}

		});
		if(brojSlobodnihMjesta == 0)
		{
			HotelDisabled = "disabled";
		}

		var puna_adresa = "http://maps.google.com/?q="+oHotel.grad + " "+ oHotel.adresa;
		var sRow = '<tr><td>' + nRbr++ + '</td><td>' + oHotel.naziv + '</td><td><a target="_blank" href="'+puna_adresa+'">' + oHotel.adresa + '</a></td><td>' + oHotel.grad + '</td><td>' + oHotel.zupanija + '</td><td>' + oHotel.kapacitet  +'</td><td>' + brojSlobodnihMjesta+ '<td><button id="rezerviraj" '+HotelDisabled +' onclick="PopuniModalRezerviraj(\''+oHotel.hotelKey+'\')"  class="btn btn-info"><span class="glyphicon glyphicon-user"></span></button></td><td><button id="Odjava" onclick="PopuniModalOdjava(\''+oHotel.hotelKey+'\')"  class="btn btn-info"><span class="glyphicon glyphicon-book"></span></button></td></td><td><button onclick="ObrisiHotel(\''+oHotel.hotelKey+'\')" type="button" id="delete" class="btn btn-danger" ><span class="glyphicon glyphicon-trash"></span></button></td><td><button onclick="ModalUrediHotel(\''+oHotel.hotelKey+'\')" id="edit" class="btn btn-info" ><span  class="glyphicon glyphicon-edit"></span></button></td</tr>';
		oTablica.find('tbody').append(sRow);


	});
	
}


function DodajHotel() 
{
	var sHotelNaziv = $('#inptNazivHotela').val();
	var sHotelAdresa = $('#txtAdresaHotela').val();
	var sHotelGrad = $('#txtGradHotela').val();
	var sHotelZupanija = $('#txtZupanijaHotela').val();
	var sHotelKapacitet = $('#txtKapacitetHotela').val();

	// Generiranje novoga ključa u bazi
	var sKey = firebase.database().ref().child('Hoteli').push().key;

    var oHotel = 
    {
        naziv : sHotelNaziv,
        adresa : sHotelAdresa,
        grad: sHotelGrad,
        zupanija: sHotelZupanija,
        kapacitet: sHotelKapacitet
    };

    // Zapiši u Firebase
    var oZapis = {};
    oZapis[sKey] = oHotel;
    oDbHoteli.update(oZapis);
    Statistika();
}

function ObrisiHotel(sHotelKey)
{
	var oHotelRef = oDb.ref('Hoteli/' + sHotelKey);
	oHotelRef.remove();
	Statistika();
}

function ModalUrediHotel(sHotelKey)
{	
	var oHotelRef = oDb.ref('Hoteli/' + sHotelKey);
	oHotelRef.once('value', function(oOdgovorPosluzitelja)
	{
		var oHotel = oOdgovorPosluzitelja.val();
		console.log(oHotel);
		// Popunjavanje elemenata forme za uređivanje
		$('#inptNazivHotelaEdit').val(oHotel.naziv);
		$('#txtAdresaHotelaEdit').val(oHotel.adresa);
		$('#txtGradHotelaEdit').val(oHotel.grad);
		$('#txtZupanijaHotelaEdit').val(oHotel.zupanija);
		$('#txtKapacitetHotelaEdit').val(oHotel.kapacitet);
		$('#btnEdit').attr('onclick', 'SpremiUredeniHotel("'+sHotelKey+'")');


		$('#azuriraj-hotel').modal('show');

	});
}

function SpremiUredeniHotel(sHotelKey)
{
	var oHotelRef = oDb.ref('Hoteli/' + sHotelKey);

	var sHotelNaziv= $('#inptNazivHotelaEdit').val();
	var sHotelAdresa= $('#txtAdresaHotelaEdit').val();
	var sHotelGrad= $('#txtGradHotelaEdit').val();
	var sHotelZupanija= $('#txtZupanijaHotelaEdit').val();
	var sHotelKapacitet= $('#txtKapacitetHotelaEdit').val();

	var oHotel = 
	{
		naziv: sHotelNaziv, 
		adresa: sHotelAdresa,
		grad: sHotelGrad,
		zupanija: sHotelZupanija,
		kapacitet: sHotelKapacitet
	};
	oHotelRef.update(oHotel);
}



function PopuniModalRezerviraj(sHotelKey, nBrojSlobodnihMjesta)
{
	var oHotelRef = oDb.ref('Hoteli/' + sHotelKey);
	oHotelRef.once('value', function(oOdgovorPosluzitelja)
	{
		var oHotel = oOdgovorPosluzitelja.val();
		console.log(oHotel);
		// Popunjavanje elemenata forme za uređivanje
		$('#idHotelaRezerviraj').val(sHotelKey);
		$('#ImeHotela').val(oHotel.naziv);
		$('#btnRezerviraj').attr('onclick', 'RezervirajHotel("'+sHotelKey+'", '+nBrojSlobodnihMjesta+')');


		$('#rezerviraj-hotel').modal('show');

	});

}

function RezervirajHotel(sHotelKey, nBrojSlobodnihMjesta)
{
	var sBrojKreveta = $('#brojOsoba').val();
	var sHotelId = $('#idHotelaRezerviraj').val();
	if(parseInt(sBrojKreveta) > nBrojSlobodnihMjesta)
	{
		alert("Nedovoljan broj kreveta. Unesite broj manji od " + nBrojSlobodnihMjesta);
		return false;
	}
	// Generiranje novoga ključa u bazi
	var sKey = firebase.database().ref().child('Boravak').push().key;

    var oBoravak = 
    {
        brojKreveta : sBrojKreveta,
        hotelId : sHotelId,
    };

    // Zapiši u Firebase
    var oZapis = {};
    oZapis[sKey] = oBoravak;
    oDbBoravak.update(oZapis);
    console.log(oDbBoravak);
    $('#rezerviraj-hotel').modal('hide');
}


function Statistika()
{
	var brojHotela=0;
	var brojGostiju = 0;
	var UkupnoGosti=0;
	var kapacitetLanca = 0;
	var brojSlobodnihMjesta  = 0;
	aHoteliList.forEach(function(oKapacitet){
		brojHotela++;
		kapacitetLanca = parseInt(kapacitetLanca) + parseInt(oKapacitet.kapacitet);

	});
	aBoravakList.forEach(function (oBoravak){
		brojGostiju = parseInt(brojGostiju) + parseInt(oBoravak.brojKreveta);
	});
	aHoteliList.forEach(function(brKreveta)
		{
			brojSlobodnihMjesta = kapacitetLanca - brojGostiju
			//console.log(UkupnoGosti);
		});
	console.log(brojGostiju);
	console.log(kapacitetLanca);
	console.log(brojSlobodnihMjesta);

	//Popunjavanje tablie statistika
	var oTablica =$('#statistikaTablica');
	oTablica.find('tbody').empty();

	var sRow = '<tr id="TijeloStatistikaTablica"><td>' + brojHotela + '</td><td>' + brojGostiju + '</td><td>' + kapacitetLanca +'</td><td>' + brojSlobodnihMjesta +'</td></tr>' 
	oTablica.append(sRow);
}


function PopuniModalOdjava(sHotelKey)
{

	var oHotelRef = oDb.ref('Hoteli/' + sHotelKey);
	oHotelRef.once('value', function(oOdgovorPosluzitelja)
	{
		var oHotel = oOdgovorPosluzitelja.val();
		console.log(oHotel);
		// Popunjavanje elemenata forme za uređivanje
		$('#idHotelRezerviraj').val(sHotelKey);
		$('#ImeHotelaRezervacije').val(oHotel.naziv);
		var tablica_rezervacije = $('#rezervacije');
		tablica_rezervacije.find('tbody').empty();
		var sRezervacija = "";
		var rbr = 0;
		aBoravakList.forEach(function(oBoravak)
		{
			
			if(sHotelKey == oBoravak.hotelId)
			{
			
				sRezervacija = "<tr><td>"+ ++rbr +".</td><td>"+oBoravak.boravakKey+"</td><td>"+ oBoravak.brojKreveta+'</td><td><button id="btnObrisi" type="button" onclick="obrisiRezervaciju(\''+oBoravak.boravakKey+'\')"  class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td></tr>';
				tablica_rezervacije.find('tbody').append(sRezervacija);
			}
		});
		//$('#Prikaz-rezervacija').modal('show');
		
	});
	$('#Prikaz-rezervacija').modal('show');
}


function obrisiRezervaciju(sBoravakKey)
{
	var oBoravakRef = oDb.ref('Boravak/' + sBoravakKey);
	oBoravakRef.remove();
	$('#Prikaz-rezervacija').modal('hide');
}
