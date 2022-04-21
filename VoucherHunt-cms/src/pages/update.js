import React, { useState, useRef, useContext } from 'react';
import {v1} from 'uuid';
import firebase, { storage } from '../firebase';
import { confirmAlert } from 'react-confirm-alert';

//Import components
import AppHeader from '../components/appHeader';
import { AuthContext } from '../contexts/authContext';

// Import css
import './update.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Update = (props) => {
    //consume the AuthContext
    const {isAuthenticated} = useContext(AuthContext);

    //Destructure the voucher (separate id and the rest of data)
    const {id, ...otherData} = props.location.voucher;
    //State (we do not need to store the id as an attribute)
    const [voucher, setVoucher] = useState(otherData);

    //Reference to element
    const tagInput = useRef();
    const imageInput = useRef();

    //When user refresh the page, it will redirect to the main page to prevent error occurs
    window.onbeforeunload = () => { 
        window.setTimeout(() => { 
            window.location = '/';
        }, 0); 
        window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
    }

    //Update the voucher data when onChange is called
    const handleOnChange = (e) => {
        //check if the event is about latitude
        if (e.target.name === 'latitude') {
            setVoucher({...voucher, location: {latitude: e.target.value, longitude: voucher.location.longitude}});
        }
        else if (e.target.name === 'longitude') { //check if the event is about longitude
            setVoucher({...voucher, location: {latitude: voucher.location.latitude,longitude: e.target.value}});
        }
        else {
            var key = e.target.name;
            var obj = {};
            obj[key] = e.target.value;
            setVoucher({...voucher, ...obj});
        }
    }

    //Add a new tag input field for user
    const addTag = (e) => {
        //prevent default refresh
        e.preventDefault();

        //Add the new tag to the tags array in voucher
        setVoucher({...voucher, tags: [...voucher.tags, tagInput.current.value]})

        //reset the input field
        tagInput.current.value = "";
    } 

    //Delete the tag
    const deleteTag = (e) => {
        //prevent default refresh
        e.preventDefault();

        //Filter out the tag that we want to delete
        var newTags = voucher.tags.filter((tag) => tag !== e.target.innerHTML);

        //update the voucher
        setVoucher({...voucher, tags: [...newTags]});
    }

    //Format the date to yyyy-mm-dd
    const formatDate = (_date) => {
        var temp = _date.toLocaleDateString().split('/');
        var dd = temp[0];
        var mm = temp[1];
        var yyyy = temp[2];
        return yyyy + '-' + mm + '-' + dd;
    };

    //Update the data of specific document in the db
    const updateFirestore = (imageUrl) => {
        //update the data
        const db = firebase.firestore();

        //check if an imageUrl is passed as an argument
        if (imageUrl !== undefined) {
            db.collection('vouchers').doc(id).set({...voucher, 
                                                    date: new Date(), 
                                                    image: imageUrl,
                                                    location: new firebase.firestore.GeoPoint(parseInt(voucher.location.latitude), parseInt(voucher.location.longitude))
                                                });
        }
        else {    //this function is called with empty argument
            db.collection('vouchers').doc(id).set({...voucher, 
                                                    date: new Date(), 
                                                    location: new firebase.firestore.GeoPoint(parseInt(voucher.location.latitude), parseInt(voucher.location.longitude))
                                                });
        }

        //Show a message to indicate success
        alert("Successfully updated!");
    }

    //Delete the original image in the db
    const deleteImageFromFireStore = (url) => {
        // Create a reference to the file to delete
        var imageRef = storage.refFromURL(url);
        // Delete the file
        imageRef.delete().then(() => {
            // File deleted successfully
            console.log("Successfully deleted original image");
        }).catch((e) => {
            alert("Fail to delete original image");
        });

    } 

    //Toggle an alert dialog to confirm the delete action
    const toggleAlert = (e) => {
        e.preventDefault();

        //Pop up an alert window
        confirmAlert({
            // title: 'Confirm delete',
            message: 'Are you sure you want to delete this document?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteDocument()
              },
              {
                label: 'No'
                // onClick: () => alert('Click No')
              }
            ]
        });
    }

    //Delete the document in the db
    const deleteDocument = () => {
        try {
            const db = firebase.firestore();
            //Delete the data 
            db.collection('vouchers').doc(id).delete().then(() => {
                //Delete image 
                deleteImageFromFireStore(voucher.image);

                //Show a message to indicate success
                alert('Successfully deleted');

                //navigate back to the main page without refreshing
                props.history.push('/');

            });
        }
        catch(err) {
            alert(err.message);
        }
    }

    //Update the data in the database
    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            //check if the user has chosen a new image
            if (imageInput.current.files[0] === undefined) {
                //Update the data in Firestore db and supply the latest image url as argument
                updateFirestore();
            }
            else {     //the original image is kept using
                //upload the image to the firebase storage
                const uploadTask = storage.ref(`images/${imageInput.current.files[0].name}`).put(imageInput.current.files[0]);
                uploadTask.on(
                    "state_changed",
                    snapshot => {},
                    error => {
                        // console.log(error);
                        alert(error.message);
                    },
                    () => {
                        storage
                            .ref("images")
                            .child(imageInput.current.files[0].name)
                            .getDownloadURL()
                            .then(url => {
                                // console.log(url);

                                //Delete the original image first
                                deleteImageFromFireStore(voucher.image);

                                //set the state of image in voucher to the new image url
                                setVoucher({
                                    ...voucher, image: url
                                });
                                
                                //Update the data in Firestore db and supply the latest image url as argument
                                updateFirestore(url);
                            });
                    }
                );
            }
        }
        catch (err) {
            alert(err.message);
        }
    }


    return (
        <div className="update-container">
            <AppHeader />
            <Container className="content" fluid="md">
                <Row>
                    <Col md="12">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formId">
                                <Form.Label className="field_label">ID</Form.Label>
                                <Form.Control type="text"  placeholder={id}  readOnly/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className="field_label">Date</Form.Label>
                                <Form.Control type="date" value={formatDate(voucher.date.toDate())} readOnly/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className="field_label">Description</Form.Label>
                                <Form.Control as="textarea"   name="description" value={voucher.description} rows="3" onChange={handleOnChange} disabled={isAuthenticated ? false : true}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className="field_label">Image</Form.Label>
                                <div className="image_container">
                                    <img src={voucher.image}></img>
                                </div>
                                <Form.File id="exampleFormControlFile1" ref={imageInput} disabled={isAuthenticated ? false : true}/>
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} md="6" controlId="formLatitude">
                                    <Form.Label className="field_label">Latitude</Form.Label>
                                    <Form.Control type="text" placeholder="Latitude" value={voucher.location.latitude} name="latitude" onChange={handleOnChange} disabled={isAuthenticated ? false : true} />
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="formLongitude">
                                    <Form.Label className="field_label">Longitude</Form.Label>
                                    <Form.Control type="text"  placeholder="Longitude" value={voucher.location.longitude} name="longitude" onChange={handleOnChange} disabled={isAuthenticated ? false : true}/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md="6" controlId="formTags">
                                    <Form.Label className="field_label">Tags</Form.Label>
                                    <Row>
                                        <Col sm="8" md="8"><Form.Control type="text" ref={tagInput}/></Col>
                                        <Col sm="4" md="4"><Button className="btn_add" variant="info" onClick={isAuthenticated ? addTag : null}>Add</Button></Col>
                                    </Row>
                                </Form.Group>
                            </Form.Row>
                            <Row className="tagRow">
                                {voucher.tags.map((tag, index) => <Col className="tag_wrap" md="4" key={index}>
                                                                <div className="tag" onClick={isAuthenticated ? deleteTag : null}>{tag}
                                                                </div>
                                                            </Col>)}
                            </Row>
                            <Form.Group controlId="formTitle">
                                <Form.Label className="field_label">Title</Form.Label>
                                <Form.Control type="text"  placeholder="Title" value={voucher.title} name="title" onChange={handleOnChange} disabled={isAuthenticated ? false : true} />
                            </Form.Group>
                            <Form.Group controlId="formURL">
                                <Form.Label className="field_label">URL</Form.Label>
                                <Form.Control type="text" placeholder="URL" value={voucher.url} name="url" onChange={handleOnChange} disabled={isAuthenticated ? false : true} />
                            </Form.Group>
                            {isAuthenticated ? (
                                <Form.Row disabled={isAuthenticated ? false : true}>
                                    <Button className="btn_submit" variant="primary" type="submit">
                                        Update
                                    </Button>
                                        <Button className="btn_submit" variant="danger" type="submit" onClick={toggleAlert}>
                                            Delete
                                        </Button>
    
                                </Form.Row>
                            ) : null}

                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
 
export default Update;