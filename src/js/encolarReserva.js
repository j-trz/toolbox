document.getElementById('encolar-reserva').addEventListener('click', function () {
    console.log('Encolando reserva.');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "capturarDatosEncole" }, function (response) {
            console.log("Datos recibidos desde content.js:", response);
            if (response && response.success) {
                const localizadorReserva = response.localizadorReserva;
                const detallesItinerario = response.detallesItinerario;
                const tarifa = response.tarifa;
                const detallesTarifa = response.detallesTarifa;
                const detallePrecio = response.detallePrecio;
                const pasajerosPorTipo = response.pasajerosPorTipo;

                hideElements();

                console.log('Datos recibidos:', localizadorReserva, detallesItinerario, tarifa, detallesTarifa, detallePrecio, pasajerosPorTipo);

                function formatPasajerosPorTipo(pasajerosPorTipo) {
                    let resultado = '';
                
                    pasajerosPorTipo.forEach((pasajeros) => {
                        pasajeros.forEach(pasajero => {
                            resultado += `
                            <div class="pasajeroPorTipo">
                            <span class="uppercase">${pasajero.apellido}, ${pasajero.nombre} (${pasajero.tipoPasajero})</span>
                            </div>
                            `;
                        });
                    });
                
                    return resultado;
                }
                

                const reservaInfo = document.getElementById('reserva-info');
                reservaInfo.innerHTML = `
                    <h2 class="font-['Montserrat'] text-[#2C4B8B] text-[18px] ml-[10px] text-center"><strong>Detalles de la Reserva</strong></h2>
                    <div class="font-['Montserrat']  text-[#686868] text-[14px] ml-[10px]">  
                    <p class="mb-[15px] mt-[20px] font-['Montserrat'] "><strong>Localizador de Reserva: </strong> ${localizadorReserva}</p>
                    <div class="flex text-center">
                    <label class="font-['Montserrat'] text-sm font-medium leading-6 text-gray-500 mb-[10px] mt-[10px] mr-[20px]"><strong>Ficha: </strong><input class="rounded-md mt-[10px] p-[1px] pl-[10px] border-0 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 font-['Montserrat']  nroFicha" type="number"/></label><br>
                    <label class="font-['Montserrat'] text-sm font-medium leading-6 text-gray-500 mb-[10px] mt-[10px] ml-[20px]"><strong>Email: </strong><input class="rounded-md mt-[10px] p-[1px] pl-[10px] border-0 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 font-['Montserrat']  emailVendedor" type="email"/></label>
                    <label class="font-['Montserrat'] text-sm font-medium leading-6 text-gray-500 mb-[10px] mt-[10px] ml-[20px]"><strong>Forma de pago:</strong><select class="w-[180px] pr-[5px] rounded-md mt-[10px] p-[1px] pl-[10px] border-0 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 font-['Montserrat'] text-center fop">
                    <option value="Cash">Cash</option>
                    <option value="Tarjeta de credito">Tarjeta de crédito</option>
                    <option value="Tarjeta + Cash">Tarjeta + Cash</option>
                    </select>
                    </label> 
                    </div>
                    <p class="mb-[10px] mt-[20px]"><strong>Pasajeros:</strong>${formatPasajerosPorTipo(pasajerosPorTipo)}</p>
                    </div>
                    <p class="font-['Montserrat'] ml-[10px] font-sans text-[#686868] text-[14px] mb-[10px] mt-[20px]"><strong class="font-['Montserrat'] ">Itinerario:</strong></p>

                    <div class="m-[10px]"> 
                    <table class="min-w-full acc ach font-['Montserrat']">
                        <thead>
                            <tr class="bg-black/20 rounded-t-lg">
                                <th scope="col" class="pt-[5px] pb-[5px] pl-[5px] pr-[5px] text-center text-[12px] leading-5 font-semibold axu pl-0">Vuelo</th>
                                <th scope="col" class="pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[12px] leading-5 font-semibold	">Clase</th>
                                <th scope="col" class="pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[12px] leading-5 font-semibold	">Origen</th>
                                <th scope="col" class="pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[12px] leading-5 font-semibold ">Destino</th>
                                <th scope="col" class="pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[12px] leading-5 font-semibold">Salida</th>
                                <th scope="col" class="pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[12px] leading-5 font-semibold">Llegada</th>
                                <th scope="col" class="pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[12px] leading-5 font-semibold">Fare Basis</th>
                                <th scope="col" class="pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[12px] leading-5 font-semibold">Cód. Identificación</th>
                                <th scope="col" class="pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[12px] leading-5 font-semibold">Equipaje</th>
                            </tr>
                        </thead>
                        <tbody class="acc acg">
                            ${detallesTarifa.map(tarifa => `
                            <tr class="border-b border-[#d1d5db]">
                                <td class="whitespace-nowrap pt-[5px] pb-[5px] pl-[5px] pr-[5px] text-[10px] text-[#6b7280] leading-5 pl-0 text-center">${tarifa.lineaAerea} ${tarifa.numeroVuelo}</td>
                                <td class="whitespace-nowrap pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[11px] leading-5 text-[#6b7280]">${tarifa.clase}</td>
                                <td class="whitespace-nowrap pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[11px] leading-5 text-[#6b7280]">${tarifa.salida}</td>
                                <td class="whitespace-nowrap pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[11px] leading-5 text-[#6b7280]">${tarifa.llegada}</td>
                                <td class="whitespace-nowrap pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[11px] leading-5 text-[#6b7280]">${tarifa.fechaViaje} / ${tarifa.horaSalida}hs.</td>
                                <td class="whitespace-nowrap pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[11px] leading-5 text-[#6b7280]">${tarifa.fechaViaje} / ${tarifa.horaSalida}hs.</td>
                                <td class="whitespace-nowrap pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[11px] leading-5 text-[#6b7280]">${tarifa.codigoBaseTarifa}</td>
                                <td class="whitespace-nowrap pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[11px] leading-5 text-[#6b7280]">${tarifa.codigoIdentificacion}</td>
                                <td class="whitespace-nowrap pl-[5px] pr-[5px] pt-[5px] pb-[5px] text-center text-[11px] leading-5 text-[#6b7280]">${tarifa.equipaje}</td>
                            </tr> `).join('')}
                    </tbody>
                    </table>
                    </div>

                  <table align="left" width="20%" class="mb-[20px] text-[12px] font-['Montserrat'] text-[#686868]">
                  <tbody>


                  ${detallePrecio.map(precio => `

                  <tr>
                  <td align="left" class="pl-[5px]">Tarifa básica</td>
                  <td align="left"><span class="w-[80px] text-right">${precio.tarifaBase}</span></td>
                  </tr>

                  <tr> 
                  <td align="left" class="pl-[5px]">Impuestos</td>
                  <td align="left"><span class="w-[80px] text-right"">${precio.impuestos}</span></td>
                  </tr>

                  <tr>
                  <td align="left" class="pl-[5px]"><b>Total</b></td>
                  <td align="left"><span class="w-[80px] text-right">${precio.tarifaFinal}</span></td>
                  </tr>`).join('')}
                  </tbody>
                  </table>
                  <div class="text-center">
                  <table align="center" width="100%">
                  <tbody>
                  ${detallePrecio.map(vencimiento => `
                  <tr>
                  <td>
                  <strong class="text-[13px] font-['Montserrat']  text-[#686868] mt-[20px] text-red-600">${vencimiento.vencimientoReserva} </strong>
                  </td>
                  </tr>`).join('')}
                  </tbody>
                  </table>
                  </div>


                  <button class="encoleBtn" id="confirmar-reserva">Encolar reserva</button> 

                   `;

                reservaInfo.style.display = 'block';
                reservaInfo.parentElement.style.width = '800px';
                reservaInfo.parentElement.style.height = '500px';

                document.getElementById('confirmar-reserva').addEventListener('click', async function () {
                    const nroFicha = document.querySelector('.nroFicha').value;
                    const emailVendedor = document.querySelector('.emailVendedor').value;
                    const formaDePago = document.querySelector('.fop').value;


                
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
                        await enviarDatosAFlujoPowerAutomate(JSON.stringify(datos));
                    } catch (error) {
                        console.error('Error al enviar los datos a Power Automate:', error);
                    }
                });
                
            } else {
                console.error('Error al recibir datos:', response && response.error);
            }
        });
    });
});
