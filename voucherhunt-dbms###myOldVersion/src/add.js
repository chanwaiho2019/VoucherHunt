import React, {Component} from 'react';
import './add.css';
import firebase, {storage} from './firebase';
import {v1} from 'uuid';
import ReactDOM from "react-dom";

//A component to add data to the database
class Add extends Component {

    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.addTag = this.addTag.bind(this);
        
        this.state = {
            image: "",
            tagInput: [
                <div className="tag-element" key={v1()}>
                    <label>Tag</label><br />
                    <input type="text" className="input"></input>
                    <button onClick={this.addTag}>+</button><br />
                </div>   
            ]
        }
    }

    render() {
        return(
            <div>
                <form id="add-data" onSubmit={this.add}>
                    <h1>Add the following data to the databse</h1>
                    <label htmlFor="add-date">Date</label><br />
                    <input type="text" id="add-date" ref="addDate" placeholder="Current timestamp will be added automatically" disabled></input><br />
                    <label htmlFor="add-description">Description</label><br />
                    <input type="text" id="add-description" ref="addDescription"></input><br />
                    <label htmlFor="add-image">Image</label><br />
                    <input type="file" id="add-image" ref="addImage"></input><br />
                    <label htmlFor="add-lat">Latitude</label><br />
                    <input type="text" id="add-lat" ref="addLat"></input><br />
                    <label htmlFor="add-lng">Longitude</label><br />
                    <input type="text" id="add-lng" ref="addLng"></input><br />
                    <div className="tag-field">
                        {this.state.tagInput.map(input => {
                            return input;
                        })}
                    </div>
                    <label htmlFor="add-title">Title</label><br />
                    <input type="text" id="add-title" ref="addTitle"></input><br />
                    <label htmlFor="add-url">URL</label><br />
                    <input type="text" id="add-url" ref="addUrl"></input><br />
                    <label></label>
                    <input type="submit" id="add-submit" value="Add"></input>
                </form>
            </div>
            
        );
    }

    //Add the data to Firebase Firestore
    add(e) {
        //To prevent reload of page when button is clicked
        e.preventDefault();
        //console.log(this.refs.addDate.value);

        try {
            //upload the image to the firebase storage
            const uploadTask = storage.ref(`images/${this.refs.addImage.files[0].name}`).put(this.refs.addImage.files[0]);
            uploadTask.on(
                "state_changed",
                snapshot => {},
                error => {
                    console.log(error);
                },
                () => {
                    storage
                        .ref("images")
                        .child(this.refs.addImage.files[0].name)
                        .getDownloadURL()
                        .then(url => {
                            //console.log(url);
                            this.setState({
                                image: url
                            })
                            //Add the data to Firestore db
                            this.inilializeFirestore();
                        });
                        alert("Successfully added!");
                }
                
            );
        }
        catch (e) {
            alert(e.message);
        }
        
    }

    //Initialize Firestore
    inilializeFirestore() {
        const db = firebase.firestore();

        //Get the values of tag input fields
        var tagValues = [];
        const node = ReactDOM.findDOMNode(this);
        if (node instanceof HTMLElement) {
            const child = node.querySelectorAll('.input');
            for (var i = 0; i < child.length; i++) {
                //  tagValues.push(child[i].value);
                //check if the input field is empty, if yes -> ignore
                if (child[i].value) {
                    tagValues.push(child[i].value);
                }
            }
        }

        const voucherRef = db.collection("vouchers").add({
            date: new Date(),
            description: this.refs.addDescription.value,
            image: this.state.image,
            location: new firebase.firestore.GeoPoint(parseInt(this.refs.addLat.value), parseInt(this.refs.addLng.value)),
            tags: tagValues,
            title: this.refs.addTitle.value,
            url: this.refs.addUrl.value
        });
    }

    //add a new tag input field for the user
    addTag = (e) => {
        //To prevent reload of page when button is clicked
        e.preventDefault();

        this.counterRef++;
        //Get the state
        var tagInputArray = this.state.tagInput;
        //push new item into the array
        tagInputArray.push(
            <div className="tag-element" key={v1()}>
                <input type="text" className="input"></input>
            </div> 
        );

        //update the state
        this.setState({
            tagInput: tagInputArray
        })
    }
}

export default Add;