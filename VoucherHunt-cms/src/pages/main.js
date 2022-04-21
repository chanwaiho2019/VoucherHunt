import React, { useState, useEffect } from 'react';
import firebase  from '../firebase';

//Import components
import AppHeader from "../components/appHeader"
import Voucher from "../components/voucher"

import { Container, Row, Col } from 'react-bootstrap';

//import css
import './main.css';

function Main(props) {

    const [vouchers, setVouchers] = useState([]); 
    const ref = firebase.firestore().collection('vouchers');

    const listenForVouchers = () => {
        firebase.firestore().collection('vouchers')
            .onSnapshot((snapshot) => {
                const allVouchers = [];
                snapshot.forEach((doc) => {
                    allVouchers.push({...doc.data(), "id": doc.id});
                });
                setVouchers(allVouchers);
            }, (error) => console.error(error));
    };

    useEffect(() => {
        listenForVouchers();
    }, []);


    return (
        <>
            <AppHeader />
            <Container fluid="md">
                <Row>
                    {vouchers.map((voucher) => <Col lg="4" sm="12" md="6"><Voucher key={voucher.id} voucher={voucher} isSignedIn={props.location.isSignedIn} signOut={props.location.signOut}/></Col>)}
                </Row>
            </Container>
        </>
    );
  }
export default Main;
