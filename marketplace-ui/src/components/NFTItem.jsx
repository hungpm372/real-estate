import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faShare, faTag } from '@fortawesome/free-solid-svg-icons'
import React from 'react';
import { Card, CardImg } from 'reactstrap';

import { formatAccount } from '../utils/web3-utils'

function NFTItem({ nft }) {
    return (
        <Card style={{ border: "none" }} className='nft-item'>
            <div style={{ paddingBottom: "60%", position: "relative", }}  >
                <div className='wrapper-img'>
                    <CardImg loading='lazy' src={nft.image} alt={nft.name} style={{ width: "100%", height: "100%", }} />
                </div>
            </div>
            <div className='nft-info'>
                <div className='nft-name mb-1'>{nft.name}</div>
                <div className='nft-address mb-1'>{nft.address}</div>
                <div>Owner: <span className='nft-owner'>{formatAccount(nft.owner).toUpperCase()}</span></div>
                <hr />
                <div>
                    <div className="icons">
                        <FontAwesomeIcon icon={faShare} />
                        <FontAwesomeIcon icon={faTag} />
                        <FontAwesomeIcon icon={faHeart} />
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default NFTItem;