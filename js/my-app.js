// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

function loadData(obj){
    $$('#listadopaises').html('');   
    let token = localStorage.token;
    $$.each(obj.data, function (i, item) {   
        let len = item.length                 
        for (i = 0; i < len; i++){                         
            let lista = '<li class="item-content"><div class="card facebook-card"><div class="card-header no-border"><div class="facebook-name">'+ item[i].codigo +'-'+item[i].nombre+'</div><div class="facebook-date">'+item[i].moneda+'</div></div><div class="card-content"><img src="'+item[i].bandera+'" width="100%"></div><div class="card-footer no-border"><a href="#" data="' + btoa(JSON.stringify(item[i])) + '" class="link actualizar-' + item[i].codigo +'">Actualizar</a><a href="#" data="' + item[i].codigo + '" class="link delete-' + item[i].codigo +'">Eliminar</a></div></div></li>'
            $$('#listadopaises').append(lista);
            $$('.actualizar-' + item[i].codigo).on('click', function(e){
                e.preventDefault();
                let data = $$(this).attr('data')
                localStorage.setItem("paisUpdate", data);
                mainView.router.load({url:'update.html'});
            })
            $$('.delete-' + item[i].codigo).on('click', function () {
                let codigo = $$(this).attr('data')
                //if(codigo === item[i].codigo ){
                    myApp.confirm('Esta seguro que desea borrar este pais?', 'Priverion', function () {
                        $$.ajax({
                            url: 'https://apitest.grupoqimera.co/index.php/api/sibco/paises/' + codigo,
                            method: 'DELETE',	        
                            dataType: 'json',
                            headers : {
                                'content-type' : 'application/json',
                                'authorization' : token
                            },
                            success: function(response){                                 
                                myApp.alert('Pais borrado','Priverion');   
                                mainView.router.refreshPage();                                                           
                            },
                            error: function(xhr, status){
                                    console.log('Error: '+JSON.stringify(xhr));
                                    console.log('ErrorStatus: '+JSON.stringify(status));
                            }
                        });
                        
                    });
                //}                
            });            
        } 
    }); 
}

// Handle Cordova Device Ready Event
$$(document).on('ready', function() {
	if (localStorage.token) {
        mainView.router.load({url:'dashboard.html'});
    }		
});

myApp.onPageInit('create', function (page) {
    
    let token = localStorage.token;
    
    $$('#btnAddPais').on('click', function(e){
        e.preventDefault();
        let codigo = $$('#codigo').val();
        let nombre = $$('#nombre').val();
        let moneda = $$('#moneda').val();
        let bandera = $$('#viewbandera').attr('src');

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

    $$('#bandera').on('change', function(){
        let f = this        
        var filePath = document.getElementById("bandera").value;
        var reader = new FileReader();
        reader.onload = function (e) {			   
            document.getElementById("viewbandera").src = e.target.result;
        };
        reader.readAsDataURL(f.files[0]);   
    })

})

myApp.onPageInit('update', function (page) {
    
    let token = localStorage.token;
    let data = JSON.parse(atob(localStorage.paisUpdate));    

    $$('#act-codigo').val(data.codigo);
    $$('#act-nombre').val(data.nombre);
    $$('#act-moneda').val(data.moneda);
    $$('#viewactbandera').attr('src', data.bandera);
    
    $$('#btnActPais').on('click', function(e){
        e.preventDefault();
        let codigo = $$('#act-codigo').val();
        let nombre = $$('#act-nombre').val();
        let moneda = $$('#act-moneda').val();
        let bandera = $$('#viewactbandera').attr('src');
        $$.ajax({
            url: 'https://apitest.grupoqimera.co/index.php/api/sibco/paises',
            method: 'POST',	        
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

    $$('#act-bandera').on('change', function(){
        let f = this        
        var filePath = document.getElementById("act-bandera").value;
        var reader = new FileReader();
        reader.onload = function (e) {			   
            document.getElementById("viewactbandera").src = e.target.result;
        };
        reader.readAsDataURL(f.files[0]);   
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
                loadData(obj)    
        },
        error: function(xhr, status){
                console.log('Error: '+JSON.stringify(xhr));
                console.log('ErrorStatus: '+JSON.stringify(status));
        }
    });   

    $$('#btnFnPais').on('click', function(e){
        e.preventDefault()
        let codigo = $$('#fn-codigo').val();
        console.log(codigo)
        $$.ajax({
            url: 'https://apitest.grupoqimera.co/index.php/api/sibco/paises/' + codigo,
            method: 'GET',	        
            dataType: 'json',
            headers : {
                'content-type' : 'application/json',
                'authorization' : token
            },
            success: function(response){                                 
                    var obj = response;  
                    console.log(obj)          
                    loadData(obj)    
            },
            error: function(xhr, status){
                    console.log('Error: '+JSON.stringify(xhr));
                    console.log('ErrorStatus: '+JSON.stringify(status));
            }
        });

    })

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
  