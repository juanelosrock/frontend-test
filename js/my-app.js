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

myApp.onPageInit('create', function (page) {
    
    let token = localStorage.token;
    
    $$('#btnAddPais').on('click', function(e){
        e.preventDefault();
        let codigo = $$('#codigo').val();
        let nombre = $$('#nombre').val();
        let moneda = $$('#moneda').val();
        let bandera = $$('#bandera').val();

        $$.ajax({
            url: 'https://apitest.grupoqimera.co/index.php/api/sibco/paises',
            method: 'PUT',	        
            dataType: 'json',
            data: '{ "codigo": "' + codigo + '", "nombre" : "' + nombre + '", "moneda": "' + moneda + '", "bandera": "' + bandera + '" }',
            headers : {
                'content-type' : 'application/json',
                'authorization' : token
            },
            success: function(response){                                                                
                mainView.router.load({url:'dashboard.html'});
            },
            error: function(xhr, status){
                    console.log('Error: '+JSON.stringify(xhr));
                    console.log('ErrorStatus: '+JSON.stringify(status));
            }
        }); 
    })

})

myApp.onPageInit('dashboard', function (page) {
    
    let token = localStorage.token;

    $$.ajax({
        url: 'https://apitest.grupoqimera.co/index.php/api/sibco/paises',
        method: 'GET',	        
        dataType: 'json',
        headers : {
            'content-type' : 'application/json',
            'authorization' : token
        },
        success: function(response){                                 
                var obj = response;            
                $$.each(obj.data, function (i, item) {   
                    let len = item.length                 
                    for (i = 0; i < len; i++){                         
                        let lista = '<li class="item-content"><div class="card facebook-card"><div class="card-header no-border"><div class="facebook-name">'+item[i].nombre+'</div><div class="facebook-date">'+item[i].moneda+'</div></div><div class="card-content"><img src="'+item[i].bandera+'" width="100%"></div><div class="card-footer no-border"><a href="#" class="link">Actualizar</a><a href="#" class="link">Eliminar</a></div></div></li>'
                        $$('#listadopaises').append(lista);
                    } 
                });      
        },
        error: function(xhr, status){
                console.log('Error: '+JSON.stringify(xhr));
                console.log('ErrorStatus: '+JSON.stringify(status));
        }
    });   

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
  