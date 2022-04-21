import React, { useContext, useState, useRef, useEffect } from 'react';
import firebase, { storage } from '../firebase';
import {v1} from 'uuid';

//Import components
import AppHeader from "../components/appHeader";
import { AuthContext } from '../contexts/authContext';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
//import css file
import './add.css';

const Add = (props) => {

    //consume the AuthContext
    const {isAuthenticated} = useContext(AuthContext);

    //states
    const [image, setImage] = useState("");
    const [tags, setTags] = useState([]);

    //refs
    const dateInput = useRef();
    const descriptionInput = useRef();
    const imageInput = useRef();
    const latInput = useRef();
    const lngInput = useRef();
    const tagInput = useRef();
    const titleInput = useRef();
    const urlInput = useRef();
    const isFirstRender = useRef(true)

    //Add the data to Firebase Firestore
    const handleSubmit = (e) => {
        //To prevent reload of page when button is clicked
        e.preventDefault();
        //console.log(this.refs.addDate.value);

        try {
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
                            setImage(url);
                        })
                }
            );
        }
        catch (e) {
            alert(e.message);
        }
    }

    //Call initializeFirestore when the image state is updated
    useEffect(() => {
        if (!isFirstRender.current) {
            //Add the data to Firestore db
            inilializeFirestore();
        }
    }, [image])

    //Run only once on initial render
    useEffect(() => {
        // toggle flag after first render/mounting
        isFirstRender.current = false; 
    }, [])

    //Initialize Firestore
    const inilializeFirestore = () => {
        const db = firebase.firestore();

        try {
            //add the data to the firebase database
            const voucherRef = db.collection("vouchers").add({
                date: new Date(),
                description: descriptionInput.current.value,
                image: image,
                location: new firebase.firestore.GeoPoint(parseInt(latInput.current.value), parseInt(lngInput.current.value)),
                tags: tags,
                title: titleInput.current.value,
                url: urlInput.current.value
            }).then(() => {
                //Show a message to indicate success
                alert("Successfully added!");
            }).catch((err) => {
                alert(err.message);
            });
    
            //Clear all input field
            clearAllInputField();
        }
        catch(err) {
            alert(err.message);
        }
    }

    //Clear all the input field
    const clearAllInputField = () => {
        //Reset all the input field
        descriptionInput.current.value = "";
        imageInput.current.value = "";
        latInput.current.value = "";
        lngInput.current.value = "";
        tagInput.current.value = "";
        titleInput.current.value = "";
        urlInput.current.value = "";

        //clear the state of tags
        setTags([]);
    }

    //Add a new tag and store in an array
    const addTag = (e) => {
        
        if(tagInput.current.value == ""){
            return;
        }
        //To prevent reload of page when button is clicked
        e.preventDefault();

        //update the state
        setTags([...tags, tagInput.current.value]);

        //reset the input field
        tagInput.current.value = "";
    }

    //Delete the tag from the state
    const deleteTag = (e) => {
        var newTags = tags.filter((tag) => tag !== e.target.innerHTML)
        setTags(newTags);
    }

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <AppHeader />
                    <Container className="content" fluid="md">
                        <Row>
                            <Col md="12">
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="field_label">Date</Form.Label>
                                        <Form.Control type="date" ref={dateInput} placeholder="Added automatically" readOnly/>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="field_label">Description</Form.Label>
                                        <Form.Control as="textarea"  ref={descriptionInput} rows="3" />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="field_label">Image</Form.Label>
                                        <Form.File id="exampleFormControlFile1" ref={imageInput}/>
                                    </Form.Group>
                                    <Form.Row>
                                        <Form.Group as={Col} md="6" controlId="formLatitude">
                                            <Form.Label className="field_label">Latitude</Form.Label>
                                            <Form.Control type="text" ref={latInput} placeholder="Latitude" />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" controlId="formLongitude">
                                            <Form.Label className="field_label">Longitude</Form.Label>
                                            <Form.Control type="text" ref={lngInput} placeholder="Longitude" />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="6" controlId="formTags">
                                            <Form.Label className="field_label">Tags</Form.Label>
                                            <Row>
                                                <Col sm="8" md="8"><Form.Control type="text" ref={tagInput}/></Col>
                                                <Col sm="4" md="4"><Button className="btn_add" variant="info" onClick={addTag}>Add</Button></Col>
                                            </Row>
                                        </Form.Group>
                                    </Form.Row>
                                    <Row className="tagRow">
                                        {tags.map((tag, index) => <Col className="tag_wrap" md="4" key={index}>
                                                                        <div className="tag" onClick={deleteTag}>{tag}
                                                                        </div>
                                                                    </Col>)}
                                    </Row>
                                    <Form.Group controlId="formTitle">
                                        <Form.Label className="field_label">Title</Form.Label>
                                        <Form.Control type="text" ref={titleInput} placeholder="Title" />
                                    </Form.Group>
                                    <Form.Group controlId="formURL">
                                        <Form.Label className="field_label">URL</Form.Label>
                                        <Form.Control type="text" ref={urlInput} placeholder="URL" />
                                    </Form.Group>
                                    <Form.Row>
                                        <Button className="btn_submit" variant="primary" type="submit">
                                            Submit
                                        </Button>
                                    </Form.Row>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </div>
            ) : (
                <div>
                    <AppHeader />
                </div>
            )}
        </div>
    );
}

export default Add;

// //A component to add data to the database
// class Add extends Component {

