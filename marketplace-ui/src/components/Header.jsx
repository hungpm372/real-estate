import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Button, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, UncontrolledDropdown } from "reactstrap";

import { web3, formatAccount, formatBalance } from '../utils/web3-utils'
import logo from "../assets/logo.png";


const Header = () => {
    const [account, setAccount] = useState("");
    const [balance, setBalance] = useState("");

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                window.location.reload()
            } else {
                setAccount("");
            }
        };

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            }
        };
    }, []);

    useEffect(() => {
        async function isConnected() {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: "eth_accounts" })
                setAccount(accounts.length ? accounts[0] : "");
            }
        }
        window.addEventListener('load', isConnected)

        return () => window.removeEventListener('load', isConnected)
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {
            if (account) {
                const balanceWei = await web3.eth.getBalance(account);
                const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
                setBalance(balanceEth);
            }
        };

        fetchBalance();
    }, [account]);


    const connectMetamask = async (e) => {
        // const result = await contract.methods.createToken("http://localhost:4000/metadatas/B4IkTiU7PXheaFnwWNmU2VdvW_hCkliyxSjS1GHKmdU.json").send({ from: account });

        // console.log("New token ID:", result.events.Transfer.returnValues.tokenId);
        // console.log("New token ID:", typeof result.events.Transfer.returnValues.tokenId);
        // web3.eth.getTransactionReceipt('0xcac28526d0f962921ac71d0f0eea3e72eebc130d8cb414005880ff929924ac3c').then(function (data) {
        //     let logs = data;
        //     console.log(logs);
        //     // console.log(web3.utils.hexToNumber(logs[0].topics[3]));
        // });

        if (typeof window.ethereum !== "undefined") {

            try {
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                const accounts = await web3.eth.getAccounts();
                const connectedAccount = accounts[0];

                setAccount(connectedAccount);
            } catch (err) {
                if (err.code === 4001) {
                    alert('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
            }
        } else {
            alert("MetaMask is not installed");
        }
    };

    const logout = async () => {
        await window.ethereum.request({
            "method": "wallet_revokePermissions",
            "params": [
                {
                    "eth_accounts": {}
                }
            ]
        }).catch((err) => {
            console.error(err);
        })
    }

    return (
        <header id="header">
            <Container>
                <Row className="align-items-center">
                    <Col xs="2">
                        <Link to="/">
                            <img src={logo} alt="Logo" width={100} />
                        </Link>
                        <Link to="/buy" className="mx-3 text">Buy</Link>
                        <Link to="/sell" className="text">Sell</Link>
                    </Col>

                    <Col xs="6" className="text-center">
                        <Input type="text" placeholder="Enter an address, neighborhood, city, or ZIP code" style={{ borderColor: "#0d6efd" }} />
                    </Col>

                    <Col xs="4" className="text-right">
                        {
                            account && <Button className="mx-2" color="primary">
                                {formatBalance(balance)}
                            </Button>
                        }

                        <UncontrolledDropdown group>
                            <Button color="primary" onClick={connectMetamask}>
                                {formatAccount(account)}
                            </Button>
                            {
                                account &&
                                <>
                                    <DropdownToggle
                                        caret
                                        color="primary"
                                    />
                                    <DropdownMenu className="t-100">
                                        <DropdownItem>
                                            <Link to="/account" className="link">
                                                Profile
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <Link to="/create" className="link">
                                                Create
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem onClick={logout}>
                                            Logout
                                        </DropdownItem>
                                    </DropdownMenu>
                                </>
                            }
                        </UncontrolledDropdown>
                    </Col>
                </Row>
            </Container>
        </header >
    );
};

export default Header;
