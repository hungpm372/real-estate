import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from "reactstrap";
import Banner from '../components/Banner';

import NFTItem from "../components/NFTItem";
import { contract } from '../utils/web3-utils';
import { contractAddress, zeroAddress } from './../constants';

function Home() {
    const [nftData, setNftData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const events = await contract.getPastEvents('Transfer', {
                        filter: {
                            from: zeroAddress
                        },
                        fromBlock: 0
                    })
                    const nftPromises = events.map(async (event) => {
                        const tokenId = event.returnValues.tokenId;
                        const tokenURI = await contract.methods.tokenURI(tokenId).call()
                        const response = await axios.get(tokenURI);
                        const metadata = response.data;
                        const owner = await contract.methods.ownerOf(tokenId).call();

                        return {
                            tokenId: Number(tokenId),
                            ...metadata,
                            owner
                        };
                    });

                    const nfts = await Promise.all(nftPromises);
                    setNftData(nfts);

                } catch (error) {
                    console.error('Lỗi khi lấy danh sách NFT:', error);
                }
            }
        }
        fetchData().catch((err) => {
            console.log(err);
        })

    }, []);

    return (
        <>
            <Banner />
            <Container className="mt-4">
                <h2 className='mb-4'>Discover Our Featured Listings</h2>
                <Row >
                    {nftData.map((nft) => (
                        <Col className="mb-4" xs="3" key={nft.tokenId}>
                            <Link to={`/${contractAddress}/${nft.tokenId}`} className='link'>
                                <NFTItem nft={nft} />
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    )
}

export default Home;