//     constructor(props) {
//         super(props);
//         this.handleSubmit = this.handleSubmit.bind(this);
//         this.addTag = this.addTag.bind(this);
//         this.deleteTag = this.deleteTag.bind(this);
//         this.clearAllInputField = this.clearAllInputField.bind(this);
        
//         //State
//         this.state = {
//             image: "",
//             tags: []
//         }
//     }


//     render() {  
//         if (this.props.location.isSignedIn) {
//             return(
//                 <div>
//                     <AppHeader isSignedIn={this.props.location.isSignedIn} signOut={this.props.location.signOut}/>
//                     {/* <AppHeader signOut={this.props.location.signOut}/> */}
//                     <div className="container">
//                         <form id="add-data" onSubmit={this.handleSubmit}>
//                             <div className="field">
//                                 <label htmlFor="add-date">Date</label>
//                                 <input type="text" id="add-date" ref="addDate" placeholder="Current timestamp will be added automatically" disabled></input>
//                             </div>
//                             <div className="field">
//                                 <label htmlFor="add-description">Description</label>
//                                 <input type="text" id="add-description" ref="addDescription" />
//                             </div>
//                             <div className="file_field">
//                                 <label htmlFor="add-image">Image</label>
//                                 <input type="file" id="add-image" ref="addImage"></input>
//                             </div>
//                             <div className="field">
//                                 <label htmlFor="add-lat">Latitude</label>
//                                 <input type="text" id="add-lat" ref="addLat"></input>
//                             </div>
//                             <div className="field">
//                                 <label htmlFor="add-lng">Longitude</label>
//                                 <input type="text" id="add-lng" ref="addLng"></input>
//                             </div>
    
//                             <div className="field">
//                                 <label htmlFor="add-tag">Tag</label>
//                                 <input type="text" id="add-tag" ref="addTag"></input>
//                                 <button onClick={this.addTag}>Add Tag</button>
//                             </div>
//                             <div className="add_tag_label">
//                                 {this.state.tags.map((tag) => <label key={v1()} onClick={this.deleteTag}>{tag}</label>)}
//                             </div>
    
//                             <div className="field">
//                                 <label htmlFor="add-title">Title</label>
//                                 <input type="text" id="add-title" ref="addTitle"></input>
//                             </div>
    
//                             <div className="field">
//                                 <label htmlFor="add-url">URL</label>
//                                 <input type="text" id="add-url" ref="addUrl"></input>
//                             </div>
    
//                             <div className="field">
//                                 <input type="submit" id="add-submit" value="Add"></input>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             );
//         }
//         else {
//             return (
//                 <div>
//                     <AppHeader isSignedIn={this.props.location.isSignedIn} signOut={this.props.location.signOut} />
//                     <Redirect to='/'/>
//                 </div>
//             );
//         }
//     }

//     //Add the data to Firebase Firestore
//     handleSubmit(e) {
//         //To prevent reload of page when button is clicked
//         e.preventDefault();
//         //console.log(this.refs.addDate.value);

//         try {
//             //upload the image to the firebase storage
//             const uploadTask = storage.ref(`images/${this.refs.addImage.files[0].name}`).put(this.refs.addImage.files[0]);
//             uploadTask.on(
//                 "state_changed",
//                 snapshot => {},
//                 error => {
//                     console.log(error);
//                 },
//                 () => {
//                     storage
//                         .ref("images")
//                         .child(this.refs.addImage.files[0].name)
//                         .getDownloadURL()
//                         .then(url => {
//                             //console.log(url);
//                             this.setState({
//                                 image: url
//                             })
//                             //Add the data to Firestore db
//                             this.inilializeFirestore();
//                         });
//                 }
//             );
//         }
//         catch (e) {
//             alert(e.message);
//         }
        
//     }

//     //Initialize Firestore
//     inilializeFirestore() {
//         const db = firebase.firestore();

//         try {
//             //add the data to the firebase database
//             const voucherRef = db.collection("vouchers").add({
//                 date: new Date(),
//                 description: this.refs.addDescription.value,
//                 image: this.state.image,
//                 location: new firebase.firestore.GeoPoint(parseInt(this.refs.addLat.value), parseInt(this.refs.addLng.value)),
//                 tags: this.state.tags,
//                 title: this.refs.addTitle.value,
//                 url: this.refs.addUrl.value
//             }).then(() => {
//                 //Show a message to indicate success
//                 alert("Successfully added!");
//             }).catch((err) => {
//                 alert(err.message);
//             });
    
//             //Clear all input field
//             this.clearAllInputField();
//         }
//         catch(err) {
//             alert(err.message);
//         }
//     }

//     //Clear all the input field
//     clearAllInputField() {
//         //Reset all the input field
//         this.refs.addDescription.value = "";
//         this.refs.addImage.value = "";
//         this.refs.addLat.value = "";
//         this.refs.addLng.value = "";
//         this.refs.addTag.value = "";
//         this.refs.addTitle.value = "";
//         this.refs.addUrl.value = "";

//         //clear the state of tags
//         this.setState({
//             tags: []
//         })
//     }

//     //Add a new tag and store in an array
//     addTag(e) {
//         //To prevent reload of page when button is clicked
//         e.preventDefault();

//         //update the state
//         this.setState({
//             tags: [...this.state.tags, this.refs.addTag.value]
//         })

//         //reset the input field
//         this.refs.addTag.value = "";
//     }

//     //Delete the tag from the state
//     deleteTag(e) {
//         var newTags = this.state.tags.filter((tag) => tag !== e.target.innerHTML)
//         this.setState({
//             tags: newTags
//         })
//     }
// }

// export default Add;