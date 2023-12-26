import Web3 from 'web3';

import { contractAddress, ABI } from "../constants";

const web3 = new Web3(window.ethereum);

const contract = new web3.eth.Contract(ABI, contractAddress);

const formatAccount = (account) => {
    if (account) {
        const first = account.substring(0, 5);
        const last = account.slice(-5);
        return `${first}...${last}`;
    }
    return "Connect Metamask";
};

const formatBalance = (balance) => {
    if (balance) {
        return parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 4 }) + " ETH";
    }
    return "";
};

const formatCurrency = number => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    return formatter.format(number);
}

function formatDateTime(timestamp) {
    const myDate = new Date(Number(timestamp) * 1000);
    return myDate.toUTCString()
}

export { web3, contract, formatAccount, formatBalance, formatCurrency, formatDateTime }
