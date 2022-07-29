# Spectrocoin task
# Structure, node project - main dir, wallet - ui/my-app

# Everything is self hosted
run `npm install` in main dir
run `npx hardhat node`
open new terminal
change directory to `./ui/my-app`
run `npm install`
run `npm start`

# Deposit detection (unconfirmed and confirmed), notification/alert
Deposits change react useState based on transaction: 0 - if no transaction is sent, 1 - pending, 2 - successful , 3 - failed
Maximum available deposit is 1000 ETH, hardhat wallet #0 is used as exchange wallet
For depositing click connect wallet button or import wallet. Enter amount of eth that should be deposited, clcik deposit.

# Sending a withdrawal (optional)
For withdrawing click connect wallet button or import wallet. Enter amount of eth that should be withdrawed, clcik deposit.
Can't withdraw more ETH than current wallet balance shown.
Withdraw state works same as deposit state

# Withdrawal fee calculation/estimation (optional)
App requests chainlink priceFeed.latestRoundData()call() for current value of ETH
Fee is set in ui/my-app/config.json as percentage integer
After entering withdrawal amount fee, USD recieved is shown.

# Support for 1,000,000+ unique addresses/contacts
To change amount of wallets generated on current blockchain provider go to hardhat.config.js and change $walletnumber `accounts : { count : $walletnumber}`
9 wallets are added to connect, disconnect button.
To use other wallet input wallet address and key from hardhat console and click load.
```
