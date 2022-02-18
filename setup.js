import download from 'download';
import fs from 'fs';
import { spawn } from 'child_process';
import chalk from 'chalk';
(async() => {
    await download('https://github.com/Arryboom/MasscanForWindows/raw/master/masscan64.exe', "./ext/");
    await download('https://npcap.com/dist/npcap-1.60.exe', "./ext/");
    console.log(chalk.bgGreenBright().black('NPCAP INSTALLING, REQUIRED FOR USE'));
    spawn('cmd', ['/c', 'ext\\npcap-1.60.exe']);
})();