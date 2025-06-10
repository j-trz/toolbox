chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Verificar si el mensaje recibido es para hacer algo específico
    if (message.action === "doSomething") {
        // Realizar alguna acción aquí, por ejemplo, enviar una respuesta al remitente
        sendResponse({ result: "Accion completada" });
    }
});
