let localizadorReserva;
let detallesViajero = [];
let detallesItinerario = [];
let detallesEticket = [];

function obtenerTipoPasajero(tipo) {
    if (tipo === 'PFA' || tipo === 'ADT') {
        return 'Adulto';
    } else if (tipo === 'CHD' || tipo === 'CNN') {
        return 'Niño';
    }else if (tipo === 'PFA(ADT)' || tipo === 'ADT') {
        return 'Adulto'; 
    }
    else if (tipo === 'PFA(CHD)' || tipo === 'CNN') {
        return 'Niño'; 
    }
    else {
        return 'Bebé';
    }
}

function capturarDatosEticket() {
    const localizadorReservaElemento = document.getElementById('lnkRecordLocator');
    localizadorReserva = localizadorReservaElemento ? localizadorReservaElemento.textContent.trim() : '';    
    console.log('Localizador de reserva:', localizadorReserva);

    detallesViajero = [];
    const viajeros = document.querySelectorAll('#Traveler tbody tr.k-master-row');
    viajeros.forEach(viajero => {
        const nombreElemento = viajero.querySelector('td:nth-child(7)');
        const apellidoElemento = viajero.querySelector('td:nth-child(9)');
        const tipoElemento = viajero.querySelector('td:nth-child(5)');
        const numeroFFElemento = viajero.querySelector('td:nth-child(12)');
        const asientoElemento = viajero.querySelector('td:nth-child(13)');
        const bebeElemento = viajero.querySelector('td:nth-child(11)');

        const nombre = nombreElemento ? nombreElemento.textContent.trim() : '';
        const apellido = apellidoElemento ? apellidoElemento.textContent.trim() : '';
        const tipo = tipoElemento ? tipoElemento.textContent.trim() : '';
        const numeroFF = numeroFFElemento ? numeroFFElemento.textContent.trim() || 'No tiene': '';
        const asiento = asientoElemento ? asientoElemento.textContent.trim() || 'Sin asignar' : 'Sin asignar';
        const tipoPasajero = obtenerTipoPasajero(tipo);
        const bebe = bebeElemento ? bebeElemento.textContent.trim() : '';

        detallesViajero.push({ nombre, apellido, tipoPasajero, numeroFF, asiento, bebe });
    });
    console.log('Detalles del viajero:', detallesViajero);

    detallesItinerario = [];
    const flights = document.querySelectorAll('#booked_segments .PNRFlightRow');
    
    flights.forEach(flight => {
        const equipaje = [];
        const equipajeElements = flight.querySelectorAll('#tbDroppable tr[droppable="Y"]');
        equipajeElements.forEach(franquiciaElement => {
            const franquiciaInput = franquiciaElement.querySelector('td:nth-child(15) input#ctl00_cphMain_rptTravelerGroup_ctl00_rptFlight_ctl01_txtBaggage');
            const franquiciaValue = franquiciaInput ? franquiciaInput.value : 'No se encontró el elemento de equipaje';
            console.log('Valor del equipaje:', franquiciaValue);
            equipaje.push(franquiciaValue);
        });
    
        const fecha = flight.querySelector('.ItinDates div:first-child').textContent.trim();
        const horaSalida = flight.querySelector('.ItinDates div:nth-child(2) span:first-child').textContent.trim();
        const horaLlegada = flight.querySelector('.ItinDates div:nth-child(2) span:nth-child(3)').textContent.trim();
        const aerolinea = flight.querySelector('.ItinLogo img').getAttribute('title');
        const numeroVuelo = flight.querySelector('.ItinFlight span').textContent.trim();
        const origen = flight.querySelector('.ItinCities span:first-child').getAttribute('title');
        const destino = flight.querySelector('.ItinCities span:nth-child(2)').getAttribute('title');
        const clase = flight.querySelector('.ItinClass').getAttribute('title');
        const duracionVuelo = flight.querySelector('.ItinDuration').textContent.trim();
        const aeronave = flight.querySelector('.ItinEquip').getAttribute('title');
    
        let asientos = [];
        const detallesAsientos = flight.querySelectorAll('.PNRFlightRowDetail > div');
        detallesAsientos.forEach(asientoDetail => {
            const nombrePasajeroElement = asientoDetail.querySelector('.ItinTravelerDetail > div:first-child > div');
            let nombrePasajero = nombrePasajeroElement ? nombrePasajeroElement.textContent.trim() : '';
        
            nombrePasajero = nombrePasajero.replace(/\s*\(PFA\)|\s*\(ADT\)|\s*\(INF\)|\s*\(CNN\)|\s*\(CHD\)/g, '');
        
            const numeroAsientoElement = asientoDetail.querySelector('.bold');
            const numeroAsiento = numeroAsientoElement ? numeroAsientoElement.textContent.trim() : 'Sin Asignar';
        
            const estadoAsientoElement = asientoDetail.querySelector('span:nth-child(3)');
            let estadoAsiento = estadoAsientoElement ? estadoAsientoElement.textContent.trim() : 'Sin Asignar';

            estadoAsiento = estadoAsiento.replace(/, Estado: /g, '');

            asientos.push({ nombrePasajero, numeroAsiento, estadoAsiento });
        });
    
        detallesItinerario.push({fecha, horaSalida, horaLlegada, aerolinea, numeroVuelo, origen, destino, clase, duracionVuelo, aeronave, asientos, equipaje }); // Aquí pasamos el array de equipaje
    });
    
    console.log('Detalles del itinerario:', detallesItinerario);
    
    detallesEticket = [];
    const tickets = document.querySelectorAll('#grid_ticketinfo tbody tr.k-master-row');
    tickets.forEach(ticket =>  {
        let numeroTicket = '';
        try {
            numeroTicket = ticket.querySelector('.tktnumdisplay').textContent.trim();
        } catch (error) {
        }
        
        let estado = '';
        const estadoElement = ticket.querySelector('.tktstatus');
        if (estadoElement) {
            const estadoOriginal = estadoElement.textContent.trim();
            switch (estadoOriginal) {
                case 'Ticketed':
                    estado = 'Confirmado';
                    break;
                case 'Refunded':
                    estado = 'Devuelto';
                    break;
                case 'Voided':
                    estado = 'Cancelado';
                    break;
                case 'Exchanged':
                    estado = 'Remitido';
                    break;
                default:
                    estado = 'Desconocido';
            }
        }
        
        const fechaEmisionElement = ticket.querySelector('td:nth-child(9)');
        const pasajeroElement = ticket.querySelector('td:nth-child(10)');
        
        const fechaEmision = fechaEmisionElement ? fechaEmisionElement.textContent.trim() : '';
        let pasajero = pasajeroElement ? pasajeroElement.textContent.trim() : '';
        
        pasajero = pasajero.replace(/\s*\(PFA\)|\s*\(ADT\)|\s*\(PFA\(ADT\)\)|\s*\(INF\)|\s*\(CNN\)|\s*\(CHD\)/g, '');
        
        detallesEticket.push({ numeroTicket, estado, fechaEmision, pasajero });
    });
    console.log('Detalles del e-ticket:', detallesEticket);

    const eticketHTML = `
    <div id="x_x_x_body-container">
<div align="center">
<div class="R1UVb" has-hovered="true">
<div class="qF8_5">
<span class="ms-Button-flexContainer flexContainer-159" data-automationid="splitbuttonprimary">
</span>
</div>
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="3" cellpadding="0" width="100%"  min-scale="0.6896969696969697">
<tbody>
<tr>
<td>
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%; background:white">
<tbody>
<tr>
<td>
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="3" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td width="70%" style="width:70.0%; padding:11.25pt 11.25pt 11.25pt 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="3" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 15pt 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img width="180px" data-imagetype="External" src="https://jetmar.com.uy/assets/jetmar-logo.svg" id="x_x_x__x0000_i1025"></span></p>
</td>
<td width="90%" valign="top" id="x_x_x_agencyContactInfoCell" style="width:90.0%; padding:0cm 0cm 0cm 0cm; margin-left:15px;">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Jetmar Viajes</span></b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> 
<br aria-hidden="true">Gral. Santander 1970
<br aria-hidden="true">598 2 1793 
</td>
</tr>
</tbody>
</table>
</td>
<td width="30%" valign="top" style="width:30.0%; padding:15.0pt 0cm 0cm 11.25pt">
<h2 style="margin-right:0cm; margin-left:0cm; font-size:18pt; font-family:Calibri,sans-serif">
<span style="font-size:21.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#323C46">Itinerario </span></h2>
</td>
</tr>
</tbody>
</table>
</div>
<p class="x_x_x_MsoNormal" align="center" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; text-align:center" aria-hidden="true">&nbsp;</p>
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="3" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr style="height:5pt">
<td colspan="2" id="x_x_x_topbar-add2cal" style="background:#323C46; padding:0cm 0cm 0cm 0cm; height:5pt">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left">
<tbody>
<tr style="height:5pt">
<td style="padding:0cm 0cm 0cm 0cm; height:5pt">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
</b></p></td></tr>
</tbody>
</table>
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868; display:none">&nbsp;</span></p>
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left">
<tbody>
<tr style="height:5pt">
<td id="x_x_x_topbar-print-preview" style="padding:0cm 0cm 0cm 0cm; height:5pt">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
</b></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td style="padding:0cm 0cm 0cm 0cm">
</td>
<td style="padding:0cm 0cm 0cm 0cm">
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">&nbsp;</span></p>
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" id="x_x_x_static-message" style="width:100.0%; background:white">
<tbody>
<tr>
<td style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Un mensaje de su agente de viajes</span></b>
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> </span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="10" id="x_x_x__x0000_i1026" style="width:.0069in; height:.1041in"></span></p>
</td>
</tr>
<tr>
<td style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
**************************************************&nbsp;
<br aria-hidden="true">Antes de viajar verifique con tiempo los requisitos de&nbsp;documentación y salud&nbsp;
<br aria-hidden="true">en:&nbsp;<a href="http://www.iatatravelcentre.com/%20" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="5">http://www.iatatravelcentre.com/&nbsp;</a>
<a href="http://www.iatatravelcentre.com/%20" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="6">&nbsp;</a>
<br aria-hidden="true">************************************************** </span></p>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>

<!-----Fin cabezal estático----->

<tr>
<td colspan="2" style="padding:15.0pt 0cm 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td style="padding:0cm 0cm 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 4.5pt 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Pasajero/s: </span></p></td>
<td valign="top" style="padding:0cm 4.5pt 0cm 0cm"><p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${detallesViajero.map(viajero => `${viajero.nombre} ${viajero.apellido}`).join('<br> ')}</span></p></td></tr>
</tbody>
</table>
</td>
<td valign="top" style="padding:0cm 4.5pt 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 4.5pt 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Código de reservación: </span></p></td>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${localizadorReserva}</span></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>

<!-----Fin cabezal dinámico----->


${detallesItinerario.map(vuelo => `

<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" id="x_x_x_itinerary-segments" style="width:100.0%">
<tbody><tr style="height:7.5pt">
<td colspan="2" style="padding:0cm 0cm 0cm 0cm; height:7.5pt">
<div class="x_x_x_MsoNormal" align="center" style="margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; margin-right:0cm; margin-bottom:9.0pt; margin-left:0cm; text-align:center">
<hr size="2" width="100%" align="center">
</div>
</td>
</tr>
<tr>
<td width="7%" valign="top" style="width:7.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/icon-air.png" border="0" width="31" height="31" id="x_x_x__x0000_i1028" style="width:.3263in; height:.3263in"></p>
</td>
<td width="93%" valign="top" style="width:93.0%; padding:0cm 0cm 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868; text-transform:uppercase">${vuelo.aerolinea}</span></b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> Número de vuelo </span><b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4">${vuelo.numeroVuelo}</span></b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"><br aria-hidden="true">
<span style="text-transform:uppercase">${detallesEticket[0].estado}</span>, Confirmación#&nbsp;${localizadorReserva} </span></p>
</td>
<td valign="top" style="padding:0cm 0cm 0cm 7.5pt">
<p class="x_x_x_MsoNormal" align="right" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; text-align:right"><strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868; text-transform:uppercase">${vuelo.fecha}</span></strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"></span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:15.0pt 0cm 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%"><tbody><tr>
<td width="20%" valign="top" style="width:20.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Salida:</span></strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> </span></p>
</td>
<td width="80%" valign="top" style="width:80.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4; text-transform:uppercase">${vuelo.origen}</span>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4"> <br aria-hidden="true">${vuelo.horaSalida} </span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="20" id="x_x_x__x0000_i1029" style="width:.0069in; height:.2083in"></span></p></td>
</tr>
<tr>
<td width="20%" valign="top" style="width:20.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Llegada:</span></strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> </span></p>
</td>
<td width="80%" valign="top" style="width:80.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4; text-transform:uppercase">${vuelo.destino}</span>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4"> <br aria-hidden="true">${vuelo.horaLlegada} </span></p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm"><p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="20" id="x_x_x__x0000_i1030" style="width:.0069in; height:.2083in"></span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm"><p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Verifique el horario de vuelo antes de la salida </span></p></td></tr><tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="20" id="x_x_x__x0000_i1031" style="width:.0069in; height:.2083in"></span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm"><div align="center"><table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td width="50%" valign="top" style="width:50.0%; padding:0cm 0cm 0cm 0cm">
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Cabina:</span></p>
</td>
<td valign="bottom" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${vuelo.clase} </span></p>
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"><br aria-hidden="true"><br aria-hidden="true"></span></p>
</td>
</tr>
</tbody>
</table>
</div>
</td>
<td width="50%" valign="top" style="width:50.0%; padding:0cm 0cm 0cm 0cm"><div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Duración:</span></p>
</td>
<td valign="bottom" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${vuelo.duracionVuelo}</span></p></td></tr><tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
</td>
</tr>
<tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Aeronave:</span></p>
</td>
<td valign="bottom" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt"><span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${vuelo.aeronave}</span></p></td></tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="10" id="x_x_x__x0000_i1032" style="width:.0069in; height:.1041in"></span></p>
</td>
</tr>

<!-----Detalle de asientos----->


<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td width="50%" valign="top" style="width:50.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
${vuelo.asientos.map(asiento => `
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868;padding-bottom:3px;">
<b>${asiento.nombrePasajero}</b> / Asiento: ${asiento.numeroAsiento} / Estado: ${asiento.estadoAsiento}</span>`).join('<br>')}

</p>
</td> 
<td width="50%" valign="top" style="width:50.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"></span>
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">&nbsp; </span>
</p>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
</tbody>
</table>
</div> `).join('')}
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="height:7.5pt"><td colspan="2" style="padding:0cm 0cm 0cm 0cm; height:7.5pt">
<div class="x_x_x_MsoNormal" align="center" style="margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; margin-right:0cm; margin-bottom:9.0pt; margin-left:0cm; text-align:center">
<hr size="2" width="100%" align="center">
</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
<table align="center" width="100%" class="ticketDetail" style="font-size: 12px;font-family:Arial,Helvetica,sans-serif;color:#686868;">
<tbody>
<tr>
<th style="padding-right:10px;">
<strong>Pasajero</strong>
</th>
<th style="padding-right:10px;">
<strong>Número de ticket</strong>
</th>
<th style="padding-right:10px;">
<strong>Estado del ticket</strong>
</th>
<th style="padding-right:10px;">
<strong>Fecha de emisión</strong>
</th>
</tr>
${detallesEticket.map(ticket => `

<tr align="center">
<td><span id="paxTkt"> ${ticket.pasajero}</span></td>
<td><span id="nroTkt">${ticket.numeroTicket}</span></td>
<td><span id="tktStatus">${ticket.estado}</span></td>
<td><span id="issueDate">${ticket.fechaEmision}</span></td>
</tr>
`).join('')}
</tbody>
</table>
</div>
</div>
</div>
    `;

    abrirETicket(eticketHTML);
    
}

