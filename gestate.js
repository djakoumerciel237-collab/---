import login from "fca-unofficial";
import fs from "fs";

login({email: process.env.FB_EMAIL, password: process.env.FB_PASS}, (err, api) => {
    if(err) return console.error(err);
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState(), null, 2));
    console.log('✅ appstate.json généré ! Redéploie maintenant');
    process.exit();
});
