const chalk = require("chalk");

class Logger {
    constructor() {
        this.stats = {
            scans: 0,
            opportunities: 0,
            executed: 0,
            totalProfit: 0,
            totalGas: 0,
            errors: 0,
            startTime: Date.now(),
        };
    }

    banner() {
        console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════════╗
║          ⚡ FLASH LOAN ARBITRAGE BOT — BASE ⚡            ║
║         Zero-Capital Arbitrage via Aave V3               ║
╚═══════════════════════════════════════════════════════════╝
    `));
    }

    info(msg) {
        console.log(chalk.gray(`[${this._time()}]`) + " " + msg);
    }

    opportunity(pair, profitStr, profitUsd) {
        this.stats.opportunities++;
        console.log(
            chalk.gray(`[${this._time()}]`) +
            chalk.green.bold(" 💰 OPPORTUNITY ") +
            chalk.white(pair) +
            chalk.green(` +${profitStr}`) +
            chalk.yellow(` (~$${profitUsd})`)
        );
    }

    executed(pair, result) {
        this.stats.executed++;
        if (result.success) {
            this.stats.totalProfit += parseFloat(result.profit || 0);
            this.stats.totalGas += parseFloat(result.gasCostETH || 0);
            console.log(
                chalk.gray(`[${this._time()}]`) +
                chalk.green.bold(" ✅ EXECUTED ") +
                chalk.white(pair) +
                chalk.green(` profit: ${result.profit}`) +
                chalk.gray(` gas: ${result.gasCostETH} ETH`) +
                chalk.gray(` tx: ${result.txHash}`)
            );
        } else {
            this.stats.errors++;
            console.log(
                chalk.gray(`[${this._time()}]`) +
                chalk.red.bold(" ❌ FAILED ") +
                chalk.white(pair) +
                chalk.red(` ${result.error}`)
            );
        }
    }

    dryRun(pair, result) {
        console.log(
            chalk.gray(`[${this._time()}]`) +
            chalk.yellow.bold(" 🏜️  DRY RUN ") +
            chalk.white(pair) +
            chalk.green(` est. profit: ${result.estimatedProfit}`) +
            chalk.gray(` gas: ~${result.gasCostETH} ETH`)
        );
    }

    scan(pairCount) {
        this.stats.scans++;
        if (this.stats.scans % 20 === 0) {
            this.dashboard();
        }
    }

    noOpportunity(pair) {
        // Quiet — only log every 10th scan to reduce noise
        if (this.stats.scans % 10 === 0) {
            console.log(
                chalk.gray(`[${this._time()}] ⏳ ${pair} — no spread`)
            );
        }
    }

    error(msg, err) {
        this.stats.errors++;
        console.log(
            chalk.gray(`[${this._time()}]`) +
            chalk.red.bold(" ⚠️  ERROR ") +
            chalk.red(msg) +
            (err ? chalk.gray(` ${err.message || err}`) : "")
        );
    }

    dashboard() {
        const uptime = ((Date.now() - this.stats.startTime) / 1000 / 60).toFixed(1);
        console.log(chalk.cyan(`
┌─────────────────────────────────────────────┐
│  Scans: ${String(this.stats.scans).padEnd(8)} Opportunities: ${String(this.stats.opportunities).padEnd(6)}│
│  Executed: ${String(this.stats.executed).padEnd(6)} Errors: ${String(this.stats.errors).padEnd(12)}│
│  Total Profit: ${String(this.stats.totalProfit.toFixed(6)).padEnd(12)} ETH         │
│  Total Gas:    ${String(this.stats.totalGas.toFixed(6)).padEnd(12)} ETH         │
│  Uptime:       ${uptime} min                      │
└─────────────────────────────────────────────┘`));
    }

    _time() {
        return new Date().toISOString().substr(11, 12);
    }
}

module.exports = new Logger();