function abrirETicket(eticketHTML) {
    const ventanaETicket = window.open('', '_blank');
    ventanaETicket.document.write(eticketHTML);
    ventanaETicket.document.title = 'E-ticket Jetmar Viajes';
    const iconoURL = '/icon.ico';
    
    const icono = ventanaETicket.document.createElement('link');
    icono.setAttribute('rel', 'icon');
    icono.setAttribute('type', 'image/x-icon');
    icono.setAttribute('href', iconoURL);
    ventanaETicket.document.head.appendChild(icono);
}

function capturarDatosItinerario() {
    const localizadorReservaElemento = document.getElementById('lnkRecordLocator');
    localizadorReserva = localizadorReservaElemento ? localizadorReservaElemento.textContent.trim() : '';    
    console.log('Localizador de reserva:', localizadorReserva);

    detallesViajero = [];
    const viajeros = document.querySelectorAll('#Traveler tbody tr.k-master-row');
    viajeros.forEach(viajero => {
        const nombreElemento = viajero.querySelector('td:nth-child(7)');
        const apellidoElemento = viajero.querySelector('td:nth-child(9)');
        const tipoElemento = viajero.querySelector('td:nth-child(5)');
        const numeroFFElemento = viajero.querySelector('td:nth-child(12)');
        const asientoElemento = viajero.querySelector('td:nth-child(13)');
        const bebeElemento = viajero.querySelector('td:nth-child(11)');

        const nombre = nombreElemento ? nombreElemento.textContent.trim() : '';
        const apellido = apellidoElemento ? apellidoElemento.textContent.trim() : '';
        const tipo = tipoElemento ? tipoElemento.textContent.trim() : '';
        const numeroFF = numeroFFElemento ? numeroFFElemento.textContent.trim() || 'No tiene': '';
        const asiento = asientoElemento ? asientoElemento.textContent.trim() || 'Sin asignar' : 'Sin asignar';
        const tipoPasajero = obtenerTipoPasajero(tipo);
        const bebe = bebeElemento ? bebeElemento.textContent.trim() : '';

        detallesViajero.push({ nombre, apellido, tipoPasajero, numeroFF, asiento, bebe });
    });
    console.log('Detalles del viajero:', detallesViajero);

    detallesItinerario = [];
    const flights = document.querySelectorAll('#booked_segments .PNRFlightRow');
    
    flights.forEach(flight => {
        const equipaje = [];
        const equipajeElements = flight.querySelectorAll('#tbDroppable tr[droppable="Y"]');
        equipajeElements.forEach(franquiciaElement => {
            const franquiciaInput = franquiciaElement.querySelector('td:nth-child(15) input#ctl00_cphMain_rptTravelerGroup_ctl00_rptFlight_ctl01_txtBaggage');
            const franquiciaValue = franquiciaInput ? franquiciaInput.value : 'No se encontró el elemento de equipaje';
            console.log('Valor del equipaje:', franquiciaValue);
            equipaje.push(franquiciaValue);
        });
    
        const fecha = flight.querySelector('.ItinDates div:first-child').textContent.trim();
        const horaSalida = flight.querySelector('.ItinDates div:nth-child(2) span:first-child').textContent.trim();
        const horaLlegada = flight.querySelector('.ItinDates div:nth-child(2) span:nth-child(3)').textContent.trim();
        const aerolinea = flight.querySelector('.ItinLogo img').getAttribute('title');
        const numeroVuelo = flight.querySelector('.ItinFlight span').textContent.trim();
        const origen = flight.querySelector('.ItinCities span:first-child').getAttribute('title');
        const destino = flight.querySelector('.ItinCities span:nth-child(2)').getAttribute('title');
        const clase = flight.querySelector('.ItinClass').getAttribute('title');
        const duracionVuelo = flight.querySelector('.ItinDuration').textContent.trim();
        const aeronave = flight.querySelector('.ItinEquip').getAttribute('title');
        const tarifaElement = flight.querySelector('.ItinFare');
        let tarifa = '';
    
        if (tarifaElement) {
            const tarifaText = tarifaElement.getAttribute('onmouseover');
            const match = tarifaText.match(/(\d+\.\d+)\s+\(USD\)/);
    
            if (match && match.length > 1) {
                const tarifaValue = match[1];
                tarifa = `USD ${tarifaValue}`;
            }
        }
    
        let asientos = [];
        const detallesAsientos = flight.querySelectorAll('.PNRFlightRowDetail > div');
        detallesAsientos.forEach(asientoDetail => {
            const nombrePasajeroElement = asientoDetail.querySelector('.ItinTravelerDetail > div:first-child > div');
            let nombrePasajero = nombrePasajeroElement ? nombrePasajeroElement.textContent.trim() : '';
        
            nombrePasajero = nombrePasajero.replace(/\s*\(PFA\)|\s*\(ADT\)|\s*\(INF\)|\s*\(CNN\)|\s*\(CHD\)/g, '');
        
            const numeroAsientoElement = asientoDetail.querySelector('.bold');
            const numeroAsiento = numeroAsientoElement ? numeroAsientoElement.textContent.trim() : 'Sin Asignar';
        
            const estadoAsientoElement = asientoDetail.querySelector('span:nth-child(3)');
            let estadoAsiento = estadoAsientoElement ? estadoAsientoElement.textContent.trim() : 'Sin Asignar';

            estadoAsiento = estadoAsiento.replace(/, Estado: /g, '');

            asientos.push({ nombrePasajero, numeroAsiento, estadoAsiento });
        });
    
        detallesItinerario.push({tarifa,fecha, horaSalida, horaLlegada, aerolinea, numeroVuelo, origen, destino, clase, duracionVuelo, aeronave, asientos, equipaje }); // Aquí pasamos el array de equipaje
    });
    
    console.log('Detalles del itinerario:', detallesItinerario);
    const eticketHTML = `
    <div id="x_x_x_body-container">
<div align="center">
<div class="R1UVb" has-hovered="true">
<div class="qF8_5">
<span class="ms-Button-flexContainer flexContainer-159" data-automationid="splitbuttonprimary">
</span>
</div>
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="3" cellpadding="0" width="100%"  min-scale="0.6896969696969697">
<tbody>
<tr>
<td>
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%; background:white">
<tbody>
<tr>
<td>
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="3" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td width="70%" style="width:70.0%; padding:11.25pt 11.25pt 11.25pt 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="3" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 15pt 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img width="180px" data-imagetype="External" src="https://jetmar.com.uy/assets/jetmar-logo.svg" id="x_x_x__x0000_i1025"></span></p>
</td>
<td width="90%" valign="top" id="x_x_x_agencyContactInfoCell" style="width:90.0%; padding:0cm 0cm 0cm 0cm; margin-left:15px;">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Jetmar Viajes</span></b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> 
<br aria-hidden="true">Gral. Santander 1970 
<br aria-hidden="true">598 2 1793 
</td>
</tr>
</tbody>
</table>
</td>
<td width="30%" valign="top" style="width:30.0%; padding:15.0pt 0cm 0cm 11.25pt">
<h2 style="margin-right:0cm; margin-left:0cm; font-size:18pt; font-family:Calibri,sans-serif">
<span style="font-size:21.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#323C46">Itinerario </span></h2>
</td>
</tr>
</tbody>
</table>
</div>
<p class="x_x_x_MsoNormal" align="center" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; text-align:center" aria-hidden="true">&nbsp;</p>
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="3" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr style="height:5pt">
<td colspan="2" id="x_x_x_topbar-add2cal" style="background:#323C46; padding:0cm 0cm 0cm 0cm; height:5pt">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left">
<tbody>
<tr style="height:5pt">
<td style="padding:0cm 0cm 0cm 0cm; height:5pt">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
</b></p></td></tr>
</tbody>
</table>
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868; display:none">&nbsp;</span></p>
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left">
<tbody>
<tr style="height:5pt">
<td id="x_x_x_topbar-print-preview" style="padding:0cm 0cm 0cm 0cm; height:5pt">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
</b></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td style="padding:0cm 0cm 0cm 0cm">
</td>
<td style="padding:0cm 0cm 0cm 0cm">
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">&nbsp;</span></p>
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" id="x_x_x_static-message" style="width:100.0%; background:white">
<tbody>
<tr>
<td style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Un mensaje de su agente de viajes</span></b>
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> </span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="10" id="x_x_x__x0000_i1026" style="width:.0069in; height:.1041in"></span></p>
</td>
</tr>
<tr>
<td style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
**************************************************&nbsp;
<br aria-hidden="true">Antes de viajar verifique con tiempo los requisitos de&nbsp;documentación y salud&nbsp;
<br aria-hidden="true">en:&nbsp;<a href="http://www.iatatravelcentre.com/%20" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="5">http://www.iatatravelcentre.com/&nbsp;</a>
<a href="http://www.iatatravelcentre.com/%20" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="6">&nbsp;</a>
<br aria-hidden="true">************************************************** </span></p>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>

<!-----Fin cabezal estático----->

<tr>
<td colspan="2" style="padding:15.0pt 0cm 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td style="padding:0cm 0cm 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 4.5pt 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Pasajero/s: </span></p></td>
<td valign="top" style="padding:0cm 4.5pt 0cm 0cm"><p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${detallesViajero.map(viajero => `${viajero.nombre} ${viajero.apellido}`).join('<br> ')}</span></p></td></tr>
</tbody>
</table>
</td>
<td valign="top" style="padding:0cm 4.5pt 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 4.5pt 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Código de reservación: </span></p></td>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${localizadorReserva}</span></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>

<!-----Fin cabezal dinámico----->


${detallesItinerario.map(vuelo => `

<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" id="x_x_x_itinerary-segments" style="width:100.0%">
<tbody><tr style="height:7.5pt">
<td colspan="2" style="padding:0cm 0cm 0cm 0cm; height:7.5pt">
<div class="x_x_x_MsoNormal" align="center" style="margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; margin-right:0cm; margin-bottom:9.0pt; margin-left:0cm; text-align:center">
<hr size="2" width="100%" align="center">
</div>
</td>
</tr>
<tr>
<td width="7%" valign="top" style="width:7.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/icon-air.png" border="0" width="31" height="31" id="x_x_x__x0000_i1028" style="width:.3263in; height:.3263in"></p>
</td>
<td width="93%" valign="top" style="width:93.0%; padding:0cm 0cm 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868; text-transform:uppercase">${vuelo.aerolinea}</span></b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> Número de vuelo </span><b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4">${vuelo.numeroVuelo}</span></b>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"><br aria-hidden="true">
<span style="text-transform:uppercase">RESERVADO</span>, Confirmación#&nbsp;${localizadorReserva} </span></p>
</td>
<td valign="top" style="padding:0cm 0cm 0cm 7.5pt">
<p class="x_x_x_MsoNormal" align="right" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; text-align:right"><strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868; text-transform:uppercase">${vuelo.fecha}</span></strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"></span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:15.0pt 0cm 0cm 0cm">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%"><tbody><tr>
<td width="20%" valign="top" style="width:20.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Salida:</span></strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> </span></p>
</td>
<td width="80%" valign="top" style="width:80.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4; text-transform:uppercase">${vuelo.origen}</span>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4"> <br aria-hidden="true">${vuelo.horaSalida} </span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="20" id="x_x_x__x0000_i1029" style="width:.0069in; height:.2083in"></span></p></td>
</tr>
<tr>
<td width="20%" valign="top" style="width:20.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Llegada:</span></strong>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"> </span></p>
</td>
<td width="80%" valign="top" style="width:80.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4; text-transform:uppercase">${vuelo.destino}</span>
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#2E6BA4"> <br aria-hidden="true">${vuelo.horaLlegada} </span></p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm"><p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="20" id="x_x_x__x0000_i1030" style="width:.0069in; height:.2083in"></span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm"><p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif"><span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Verifique el horario de vuelo antes de la salida </span></p></td></tr><tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="20" id="x_x_x__x0000_i1031" style="width:.0069in; height:.2083in"></span></p>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm"><div align="center"><table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td width="50%" valign="top" style="width:50.0%; padding:0cm 0cm 0cm 0cm">
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Cabina:</span></p>
</td>
<td valign="bottom" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${vuelo.clase} </span></p>
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"><br aria-hidden="true"><br aria-hidden="true"></span></p>
</td>
</tr>
</tbody>
</table>
</div>
</td>
<td width="50%" valign="top" style="width:50.0%; padding:0cm 0cm 0cm 0cm"><div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Duración:</span></p>
</td>
<td valign="bottom" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${vuelo.duracionVuelo}</span></p></td></tr><tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
</td>
</tr>
<tr>
<td valign="top" style="padding:0cm 0cm 0cm 0cm">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">Aeronave:</span></p>
</td>
<td valign="bottom" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt"><span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">${vuelo.aeronave}</span></p></td></tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif">
<span style="font-size:10.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">
<img data-imagetype="External" src="https://documents.sabre.com/static/images/tc/mail/spacer.gif" border="0" width="1" height="10" id="x_x_x__x0000_i1032" style="width:.0069in; height:.1041in"></span></p>
</td>
</tr>

<!-----Detalle de asientos----->


<tr>
<td colspan="2" style="padding:0cm 0cm 0cm 0cm">
<div align="center">
<table class="x_x_x_MsoNormalTable" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100.0%">
<tbody>
<tr>
<td width="50%" valign="top" style="width:50.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
${vuelo.asientos.map(asiento => `
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868;padding-bottom:3px;">
<b>${asiento.nombrePasajero}</b> / Asiento: ${asiento.numeroAsiento} / Estado: ${asiento.estadoAsiento}</span>`).join('<br>')}

</p>
</td> 
<td width="50%" valign="top" style="width:50.0%; padding:0cm 0cm 0cm 0cm">
<p class="x_x_x_MsoNormal" style="margin-top:0px; margin-bottom:0px; margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; line-height:13.5pt">
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868"></span>
<span style="font-size:9.0pt; font-family:&quot;Arial&quot;,sans-serif; color:#686868">&nbsp; </span>
</p>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
</tbody>
</table>
</div> `).join('')}
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="height:7.5pt"><td colspan="2" style="padding:0cm 0cm 0cm 0cm; height:7.5pt">
<div class="x_x_x_MsoNormal" align="center" style="margin:0cm 0cm 0.0001pt; font-size:11pt; font-family:Calibri,sans-serif; margin-right:0cm; margin-bottom:9.0pt; margin-left:0cm; text-align:center">
<hr size="2" width="100%" align="center">
</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</div>
</div>
</div>
    `;

    abrirETicket(eticketHTML);
    
}

