import { getRandomImage, REACTIONS } from "../utils/protections.js";

export default {
    name: "welcome",
    description: "Message de bienvenue avec image",

    async run(api, event, config) {
        if(!config.welcome) return;
        const { threadID, logMessageData } = event;
        const newMembers = logMessageData.addedParticipants;

        const groupInfo = await api.getThreadInfo(threadID);
        const groupName = groupInfo.name;
        const memberCount = groupInfo.participantIDs.length;

        for(const member of newMembers) {
            const name = member.fullName;
            const userID = member.userFbId;
            const randomImg = getRandomImage();

            const caption = 
`┏━━━『 🎉 MUZAN-BOT 』━━━┓
┃ 👤 @${userID}
┃ ✨ Bienvenue dans *${groupName}* !
┃ 💯 Tu es le ${memberCount}e membre
┃ 📝 Présente-toi
┗━━━━━━━━━━━━━━┛`;

            api.sendMessage({
                body: caption,
                attachment: await streamURL(randomImg),
                mentions: [{ tag: name, id: userID }]
            }, threadID);

            api.setMessageReaction(REACTIONS.welcome, event.messageID, () => {}, true);
        }
    }
}

// Fonction pour convertir URL en stream Messenger
async function streamURL(url) {
    const axios = (await import("axios")).default;
    const res = await axios.get(url, { responseType: "stream" });
    return res.data;
}
