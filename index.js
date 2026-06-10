import login from "fca-unofficial";
import fs from "fs";
import chalk from "chalk";
import config from "./config.js";

const cmds = new Map();

// Charge commandes comme GOAT-BOT
async function loadCmds() {
    if(!fs.existsSync("./cmds")) fs.mkdirSync("./cmds");
    const files = fs.readdirSync("./cmds").filter(f => f.endsWith(".js"));
    for(const file of files) {
        const cmd = await import(`./cmds/${file}`);
        if(cmd.default?.name) {
            cmds.set(cmd.default.name, cmd.default);
            console.log(chalk.green(`[LOAD] ${cmd.default.name}`));
        }
    }
}

async function startBot() {
    await loadCmds();
    console.log(chalk.blue(`MUZAN-BOT chargé avec ${cmds.size} commandes`));

    let appstate = JSON.parse(fs.readFileSync("appstate.json", "utf8"));
    
    login({appState: appstate}, (err, api) => {
        if(err) {
            console.error(chalk.red("Login failed:", err));
            setTimeout(startBot, 10000); // auto restart comme GOAT-BOT
            return;
        }
        
        api.setOptions(config.FCAOption);
        console.log(chalk.green(`✅ ${config.nomBot} connecté ! ID: ${api.getCurrentUserID()}`));
        
        const listen = api.listenMqtt((err, event) => {
            if(err) {
                console.error(chalk.red("MQTT Error:", err));
                listen.stopListening();
                setTimeout(startBot, 5000); // auto relogin comme GOAT-BOT
                return;
            }
            
            if(event.type !== "message" || !event.body) return;
            if(!event.body.startsWith(config.prefix)) return;
            
            const args = event.body.slice(config.prefix.length).trim().split(/ +/);
            const cmdName = args.shift().toLowerCase();
            const cmd = cmds.get(cmdName);
            if(!cmd) return;
            
            // Check admin comme GOAT-BOT
            if(config.adminOnly && !config.adminBot.includes(event.senderID)) {
                return api.sendMessage("Admin only ❌", event.threadID);
            }
            
            cmd.run(api, event, args, config);
        });
    });
}

startBot();