function abrirETicket(eticketHTML) {
    const ventanaETicket = window.open('', '_blank');
    ventanaETicket.document.write(eticketHTML);
    ventanaETicket.document.title = 'Itinerario Jetmar Viajes';
    const iconoURL = '/icon.ico';

    const icono = ventanaETicket.document.createElement('link');
    icono.setAttribute('rel', 'icon');
    icono.setAttribute('type', 'image/x-icon');
    icono.setAttribute('href', iconoURL);
    ventanaETicket.document.head.appendChild(icono);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "capturarDatosEncole") {
        capturarDatosEncole()
            .then((data) => {
                console.log("Datos capturados en content.js:", data.localizadorReserva, data.detallesViajero, data.detallesTarifa, data.detallesItinerario, data.tarifa, data.detallePrecio, data.pasajerosPorTipo);
                if (data.localizadorReserva && data.detallesTarifa && data.detallesItinerario && data.tarifa && data.detallePrecio && data.detallesViajero && data.pasajerosPorTipo) {
                    sendResponse({ 
                        success: true,
                        localizadorReserva: data.localizadorReserva,
                        detallesTarifa: data.detallesTarifa,
                        detallesItinerario: data.detallesItinerario,
                        tarifa: data.tarifa,
                        detallePrecio: data.detallePrecio,
                        detallesViajero: data.detallesViajero,
                        pasajerosPorTipo: data.pasajerosPorTipo
                    });
                } else {
                    console.error("Error al capturar datos en content.js: algunos datos están vacíos");
                    sendResponse({ success: false, error: "Algunos datos están vacíos" });
                }
            })
            .catch(error => {
                console.error("Error al capturar datos en content.js:", error);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "capturarDatosItinerario") {
        capturarDatosItinerario();
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "capturarDatosEticket") {
        capturarDatosEticket();
    }
});

