import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import './voucher.css';

function Voucher(props) {

    const [voucher, setVouchers] = useState(props.voucher);

    //check if voucher has an image. if not -> display a dummy image
    const checkImage = (_image) => {
        return _image ? _image : "https://dummyimage.com/600x400/000/fff";
    }

    //Format the date 
    const formatDate = (_date) => {
        var temp = _date.toLocaleDateString().split('/');
        var dd = temp[0];
        var mm = temp[1];
        var yyyy = temp[2];
        return yyyy + '-' + mm + '-' + dd;
    };
    return (
        <Link className="voucher" to={{
            pathname: '/update',
            voucher,
            isSignedIn: props.isSignedIn,
            signOut: props.signOut
        }} >
            <div className="img_container" style={{backgroundImage: "url(" + checkImage(props.voucher.image) + ")"}}>
            </div>

            <div className="content_wrapper">
                <div className="title">
                    {props.voucher.title}
                </div>
                <div className="create_date">
                    {formatDate(props.voucher.date.toDate())}
                </div>
            </div>
        </Link>
      
    );
}

export default Voucher;