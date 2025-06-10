

document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menuButton');
    const menuDropdown = document.getElementById('menuDropdown');
    const downIcon = document.getElementById('downIcon');
    const rightIcon = document.getElementById('rightIcon');

    const menuButtonSrv = document.getElementById('menuButtonSrv');
    const menuDropdownSrv = document.getElementById('menuDropdownSrv');
    const downIconSrv = document.getElementById('downIconSrv');
    const rightIconSrv = document.getElementById('rightIconSrv');
  
    menuButton.addEventListener('click', function () {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      
      menuButton.setAttribute('aria-expanded', !isExpanded);
      menuDropdown.classList.toggle('hidden');
  
      if (!isExpanded) {
        menuDropdown.classList.remove('opacity-0', 'translate-y-1');
        menuDropdown.classList.add('opacity-100', 'translate-y-0', 'transition', 'ease-out', 'duration-200');
        downIcon.classList.remove('hidden');
        rightIcon.classList.add('hidden');
      } else {
        menuDropdown.classList.remove('opacity-100', 'translate-y-0');
        menuDropdown.classList.add('opacity-0', 'translate-y-1', 'transition', 'ease-in', 'duration-150');
        downIcon.classList.add('hidden');
        rightIcon.classList.remove('hidden');
      }
    });
  
    menuButtonSrv.addEventListener('click', function () {
      const isExpanded = menuButtonSrv.getAttribute('aria-expanded') === 'true';
      
      menuButtonSrv.setAttribute('aria-expanded', !isExpanded);
      menuDropdownSrv.classList.toggle('hidden');
  
      if (!isExpanded) {
        menuDropdownSrv.classList.remove('opacity-0', 'translate-y-1');
        menuDropdownSrv.classList.add('opacity-100', 'translate-y-0', 'transition', 'ease-out', 'duration-200');
        downIconSrv.classList.remove('hidden');
        rightIconSrv.classList.add('hidden');
      } else {
        menuDropdownSrv.classList.remove('opacity-100', 'translate-y-0');
        menuDropdownSrv.classList.add('opacity-0', 'translate-y-1', 'transition', 'ease-in', 'duration-150');
        downIconSrv.classList.add('hidden');
        rightIconSrv.classList.remove('hidden');
      }
    });
  
    document.addEventListener('click', function (event) {
      if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuDropdown.classList.add('hidden');
        downIcon.classList.add('hidden');
        rightIcon.classList.remove('hidden');
      }
      if (!menuButtonSrv.contains(event.target) && !menuDropdownSrv.contains(event.target)) {
        menuButtonSrv.setAttribute('aria-expanded', 'false');
        menuDropdownSrv.classList.add('hidden');
        downIconSrv.classList.add('hidden');
        rightIconSrv.classList.remove('hidden');
      }
    });
});


function hideElements() {
    document.querySelectorAll('.container button').forEach(function (button) {
        if (button) {
            button.style.display = 'none';
        }
    });
    document.querySelectorAll('.container ').forEach(function (h1) {
        h1.style.display = 'none';
    });
    document.getElementById('reserva-info').style.display = 'none';
}

function showElements() {
    document.querySelectorAll('.container button').forEach(function (button) {
        if (button) {
            if (isAuthenticated) {
                if (button.id === 'login-button') {
                    button.style.display = 'none';
                } else {
                    button.style.display = 'block';
                }
            } else {
                button.style.display = 'block';
            }
        }
    });
    document.querySelectorAll('.container h1').forEach(function (h1) {
        h1.style.display = 'block';
    });
    document.getElementById('reserva-info').style.display = 'block';
}



document.getElementById('generar-eticket').addEventListener('click', function () {
    console.log('Generando eticket.');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "capturarDatosEticket" });
    });
});

document.getElementById('generar-itinerario').addEventListener('click', function () {
    console.log('Generando itinerario.');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "capturarDatosItinerario" });
    });
});

document.getElementById('generar-chanchito').addEventListener('click', function() {
    const width = 1000;
    const height = 800;
    const left = 5000;
    const top = 500;
    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
    
    window.open('/index.html', 'popupWindow', features);
});

document.getElementById('open-chatbot').addEventListener('click', function() {
    const width = 430;
    const height = 560;
    const left = 5000;
    const top = 500;
    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
    
    window.open('/iframe.html', 'popupWindow', features);
});

document.getElementById('transacciones').addEventListener('click', function() {
    const width = 1000;
    const height = 800;
    const left = 5000;
    const top = 500;
    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
    
    window.open('/gdsCompare.html', 'popupWindow', features);
});

// document.getElementById('gwc-form-button').addEventListener('click', function() {
//    const width = 620;
//    const height = 850;
//    const left = 5000;
//    const top = 500;
//    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;

//    window.open('iframe-forms.html', 'popupWindow', features);
    
//});




async function obtenerTokenDeAcceso() {
    const url = 'https://login.microsoftonline.com/6d821791-4b77-4dfb-938d-9e50055af978/oauth2/v2.0/token';
    const clienteId = '52dd6a9e-0ef7-4f2b-b8bd-1366aae25112';
    const clienteSecret = '29aa0d16-5fb2-4379-9c7d-fabd49931288';
    const scope = 'https://graph.microsoft.com/.default';

    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clienteId);
    formData.append('client_secret', clienteSecret);
    formData.append('scope', scope);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formData
        });

        const data = await response.json();
        const accessToken = data.access_token;
        return accessToken;
    } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
        return null;
    }
}
async function enviarDatosAFlujoPowerAutomate(localizadorReserva, tarifa, nroFicha, detallesTarifa, detallePrecio, pasajerosPorTipo, emailVendedor, formaDePago) {
    const datos = {
        localizadorReserva: localizadorReserva,
        tarifa: tarifa,
        nroFicha: nroFicha,
        detallesTarifa: detallesTarifa,
        detallePrecio: detallePrecio,
        pasajerosPorTipo: pasajerosPorTipo,
        emailVendedor: emailVendedor,
        formaDePago: formaDePago


    };

    try {
        const response = await fetch('https://prod-139.westus.logic.azure.com:443/workflows/6d2b2897d0094edf8bcf4873f064758b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lbWPbX41kymT7lcMMpQgUElimG2OHnimtO7BRLbvpFg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (response.ok) {

            Swal.fire({
                icon: "success",
                title: "Reserva encolada con éxito",
                showConfirmButton: false,
                timer: 1500
            });

            setTimeout(function () {
                window.close();
            }, 1600);
    
            console.log('Datos enviados al flujo de Power Automate correctamente.');
        } else {
            Swal.fire({
                icon: "error",
                title: "Error al encolar reserva",
                text: (response.statusText),
                showConfirmButton: false,
                timer: 1500
              });
              setTimeout(function () {
                window.close();
            }, 1600);
            console.error('Error al enviar los datos al flujo de Power Automate:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar los datos al flujo de Power Automate:', error);
    }
}


