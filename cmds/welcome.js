export default {
    name: "welcome",
    run: async (api, event, args, config) => {
        if(event.logMessageType === "log:subscribe") {
            const name = event.logMessageData.addedParticipants[0].fullName;
            api.sendMessage(`Bienvenue ${name} dans ${config.nomBot} 🔥`, event.threadID);
        }
    }
}
