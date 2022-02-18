import { spawn } from 'child_process';
import chalk from 'chalk';
import irc from 'irc';

var lib = [];
var args = {
    pingspd: parseInt(process.argv[2])
};
// IP regex
const reg = new RegExp(/((\d){1,3}\.){3}\d{1,3}/gm);

const proc = spawn('cmd', { shell: true });
proc.stdio = ['pipe', 'pipe', 'pipe'];

function scan(ip) {
    process.stdout.write(chalk.green(`Adding entry for ${ip}...                    \n`));
    let inst = new irc.Client(ip, 'Thoth');
    inst.addListener('message', (f, t, m) => {
        console.log(chalk.blue(`*${ip} ${f} -> ${t}: ${m}`));
    });
    inst.addListener('registered', (m) => {
        console.log(chalk.bgBlue(`+registered to ${ip}: ${m}`));
    });
    inst.addListener('channellist', (cl) => {
        console.log(chalk.bgGreen(`+${ip} returned channels: ${cl}`));
    });
    inst.addListener('error', (e) => {
        process.stderr.write(`?${ip}:${e}\r`);
    });
    lib.push(inst);
}

proc.stdout.on('data', (d) => {
    if (reg.test(d)) {
        scan(d.toString().match(reg)[0]);
    }
});
proc.stderr.on('data', (e) => {
    // process.stdout.write(chalk.red(`! ${e.toString()}\r`));
});
proc.stdin.write(`cmd /c ext\\masscan64.exe -c config\\default.conf --max-rate ${args.pingspd}\n`);
async function exitHandler() {
    proc.kill('SIGINT');
    console.log(JSON.stringify(lib, null, 4));
    // await new Promise((res, _) => setTimeout(() => res(), 11000));
    process.exit();
}

process.on('beforeExit', exitHandler);
process.on('SIGINT', exitHandler);