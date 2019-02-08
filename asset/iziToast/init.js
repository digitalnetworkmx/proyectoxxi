/** Puedes encontrar mas documentacion en esta pagina: http://izitoast.marcelodolce.com/**/
function alerta(exito=false,mensaje="El programador ha cometido un error.",tiempo=3000) {
		var color= (exito) ?'green':'red';	
		iziToast.show({
    	  message: mensaje,
		  position:'topCenter',
		  timeout: tiempo,
		  color:color,
		});
}