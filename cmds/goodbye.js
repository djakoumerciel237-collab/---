export default {
    name: "goodbye",
    run: async (api, event, args, config) => {
        if(event.logMessageType === "log:unsubscribe") {
            const name = event.logMessageData.leftParticipantName;
            api.sendMessage(`Bye ${name} 👋`, event.threadID);
        }
    }
}
