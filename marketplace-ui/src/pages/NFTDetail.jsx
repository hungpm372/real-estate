import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, CardImg, Card, Button, Input, InputGroupText, InputGroup } from "reactstrap";
import { contractAddress } from "../constants";
import { contract, formatAccount, formatCurrency, web3 } from "../utils/web3-utils";
import TransactionHistory from './../components/TransactionHistory';

function NFTDetail(props) {
    const { tokenId } = useParams();
    const [metadata, setMetadata] = useState({});
    const [price, setPrice] = useState("");
    const [account, setAccount] = useState("")
    const [owner, setOwner] = useState("");
    const [listed, setListed] = useState(false)
    const [transactions, setTransactions] = useState([]);
    const [exchangeRate, setExchangeRate] = useState();

    useEffect(() => {
        axios.get(
            "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        )
            .then((res) => {
                const { USD } = res.data
                setExchangeRate(USD)
            })
            .catch(err => {
                console.log("Err in get exchangeRate");
            })
    }, []);

    useEffect(() => {
        async function getAccount() {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: "eth_accounts" })
                setAccount(accounts.length ? accounts[0] : "");
            }
        }
        getAccount().catch((err) => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        const fetchMetadata = async () => {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const tokenURI = await contract.methods.tokenURI(tokenId).call();
                    const response = await axios.get(tokenURI);
                    const metadata = response.data;
                    setMetadata({ tokenId, ...metadata });
                } catch (error) {
                    window.location.href = "/404";
                }
            }
        };

        fetchMetadata();
    }, [tokenId]);

    useEffect(() => {
        const getOwner = async () => {
            try {
                const owner = await contract.methods.ownerOf(tokenId).call();
                setOwner(owner);
            } catch (error) {
                console.error("Error fetching owner:", error);
            }
        };

        getOwner();
    }, [tokenId]);

    useEffect(() => {
        const getTokenPrice = async () => {
            try {
                if (listed) {
                    const price = await contract.methods.getTokenPrice(tokenId).call();
                    setPrice(web3.utils.fromWei(price, 'ether'));
                }
            } catch (error) {
                console.error("Error fetching price:", error);
            }
        };

        getTokenPrice()

    }, [tokenId, listed]);

    useEffect(() => {
        const getTokenListed = async () => {
            try {
                const listed = await contract.methods.isTokenListed(tokenId).call();
                setListed(listed);
            } catch (error) {
                console.error("Error fetching listed:", error);
            }
        };

        getTokenListed();
    }, [tokenId]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const events = await contract.getPastEvents('Transfer', {
                fromBlock: 0,
            })

            const transactionArr = []
            for (let i = 0; i < events.length; i++) {
                const { from, to, tokenId: id } = events[i].returnValues
                if (web3.utils.toNumber(id) === Number(tokenId)) {
                    const tx = events[i].transactionHash;
                    const transaction = await web3.eth.getTransaction(tx);
                    const value = web3.utils.fromWei(transaction.value, 'ether');
                    const time = (await web3.eth.getBlock(transaction.blockNumber)).timestamp
                    transactionArr.unshift({ from, to, value, time });
                }
            }

            setTransactions(transactionArr);
        }

        fetchTransactions()
            .catch((err) => {
                console.log("Error fetch transaction", err);
            })
    }, [tokenId])

    const handleSell = async () => {
        try {
            if (Number(price) > 0) {
                const priceInWei = web3.utils.toWei(price.toString(), "ether");
                await contract.methods.listTokenForSale(tokenId, priceInWei).send({ from: account });
                window.location.reload()
            } else {
                return alert("Enter the amount")
            }
        } catch (error) {
            console.error("Error selling NFT:", error);
        }
    };

    const handleBuy = async () => {
        try {
            await contract.methods.buyToken(tokenId).send({ from: account, value: web3.utils.toWei(price, "ether") });
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC721',
                    options: {
                        address: contractAddress,
                        tokenId: tokenId.toString(),
                    },
                },
            });
            window.location.reload()
        } catch (error) {
            console.error("Error buying NFT:", error);
        }
    };

    const handleCancel = async () => {
        try {
            await contract.methods.cancelTokenSale(tokenId).send({ from: account });
            window.location.reload()
        } catch (error) {
            console.error("Error cancel selling NFT:", error);
        }
    };


    return (
        <Container className="mt-4">
            <Row>
                <Col xs="5">
                    <Card style={{ paddingBottom: "100%", position: "relative", border: "none" }}  >
                        <div
                            style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, }}>
                            <CardImg src={metadata.image} alt={metadata.name} style={{ width: "100%", height: "100%", }} />
                        </div>
                    </Card>
                </Col>

                <Col xs="7" className="text-left">
                    <Card className="p-3">
                        <h2>{metadata?.name}</h2>
                        <p>{`#${tokenId}`}</p>
                        <p>Owned by&nbsp;
                            <Link className="nft-owner" to={
                                account.toLowerCase() === owner.toLowerCase()
                                    ? '/account' : `/${owner}`
                            }>
                                {
                                    account.toLowerCase() === owner.toLowerCase() ? 'You' : formatAccount(owner)
                                }
                            </Link>
                        </p>
                        <p>{metadata?.address}</p>
                    </Card>
                    <Card className="p-3 my-3 flex-row align-items-center">
                        {
                            account.toLowerCase() === owner.toLowerCase() ? (
                                listed ? (
                                    <div>
                                        <h6 className="mt-2">Current price</h6>
                                        <h2 className="mt-2 price">
                                            {`${price} ETH`}
                                            <span className="mx-2 exchange-rate">{`${formatCurrency(price * exchangeRate)}`}</span>
                                        </h2>
                                        <Button onClick={handleCancel} color="primary">Cancel</Button>

                                    </div>
                                ) : (
                                    <>
                                        <InputGroup className="input-group-size">
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                className="w-30-p"
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                            <InputGroupText>
                                                ETH
                                            </InputGroupText>
                                        </InputGroup>
                                        <span className="mx-2 exchange-rate">{`${formatCurrency(price * exchangeRate)}`}</span>
                                        <Button onClick={handleSell} color="primary" className="mx-2">Sell</Button>
                                    </>
                                )
                            ) : (
                                listed ? (
                                    <div>
                                        <h6 className="mt-4">Current price</h6>
                                        <h3 className="mt-2">{`${price} ETH`}
                                            <Button className='mx-3' onClick={handleBuy} color="primary">Buy now</Button>
                                        </h3>
                                    </div>
                                ) : (<Button onClick={e => alert("Make offer")} color="primary">Make offer</Button>)
                            )
                        }
                    </Card>
                    <Card className="p-3">
                        <h6 className="mt-4">Property Description</h6>
                        <p className="mt-2">{metadata?.description}</p>
                    </Card>

                </Col>
            </Row>
            <Row>
                <Col xs='12 mt-5'>
                    <h2 className='mb-4'>Transaction History</h2>
                    <TransactionHistory transactions={transactions} />
                </Col>
            </Row>
        </Container >
    );
}

export default NFTDetail;
