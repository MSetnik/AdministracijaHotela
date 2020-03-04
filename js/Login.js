var AdministratoriList=[];
oDbAdministratori.once('value', function(oOdgovorPosluzitelja)
{
	oOdgovorPosluzitelja.forEach(function (oAdministratoriSnapshot)
	{
		var sAdministratoriKey = oAdministratoriSnapshot.key;
		var oAdministrator = oAdministratoriSnapshot.val();
		var administrator = {
			username: oAdministrator.username,
			password : oAdministrator.password
		};
		AdministratoriList.push(administrator);
	});
});

function Login()
{
	var sUsername = $('#username').val();
	var sPassword = $('#password').val();
		korisnikPostoji=false;
	if(sUsername=="" && sPassword =="")
	{
		alert("Unesite korisničko ime i lozinku");
	}
	else
	{
		AdministratoriList.forEach(function(administrator)
		{
			if((sUsername ==administrator.username) && (sPassword == administrator.password))
			{
				korisnikPostoji=true;

			}
		});

		if(korisnikPostoji)
		{
			window.open('hoteli.html', '_self');
		}
		else
		{
			alert('Pogrešno korisničko ime ili lozinka');
		}
	}

}

$ ('#username').keypress(function (event)
{
	if(event.which==13)
	{
		$('#Login').click();
	}
});

$ ('#password').keypress(function (event)
{
	if(event.which==13)
	{
		$('#Login').click();
	}
});