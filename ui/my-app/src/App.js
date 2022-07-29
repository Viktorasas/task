import "./App.css";
import { useEffect, useState } from 'react';
import Web3 from 'web3'
import config from "./config.json";

function App() {
  const [walletIterator, setWalletIterator] = useState(0);
  const [pubKey, setPubKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null)
  const [totalBalance, setTotalBalance] = useState(null);
  const [ethPrice, setEthPrice] = useState('0000000000');
  const [depositState, setDepositState] = useState(0)
  const [withdrawState, setWithdrawState] = useState(0)
  const [ethDeposit, setEthDeposit] = useState('0');
  const [ethWithdraw, setEthWithdraw] = useState('0');
  const [loadAddress, setLoadAddress] = useState(null);
  const [loadKey, setLoadKey] = useState(null);

  const web3 = new Web3("ws://localhost:8545")


  const createNewKeypair = async (address, key) => {
    setPubKey(address)
    setPrivateKey(key)
    setTotalBalance(web3.utils.fromWei(await web3.eth.getBalance(address), 'ether'));
    ethPriceGet()
  }


  const walletInfo =  () => {
    let ethPricelocal = ethPrice.toString()
    return (
      <>
      {'Wallet address:' + pubKey}
      <br/>
      <br/>
      {'Private key:' + privateKey}
      <br/>
      <br/>
      {'Wallet Balance:' + totalBalance + "ETH"}
      <br/>
      <br/>
      {'Current ETH price: ' + ethPricelocal.substring(0, 4) + '.' + ethPricelocal.substring(4, 6) +'$'}
      </>
      
    )
  }

  function iterateWallet() {
    setPubKey(null)
    setPrivateKey(null)
    setDepositState(0)
    setWithdrawState(0)
    if(walletIterator === 8){
      setWalletIterator(0)
    } else {
      setWalletIterator(walletIterator+1)
    }
  } 

  const ethPriceGet = () => {
    const web3ETH = new Web3("https://rpc.ankr.com/eth")
    const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
    const addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    const priceFeed = new web3ETH.eth.Contract(aggregatorV3InterfaceABI, addr)
    priceFeed.methods.latestRoundData().call()
        .then((roundData) => {
            setEthPrice(parseInt(roundData[1]))
        })
  }

  const depositToWallet = async () => {
    var signed = web3.eth.accounts.signTransaction({
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      to: pubKey,
      value: ethDeposit,
      gas: 2000000
    }, '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
    await signed

    web3.eth.sendSignedTransaction((await signed).rawTransaction).on('receipt', function(receipt){
      setDepositState(2)
      console.log('receipt', receipt);

    }).on('error', function(err){
      console.log('error', err);
      setDepositState(3)
    })
    setDepositState(1)
  }

  const withdrawFromWallet = async () => {
    var signed = web3.eth.accounts.signTransaction({
      from: pubKey,
      to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      value: ethWithdraw,
      gas: 2000000
    }, privateKey);
    await signed

    web3.eth.sendSignedTransaction((await signed).rawTransaction).on('receipt', function(receipt){
      if (receipt.status === true) {
        setWithdrawState(2)

      } else {
        setWithdrawState(3)
      }
      
      console.log('receipt', receipt);

    }).on('error', function(err){
      console.log('error', err);
      setWithdrawState(3)
    })
    setWithdrawState(1)
  }

  const returnState = (stateInt) => {
    if (stateInt === 0){
      return "No transaction"
    }
    if (stateInt === 1){
      return "Transaction pending"
    }
    if (stateInt === 2){
      return "Transaction confirmed"
    }
    if (stateInt === 3){
      return "Transaction failed"
    }
  }

  const calculateFee = () => {
    let total = parseInt(parseInt(ethPrice) * parseInt(web3.utils.fromWei(ethWithdraw, 'ether'))) / 100000000
    let fee = parseInt(parseInt(ethPrice) * (config.fee /100) * parseInt(web3.utils.fromWei(ethWithdraw, 'ether'))) / 100000000
    let amount = total - fee
    return (
      <>
      {"ETH to withdraw: " + parseInt(web3.utils.fromWei(ethWithdraw, 'ether'))}
      <br/>
      <br/>
      {"USD value: " + total + "$"} 
      <br/>
      <br/>
      {"Fee: " + fee + "$"}
      <br/>
      <br/>
      {"USD recieved: " + amount + "$"}
      <br/>
      <br/>
      </>
    )
  }

  const connectedUI = () => {
    return (
      <>
      <div id={"WalletInfo"}>
      {walletInfo()}
      <br/>
      </div>
      {"ETH amount to deposit: "}
      <input id={"ETHInputDep"} type="number" onChange={e => {setEthDeposit(web3.utils.toWei(e.target.value.toString(), 'ether'))}}/>
      <button id={"Deposit"} onClick={() => {depositToWallet()}}>{"Deposit"}</button>
      <br/>
      {"Deposit: " + returnState(depositState)}
      <br/>
      {"ETH amount to withdraw: "}
      <input id={"ETHInputWith"} type="number" onChange={e => {setEthWithdraw(web3.utils.toWei(e.target.value.toString(), 'ether'))}}/>
      <button id={"Withdraw"} onClick={() => {withdrawFromWallet()}}>{"Withdraw"}</button>
      <br/>
      {(ethWithdraw !== '0') && (ethPrice !== '0000000000')  ? calculateFee() : ""}
      {"Withdraw: " + returnState(withdrawState)}
      </>
    )
  }

  const loadWallet = () => {
    return (
      <>
      {"Input wallet address: "}
      <input id={"address"} type="text" onChange={e => {setLoadAddress(e.target.value.toString())}}/>
      <br/>
      {"Input wallet key: "}
      <input id={"key"} type="text" onChange={e => {setLoadKey(e.target.value.toString())}}/>
      <br/>
      <button id={"Load"} onClick={() => {
        createNewKeypair(loadAddress, loadKey)
      }}>{"Load"}</button>
      </>
    )
  }

  useEffect(() => {
    async function reBalance() {
      setTotalBalance(web3.utils.fromWei(await web3.eth.getBalance(pubKey), 'ether'));
    }
    if (withdrawState === 2 || depositState === 2){
      reBalance()
    }
    
  }, [withdrawState, depositState])
  
  return (
    <div className="App">
      {(privateKey !== null) && (pubKey !== null) ? <button onClick={() => {iterateWallet()}}>{"Disconnect"}</button> :
       <button class={"CreateWallet"} onClick={() => {createNewKeypair(config.accounts[walletIterator*2], config.accounts[walletIterator*2+1])}}>{"Create Wallet"}</button>}
      <br/>
      {(privateKey !== null) && (pubKey !== null) ? connectedUI() : loadWallet()}
    </div>
  );
}

export default App;
