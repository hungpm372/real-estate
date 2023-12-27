import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contract, formatAccount, web3 } from '../utils/web3-utils';
import { contractAddress } from './../constants/index';
import NFTItem from '../components/NFTItem';

function Profile() {
    const { address } = useParams();
    const [nftData, setNftData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const accounts = await web3.eth.getAccounts();
                    const tokenIds = await contract.methods.getOwnerTokens().call({ from: address ? address : accounts[0] })

                    const nftPromises = tokenIds.map(async (tokenId) => {
                        const tokenURI = await contract.methods.tokenURI(tokenId).call()
                        const response = await axios.get(tokenURI);
                        const metadata = response.data;
                        const owner = await contract.methods.ownerOf(tokenId).call();

                        return {
                            tokenId: web3.utils.toNumber(tokenId),
                            ...metadata,
                            owner
                        };
                    })

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

    }, [address]);

    return (
        <Container className="mt-4">
            <Row>
                <Col xs='12'>
                    <h2 className='text-left mb-5'>
                        {address ? formatAccount(address) : 'My Properties '}
                        {`(${nftData.length})`}
                    </h2>
                </Col>
            </Row>
            <Row>
                {nftData.map((nft) => (
                    <Col className="mb-4" xs="3" key={nft.tokenId}>
                        <Link to={`/${contractAddress}/${nft.tokenId}`} className='link'>
                            <NFTItem nft={nft} />
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Profile;