import axios from 'axios';
import FormData from 'form-data';
import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Col, Container, Form, FormGroup, Label, Row, Input, Button } from 'reactstrap';

import { contractAddress } from '../constants';
import { contract, web3 } from '../utils/web3-utils'

const Create = () => {
    const imgRef = useRef()
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [address, setAddress] = useState('');

    const handleTitleChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            imgRef.current.src = URL.createObjectURL(file)
        }
        setFile(file);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("file", file);
            formData.append("address", address);
            const response = await axios.post("http://localhost:4000/", formData)

            const accounts = await window.ethereum.request({ method: "eth_accounts" })
            const result = await contract.methods.createToken(response.data.url).send({ from: accounts[0] });

            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC721',
                    options: {
                        address: contractAddress,
                        tokenId: web3.utils.toNumber(result.events.Transfer.returnValues.tokenId).toString(),
                    },
                },
            });
        } catch (error) {
            console.log("Lỗi tạo NFT");
        }
        window.location.href = '/account'
    };
    return (
        <div>
            <Container className='mt-3'>
                <Row>
                    <Col xs='10' className="offset-2">
                        <h2 className='text-left mb-5'>Add New Property</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs={8} className="offset-2">
                        <Form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                            <FormGroup>
                                <Label for="title">Name</Label>
                                <Input type="text" id="title" placeholder='Name' value={name} onChange={handleTitleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <textarea className='form-control' rows={6} placeholder='There are many variations of passages.' id="description" value={description} onChange={handleDescriptionChange}>

                                </textarea>
                            </FormGroup>
                            <FormGroup>
                                <Label for="file">Upload photos of your property</Label>
                                <Input type="file" id="file" onChange={handleFileChange} />
                                <img src='' alt='' ref={imgRef} className='mt-4' />
                            </FormGroup>
                            <FormGroup>
                                <Label for="address">Address</Label>
                                <Input type="text" id="address" placeholder='Address' value={address} onChange={handleAddressChange} />
                            </FormGroup>
                            <Button color="primary">Add Property</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div >
    );
};

export default Create;