import React from "react";
import { Card, Table } from "reactstrap";
import { formatAccount, formatDateTime } from "../utils/web3-utils";

function TransactionHistory({ transactions }) {

    return (
        <Card className="p-4">
            <Table id="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Price</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactions.map((data, i) => {
                            return (
                                <tr key={i} >
                                    <th scope="row">#{i}</th>
                                    <td>{formatAccount(data?.from)}</td>
                                    <td>{formatAccount(data?.to)}</td>
                                    <td>{data?.value === '0.' ? '' : `${data?.value} ETH`}</td>
                                    <td>{formatDateTime(data.time)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </Card>
    );
}

export default TransactionHistory;
