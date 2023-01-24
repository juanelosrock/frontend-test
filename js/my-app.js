// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

});

myApp.onPageInit('dashboard', function (page) {
    
})

myApp.onPageInit('login-screen', function (page) {
    var pageContainer = $$(page.container);              
      
    $$('.form-to-data').on('click', function(){
      
          var formData = myApp.formToJSON('#my-form');   
          
          $$.ajax({
              url: 'https://apitest.grupoqimera.co/index.php/api/sibco/registertoken',
              method: 'POST',	
              data: '{ "nick" : "' + formData.nick + '", "clave" : "' + formData.clave + '", "date" : "' + formData.date + '", "number" : "' + formData.number + '" }',
              dataType: 'json',
              success: function(response){                     
                    var obj = response;                       
                    if(obj.response == 'ok'){
                        myApp.alert(obj.usuario,'Bienvenido ' + obj.name);
                        localStorage.setItem("name", obj.name);                        
                        localStorage.setItem("token", obj.token);
                        mainView.router.load({url:'dashboard.html'});
                    }else{
                        myApp.alert('Usuario o Clave Incorrectos, intente de nuevo','Fail');
                    }		               
              },
              error: function(xhr, status){
                      alert('Error: '+JSON.stringify(xhr));
                      alert('ErrorStatus: '+JSON.stringify(status));
              }
          });        
                      
    });   
  }); 