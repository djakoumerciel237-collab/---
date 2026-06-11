import login from "fca-unofficial";
import fs from "fs";
import chalk from "chalk";

let appstate = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({appState: appstate}, (err, api) => {
    if(err) return console.error(chalk.red("ERREUR LOGIN:", err));
    console.log(chalk.green("✅ CONNECTE ID:", api.getCurrentUserID()));
    
    api.listenMqtt((err, event) => {
        if(err) return;
        if(event.type === "message" && event.body) {
            console.log("Message reçu:", event.body, "de", event.senderID);
            api.sendMessage("Bot répond! Config OK ✅", event.threadID);
        }
    });
});
