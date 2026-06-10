import login from "fca-unofficial";
import fs from "fs";
import chalk from "chalk";
import config from "./config.js";

const cmds = new Map();
const cooldowns = new Map();

// Charger toutes les commandes
const cmdFiles = fs.readdirSync("./cmds").filter(file => file.endsWith(".js"));
for(const file of cmdFiles) {
    const cmd = await import(`./cmds/${file}`);
    cmds.set(cmd.default.name, cmd.default);
    console.log(chalk.green(`Commande ${cmd.default.name} chargée`));
}

console.log(chalk.blue(`MUZAN-BOT chargé avec ${cmds.size} commandes`));

// Login avec appstate
let appstate;
if(fs.existsSync("appstate.json")) {
    appstate = JSON.parse(fs.readFileSync("appstate.json", "utf8"));
} else if(process.env.APPSTATE) {
    appstate = JSON.parse(process.env.APPSTATE);
} else {
    console.error(chalk.red("Aucun appstate trouvé!"));
    process.exit(1);
}

login({appState: appstate}, (err, api) => {
    if(err) return console.error(chalk.red("Erreur login:", err));
    
    api.setOptions(config.FCAOption);
    console.log(chalk.green(`✅ ${config.nomBot} connecté !`));

    api.listen(async (err, event) => {
        if(err) return;
        if(!event.body) return;
        
        const prefix = config.prefix;
        if(!event.body.startsWith(prefix)) return;
        
        const args = event.body.slice(prefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();
        
        const command = cmds.get(cmdName);
        if(!command) return;
        
        try {
            await command.run(api, event, args, config);
        } catch(e) {
            console.error(e);
            api.sendMessage("Erreur commande ❌", event.threadID);
        }
    });
});