function capturarDatosEncole() {
    return new Promise((resolve, reject) => {
        try {
            const localizadorReservaElemento = document.getElementById('lnkRecordLocator');
            localizadorReserva = localizadorReservaElemento ? localizadorReservaElemento.textContent.trim() : '';
            console.log('Localizador de reserva:', localizadorReserva);

            const detallesTarifa = [];

            let detallePrecio = [];
            
            const iframe = document.querySelector('#iframewindow iframe');
            console.log('Detalles iframe:', iframe);
            
            if (iframe && iframe.contentDocument.readyState === 'complete') {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                console.log('Detalles iframeDocument:', iframeDocument);
            
                   

                const vuelos = iframeDocument.querySelectorAll('.formtable.DivManualPricing table.flights tbody tr[droppable="Y"]');
            
                vuelos.forEach(vuelo => {
                    const estadoBillete = vuelo.querySelector('td:nth-child(10)').textContent.trim();
                    const salida = vuelo.querySelector('td:nth-child(3)').textContent.trim();
                    const llegada = vuelo.querySelector('td:nth-child(4)').textContent.trim();
                    const lineaAerea = vuelo.querySelector('td:nth-child(5)').textContent.trim();
                    const numeroVuelo = vuelo.querySelector('td:nth-child(6)').textContent.trim();
                    const clase = vuelo.querySelector('td:nth-child(7)').textContent.trim();
                    const fechaViaje = vuelo.querySelector('td:nth-child(8)').textContent.trim();
                    const horaSalida = vuelo.querySelector('td:nth-child(9)').textContent.trim();
                    const codigoBaseTarifa = vuelo.querySelector('td:nth-child(11) input').value.trim();
                    const codigoIdentificacion = vuelo.querySelector('td:nth-child(12) input').value.trim() || '';
                    const equipaje = vuelo.querySelector('td:nth-child(15) input').value.trim();


            
                    detallesTarifa.push({
                        estadoBillete,
                        equipaje,
                        salida,
                        llegada,
                        lineaAerea,
                        numeroVuelo,
                        clase,
                        fechaViaje,
                        horaSalida,
                        codigoBaseTarifa,
                        codigoIdentificacion,
                    });
                });

        
                const idAgenteElemento = iframeDocument.querySelector('#ctl00_cphMain_txtAgentID');
                const idAgente = idAgenteElemento ? idAgenteElemento.value.trim() : '';
        
                const vencimientoReservaElemento = iframeDocument.querySelector('table[border="0"] td:nth-child(6)');
                const vencimientoReserva = vencimientoReservaElemento ? vencimientoReservaElemento.textContent.trim() : '';
        
                const tarifaBaseElemento = iframeDocument.querySelector('table.flights input[name$="txtFareAmt"]');
                const tarifaBase = tarifaBaseElemento ? tarifaBaseElemento.value.trim() : '';
        
                const impuestosElemento = iframeDocument.querySelector('table.flights input[name$="txtTaxAmt"]');
                const impuestos = impuestosElemento ? impuestosElemento.value.trim() : '';
        
                const tarifaFinalElemento = iframeDocument.querySelector('table.flights input[name$="txtTotalAmt"]');
                const tarifaFinal = tarifaFinalElemento ? tarifaFinalElemento.value.trim() : '';
        
                const calculoTarifarioElemento = iframeDocument.querySelector('textarea[name$="txtFareCalc"]');
                calculoTarifario = calculoTarifarioElemento ? calculoTarifarioElemento.value.trim() : '';

        
                detallePrecio.push({
                    idAgente,
                    vencimientoReserva,
                    tarifaBase,
                    impuestos,
                    calculoTarifario,
                    tarifaFinal,
                    
                    
                });
                console.log('Detalles de la tarifa:', detallesTarifa);
                console.log('Detalle de precio:', detallePrecio);

            } else {
                console.error('El iframe no está completamente cargado o no se encontró.');
            }

            
            
            detallesViajero = [];
            const pasajeros = document.querySelectorAll('#Traveler tbody tr.k-master-row');
            pasajeros.forEach(pasajero => {
                const nombreElemento = pasajero.querySelector('td:nth-child(7)');
                const apellidoElemento = pasajero.querySelector('td:nth-child(9)');
                const tipoElemento = pasajero.querySelector('td:nth-child(5)');
                const numeroFFElemento = pasajero.querySelector('td:nth-child(12)');
                const asientoElemento = pasajero.querySelector('td:nth-child(13)');
                const bebeElemento = pasajero.querySelector('td:nth-child(11)');
        
                const nombre = nombreElemento ? nombreElemento.textContent.trim() : '';
                const apellido = apellidoElemento ? apellidoElemento.textContent.trim() : '';
                const tipo = tipoElemento ? tipoElemento.textContent.trim() : '';
                const numeroFF = numeroFFElemento ? numeroFFElemento.textContent.trim() || 'No tiene': '';
                const asiento = asientoElemento ? asientoElemento.textContent.trim() || 'Sin asignar' : 'Sin asignar';
                const tipoPasajero = obtenerTipoPasajero(tipo);
                const bebe = bebeElemento ? bebeElemento.textContent.trim() : '';

                detallesViajero.push({ nombre, apellido, tipoPasajero, numeroFF, asiento, bebe });
            });
            console.log('Detalles del viajero:', detallesViajero);
            
            detallesItinerario = [];
            const flights = document.querySelectorAll('#booked_segments .PNRFlightRow');

            let tarifaUnica = '';

            flights.forEach(flight => {
                const equipaje = [];
                const equipajeElements = flight.querySelectorAll('#tbDroppable tr[droppable="Y"]');
                equipajeElements.forEach(franquiciaElement => {
                    const franquiciaInput = franquiciaElement.querySelector('td:nth-child(15) input#ctl00_cphMain_rptTravelerGroup_ctl00_rptFlight_ctl01_txtBaggage');
                    const franquiciaValue = franquiciaInput ? franquiciaInput.value : 'No se encontró el elemento de equipaje';
                    console.log('Valor del equipaje:', franquiciaValue);
                    equipaje.push(franquiciaValue);
                });

                const fecha = flight.querySelector('.ItinDates div:first-child').textContent.trim();
                const horaSalida = flight.querySelector('.ItinDates div:nth-child(2) span:first-child').textContent.trim();
                const horaLlegada = flight.querySelector('.ItinDates div:nth-child(2) span:nth-child(3)').textContent.trim();
                const aerolinea = flight.querySelector('.ItinLogo img').getAttribute('title');
                const numeroVuelo = flight.querySelector('.ItinFlight span').textContent.trim();
                const origen = flight.querySelector('.ItinCities span:first-child').textContent.trim();
                const destino = flight.querySelector('.ItinCities span:nth-child(2)').textContent.trim();
                const clase = flight.querySelector('.ItinClass').getAttribute('title');
                const duracionVuelo = flight.querySelector('.ItinDuration').textContent.trim();
                const aeronave = flight.querySelector('.ItinEquip').getAttribute('title');
                const tarifaElement = flight.querySelector('.ItinFare');
                if (tarifaElement) {
                    const tarifaText = tarifaElement.getAttribute('onmouseover');
                    const match = tarifaText.match(/(\d+\.\d+)\s+\(USD\)/);
                    if (match && match.length > 1) {
                        const tarifaValue = match[1];
                        tarifaUnica = `USD ${tarifaValue}`;
                    }
                }

                let asientos = [];
                const detallesAsientos = flight.querySelectorAll('.PNRFlightRowDetail > div');
                detallesAsientos.forEach(asientoDetail => {
                    const nombrePasajeroElement = asientoDetail.querySelector('.ItinTravelerDetail > div:first-child > div');
                    let nombrePasajero = nombrePasajeroElement ? nombrePasajeroElement.textContent.trim() : '';

                    nombrePasajero = nombrePasajero.replace(/\s*\(PFA\)|\s*\(ADT\)|\s*\(INF\)|\s*\(CNN\)|\s*\(CHD\)/g, '');

                    const numeroAsientoElement = asientoDetail.querySelector('.bold');
                    const numeroAsiento = numeroAsientoElement ? numeroAsientoElement.textContent.trim() : 'Sin Asignar';

                    const estadoAsientoElement = asientoDetail.querySelector('span:nth-child(3)');
                    let estadoAsiento = estadoAsientoElement ? estadoAsientoElement.textContent.trim() : 'Sin Asignar';

                    estadoAsiento = estadoAsiento.replace(/, Estado: /g, '');

                    asientos.push({ nombrePasajero, numeroAsiento, estadoAsiento });
                });

                detallesItinerario.push({ tarifa: tarifaUnica, fecha, horaSalida, horaLlegada, aerolinea, numeroVuelo, origen, destino, clase, duracionVuelo, aeronave, asientos, equipaje }); // Aquí pasamos el array de equipaje
            });

            console.log('Detalles del itinerario:', detallesItinerario);



            function obtenerPasajerosPorTipo(detallesTarifa, detallesViajero) {
                const tiposPasajeroUnicos = new Set(); 
            
                detallesTarifa.forEach(detalle => {
                    const codigoBaseTarifa = detalle.codigoBaseTarifa;
                    let tipoPasajero = '';
            
                    if (codigoBaseTarifa.length === 8) {
                        tipoPasajero = 'Adulto';
                    } else if (codigoBaseTarifa.length === 10) {
                        const ultimosDosCaracteres = codigoBaseTarifa.slice(-2);
                        if (ultimosDosCaracteres === 'CH') {
                            tipoPasajero = 'Niño';
                        } else if (ultimosDosCaracteres === 'IN') {
                            tipoPasajero = 'Bebé';
                        }
                    }
            
                    if (tipoPasajero !== '') {
                        tiposPasajeroUnicos.add(tipoPasajero); 
                    }
                });
            
                const pasajerosPorTipo = {
                    'Adulto': [],
                    'Niño': [],
                    'Bebé': []
                };
            
                
                detallesViajero.forEach(viajero => {
                    if (tiposPasajeroUnicos.has(viajero.tipoPasajero)) {
                        pasajerosPorTipo[viajero.tipoPasajero].push(viajero);
                    }
                });
            
                return Object.values(pasajerosPorTipo);
            }
            
            const pasajerosPorTipo = obtenerPasajerosPorTipo(detallesTarifa, detallesViajero);
            console.log('Pasajeros por tipo:', pasajerosPorTipo);

            const detalles = {
                localizadorReserva: localizadorReserva,
                detallesTarifa: detallesTarifa,
                detallesItinerario: detallesItinerario,
                tarifa: tarifaUnica,
                detallePrecio: detallePrecio,
                detallesViajero: detallesViajero,
                pasajerosPorTipo: pasajerosPorTipo
            };

            console.log('Detalles:', detalles); 

            
            resolve(detalles);
        } catch (error) {
            reject(error);
        }
    });
}

