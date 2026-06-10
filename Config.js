export default {
    nomBot: "MUZAN-BOT",
    prefix: "!",
    adminBot: ["61581453916589"], // Mets ton ID FB ici
    
    FCAOption: {
        logLevel: "silent",
        listenEvents: true,
        selfListen: false,
        updatePresence: true,
        forceLogin: true
    },
    
    welcome: true,
    goodbye: true,
    
    messages: {
        noPermission: "❌ Tu n'as pas la permission chef",
        cooldown: "⏳ Attends {time}s avant de réutiliser"
    }
}
