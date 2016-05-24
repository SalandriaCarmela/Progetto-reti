function statusChangeCallback(response) {
	    console.log('statusChangeCallback');
	    console.log(response);
	    // The response object is returned with a status field that lets the
	    // app know the current login status of the person.
	    // Full docs on the response object can be found in the documentation
	    // for FB.getLoginStatus().
	    if (response.status === 'connected') {

	      // Logged into your app and Facebook.
	      testAPI();
	    } else if (response.status === 'not_authorized') {
	      // The person is logged into Facebook, but not your app.
	      document.getElementById('status').innerHTML = 'Please log ' +
	        'into this app.';
	    } else {
	      // The person is not logged into Facebook, so we're not sure if
	      // they are logged into this app or not.
	      document.getElementById('status').innerHTML = 'Please log ' +
	        'into Facebook.';
	    }
	  }

	  // This function is called when someone finishes with the Login
	  // Button.  See the onlogin handler attached to it in the sample
	  // code below.
	  function checkLoginState() {
	    FB.getLoginStatus(function(response) {
	      statusChangeCallback(response);
	    });
	  }



	window.fbAsyncInit = function() {
	  FB.init({
	    appId      : '934276000026981',
	    xfbml      : true,
	    version    : 'v2.5'
	  });
	};

	(function(d, s, id){
	   var js, fjs = d.getElementsByTagName(s)[0];
	   if (d.getElementById(id)) {return;}
	   js = d.createElement(s); js.id = id;
	   js.src = "//connect.facebook.net/en_US/sdk.js";
	   fjs.parentNode.insertBefore(js, fjs);
	 }(document, 'script', 'facebook-jssdk'));

	 FB.getLoginStatus(function(response) {
	   console.log(response);
	  statusChangeCallback(response);
	});
	
  function testAPI() {
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me', {fields: ['email', 'name']},function(response) {
		console.log('Stampo info facebook');
		console.log(response);
		$.ajax({
		type: "POST",
		url: "http://localhost:8080/paginainiziale",
		data: {email: response.email, psw1: response.name, fb: "Y"},
		complete: function(data){
		console.log("sono in success");
		window.location.replace("http://localhost:8080/outfit");
    }
  });
});
}

function messaggioErrore(){
  urlq = location.href.split('?');
  urlP = urlq[1];
  if(urlP=='error') alert("password errata! ");
  if(urlP=='fb') alert("sei gia registrato tramite facebook! \n devi accedere tramite il pulsante di facebook ");
}
  
