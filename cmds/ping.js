export default {
    name: "ping",
    run: async (api, event) => {
        api.sendMessage("Pong! MUZAN-BOT online ✅\nPrefix: .", event.threadID);
    }
}
