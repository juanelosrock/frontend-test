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

    var db = openDatabase('capsolutions', '1.0', 'Capsolutions BD', 2 * 1024 * 1024);
         var msg;
			
    db.transaction(function (tx) {                                       
        tx.executeSql('CREATE TABLE IF NOT EXISTS INVENTARIO (id, producto, descripcion, conteo, zona)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ACUMULADOZONA (id, zona, conteo)');
    });

    console.log("Device is ready!");
});

function rellenarInventario(){
    $$('#listInventario').html('');   
    var db = openDatabase('capsolutions', '1.0', 'Capsolutions BD', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM INVENTARIO', [], function (tx, results) {
           var len = results.rows.length, i;
           for (i = 0; i < len; i++){                                                                                           
              var id = results.rows.item(i).id;
              var producto = results.rows.item(i).producto;  
              var descripcion = results.rows.item(i).descripcion;  
              var conteo = results.rows.item(i).conteo;  
              var zona = results.rows.item(i).zona;  
              let referencia2 = '<ul><li class="item-content"><div class="item-inner"><div class="item-title">Producto</div><div class="item-after">' + producto + '</div></div></li><li class="item-content"><div class="item-inner"><div class="item-title">Descripcion</div><div class="item-after">' + descripcion + '</div></div></li><li class="item-content"><div class="item-inner"><div class="item-title">Conteo</div><div class="item-after">' + conteo + '</div></div></li><li class="item-content"><div class="item-inner"><div class="item-title">Zona</div><div class="item-after">' + zona + '</div></div></li><li><button class="button quitaritem" data="' + producto + '">Borrar</button></li></ul><hr/>'
              $$('#listInventario').append(referencia2);            
           }  
           $$('.quitaritem').on('click', function(e){
                e.preventDefault()
                idproducto = $$(this).attr('data')
                var db = openDatabase('capsolutions', '1.0', 'Capsolutions BD', 2 * 1024 * 1024);
                db.transaction(function (tx) {                                       
                    tx.executeSql('DELETE FROM INVENTARIO WHERE id = ' + idproducto); 
                    rellenarInventario() 
                });                                                                         
           })         
        }, null);
    });
}

// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

