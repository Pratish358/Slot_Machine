const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

let balance = 0;
let lines = 0;
let bet = 0;

const updateBalanceDisplay = () => {
    document.getElementById("balance-display").innerText = `Balance: $${balance}`;
};

const showMessage = (message) => {
    const messageElement = document.getElementById("message");
    messageElement.innerText = message;
};

const handleDeposit = () => {
    const depositInput = parseFloat(document.getElementById("deposit").value);
    if (isNaN(depositInput) || depositInput <= 0) {
        showMessage("Invalid deposit amount. Please try again.");
        return;
    }
    balance += depositInput;
    updateBalanceDisplay();
    showMessage("Deposit successful!");
};

const handleLines = () => {
    const linesInput = parseInt(document.getElementById("lines").value);
    if (isNaN(linesInput) || linesInput < 1 || linesInput > 3) {
        showMessage("Invalid number of lines. Enter a value between 1 and 3.");
        return;
    }
    lines = linesInput;
    showMessage(`Lines set to ${lines}`);
};

const handleBet = () => {
    const betInput = parseFloat(document.getElementById("bet").value);
    if (isNaN(betInput) || betInput <= 0 || betInput > balance / lines) {
        showMessage("Invalid bet amount. Please try again.");
        return;
    }
    bet = betInput;
    showMessage(`Bet placed: $${bet} per line`);
};

const spin = () => {
    if (bet === 0 || lines === 0) {
        showMessage("Set your lines and bet before spinning!");
        return;
    }
    balance -= bet * lines;
    updateBalanceDisplay();

    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [[], [], []];
    for (let i = 0; i < COLS; i++) {
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    for (let i = 0; i < COLS; i++) {
        document.getElementById(`reel-${i + 1}`).innerText = reels[i].join("\n");
    }

    const winnings = calculateWinnings(reels, lines, bet);
    balance += winnings;
    updateBalanceDisplay();
    showMessage(winnings > 0 ? `You won $${winnings}!` : "You lost. Try again!");
};

const calculateWinnings = (reels, lines, bet) => {
    let winnings = 0;
    for (let i = 0; i < lines; i++) {
        const symbol = reels[0][i];
        let isWinningLine = true;
        for (let j = 1; j < COLS; j++) {
            if (reels[j][i] !== symbol) {
                isWinningLine = false;
                break;
            }
        }
        if (isWinningLine) {
            winnings += SYMBOL_VALUES[symbol] * bet;
        }
    }
    return winnings;
};