myApp.onPageInit('dashboard', function (page) {
    
    var nombre = localStorage.name;
    var token = localStorage.token;
    $$('#lblnombre').text(nombre)      

    $$.ajax({
        url: 'http://sibco.mobi/restfront/index.php/api/single/getalmacenes',
        method: 'POST',	
        data: '{ "token" : "' + token + '" }',
        dataType: 'json',
        success: function(response){                                 
                var obj = response;                       
                console.log(obj)    
                let almacenes = JSON.stringify(obj)
                localStorage.setItem("almacenes", almacenes);     
                $$.each(obj, function (i, item) {                    
                    let opcion = '<option value="' + item.CODALMACEN + '">' + item.NOMBREALMACEN + '</option>'
                    $$('#cmbAlmacenes').append(opcion)
                });            
        },
        error: function(xhr, status){
                console.log('Error: '+JSON.stringify(xhr));
                console.log('ErrorStatus: '+JSON.stringify(status));
        }
    }); 

    $$.ajax({
        url: 'http://sibco.mobi/restfront/index.php/api/single/getarticulos',
        method: 'POST',	
        data: '{ "token" : "' + token + '" }',
        dataType: 'json',
        success: function(response){                                 
                var obj = response; 
                let articulos = JSON.stringify(obj)                                       
                localStorage.setItem("articulos", articulos);     
        },
        error: function(xhr, status){
                console.log('Error: '+JSON.stringify(xhr));
                console.log('ErrorStatus: '+JSON.stringify(status));
        }
    }); 

    $$.ajax({
        url: 'http://sibco.mobi/restfront/index.php/api/single/getseries',
        method: 'POST',	
        data: '{ "token" : "' + token + '" }',
        dataType: 'json',
        success: function(response){                                 
                var obj = response; 
                let series = JSON.stringify(obj)                                       
                localStorage.setItem("series", series); 
                $$.each(obj, function (i, item) {                    
                    let opcion = '<option value="' + item.SERIE + '">' + item.SERIE + '</option>'
                    $$('#cmdSeries').append(opcion)
                });      
        },
        error: function(xhr, status){
                console.log('Error: '+JSON.stringify(xhr));
                console.log('ErrorStatus: '+JSON.stringify(status));
        }
    });
    rellenarInventario()
    
    

    $$('#inpDescripcion').on('blur', function(e){ 
        $$('#listProductos').html('');       
        let palabra = $$(this).val()

        function findAll(arregloarticulo) {
            if(arregloarticulo != null){
                if (typeof arregloarticulo.DESCRIPCION !== 'undefined') {                                                            
                    if(arregloarticulo.DESCRIPCION.toLowerCase().includes(palabra.toLowerCase())){                        
                        return arregloarticulo                                          
                    }                                        
                }
            }                                              
        }

        

        let articulos = localStorage.articulos
        let arregloarticulos = JSON.parse(articulos)   

        if(palabra.length > 3){
            
            let articulosfind = arregloarticulos.filter(findAll) 
            articulosfind.forEach(element => {    
                let referencia = '<ul><li class="item-content"><div class="item-inner"><div class="item-title">Producto</div><div class="item-after">' + element.CODARTICULO + '</div></div></li><li class="item-content"><div class="item-inner"><div class="item-title">Descripcion</div><div class="item-after">' + element.DESCRIPCION + '</div></div></li><li><div class="item-content"><div class="item-inner"><div class="item-title label">Conteo</div><div class="item-input"><input id="' + element.CODARTICULO + '" type="text" placeholder="conteo"></div></div></div></li><li class="item-content"><div class="item-inner"><a href="#" data="' + element.CODARTICULO +'*'+ element.DESCRIPCION + '" class="button button-big button-fill color-red additem">Agregar</a></div></li></ul>'
                $$('#listProductos').append(referencia);
            });
            $$('.additem').on('click', function(e){                
                let data = $$(this).attr('data')
                let dataseparada = data.split('*')
                let inputdata = $$('#' + dataseparada[0]).val();
                let inpzona = $$('#inpZona').val()
                console.log(dataseparada)
                console.log(inputdata)
                var db = openDatabase('capsolutions', '1.0', 'Capsolutions BD', 2 * 1024 * 1024);
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM INVENTARIO WHERE id = ' + dataseparada[0] , [], function (tx, results) {
                       var len = results.rows.length, i;
                       if(len == 0){
                        tx.executeSql('INSERT INTO INVENTARIO (id, producto, descripcion, conteo, zona) VALUES ('+ dataseparada[0] +', "' + dataseparada[0] + '","' + dataseparada[1] + '","' + inputdata + '","' + inpzona + '")');                                             
                       }else{
                        var nuevoconteo = parseInt(results.rows.item(i).conteo) + parseInt(inputdata);
                        tx.executeSql('UPDATE INVENTARIO SET conteo = ' + nuevoconteo + ' WHERE id = ' + dataseparada[0]);                                           
                       }
                       rellenarInventario()
                       $$("#inpCodBarras").focus();
                    }, null);
                });                                
            })
        }        
    })
    
    $$('#inpCodBarras').on('keyup', function(e){

        

        if (e.keyCode === 13) {
            // Cancel the default action, if needed
            e.preventDefault();
            $$('#listProductos').html('');
            // Trigger the button element with a click
            let articulos = localStorage.articulos
            let arregloarticulos = JSON.parse(articulos)            
            //let resultado = arregloarticulos.filter(p => p.CODBARRAS == $$(this).val())
            //console.log(resultado)   
            let resultado = arregloarticulos.find(el => el.CODBARRAS == $$(this).val());                             
            let referencia = '<ul><li class="item-content"><div class="item-inner"><div class="item-title">Producto</div><div class="item-after">' + resultado.CODARTICULO + '</div></div></li><li class="item-content"><div class="item-inner"><div class="item-title">Descripcion</div><div class="item-after">' + resultado.DESCRIPCION + '</div></div></li><li><div class="item-content"><div class="item-inner"><div class="item-title label">Conteo</div><div class="item-input"><input id="' + respuesta.CODARTICULO + '" type="text" placeholder="conteo"></div></div></div></li><li class="item-content"><div class="item-inner"><a href="#" data="' + resultado.CODARTICULO +'*'+ resultado.DESCRIPCION + '" class="button button-big button-fill color-red additem">Agregar</a></div></li></ul>'
            $$('#listProductos').append(referencia);  
            $$('.additem').on('click', function(e){                
                let data = $$(this).attr('data')
                let dataseparada = data.split('*')
                let inputdata = $$('#' + dataseparada[0]).val();
                let inpzona = $$('#inpZona').val()
                console.log(dataseparada)
                console.log(inputdata)
                let referencia2 = '<ul><li class="item-content"><div class="item-inner"><div class="item-title">Producto</div><div class="item-after">' + dataseparada[0] + '</div></div></li><li class="item-content"><div class="item-inner"><div class="item-title">Descripcion</div><div class="item-after">' + dataseparada[1] + '</div></div></li><li class="item-content"><div class="item-inner"><div class="item-title">Conteo</div><div class="item-after">' + inputdata + '</div></div></li><li class="item-content"><div class="item-inner"><div class="item-title">Zona</div><div class="item-after">' + inpzona + '</div></div></li></ul><hr/>'
                $$('#listInventario').append(referencia2);
            })         
          }
    })

    

})

myApp.onPageInit('login-screen', function (page) {
    var pageContainer = $$(page.container);              
      
    $$('.form-to-data').on('click', function(){
      
          var formData = myApp.formToJSON('#my-form');   
          
          $$.ajax({
              url: 'http://sibco.mobi/restfront/index.php/api/single/registertoken',
              method: 'POST',	
              data: '{ "nick" : "' + formData.nick + '", "clave" : "' + formData.clave + '", "date" : "' + formData.date + '", "number" : "' + formData.number + '" }',
              dataType: 'json',
              success: function(response){                     
                      var obj = response;                       
                      if(obj.salida == 'OK'){
                          myApp.alert(obj.usuario,'Bienvenido ' + obj.name);
                          localStorage.setItem("name", obj.name);
                          localStorage.setItem("userid", obj.userid);
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