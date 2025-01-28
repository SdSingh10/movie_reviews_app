import React, { useState } from 'react'
import MovieDataService from "../services/movies"
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = ({user}) => {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    console.log(location);
    console.log(location.state?.currentReview);
    const [review, setReview] = useState('')



    let editing = false
    let initialReviewState = ""
    console.log(initialReviewState);
    
   

    if(location.state && location.state.currentReview){
        editing = true
        initialReviewState = location.state.currentReview.review
        console.log(initialReviewState);
        if(initialReviewState!=""){
        console.log(review)
    }else{ 
        setReview(initialReviewState);}
    }

    const [submitted, setSubmitted] = useState(false)

    const onChangeReview = e => {
        const review = e.target.value
        setReview(review);
    }

    const saveReview = () => {
        var data = {
            review: review,
            name: user.name,
            user_id: user.id,
            movie_id: id,
        }
        if(editing){
            data.review_id = location.state.currentReview._id
            MovieDataService.updateReview(data).then(response =>{
                setSubmitted(true);
                console.log(response.data)
            })
            .catch(e =>{
                console.log(e);
            })
        }
        else{
            MovieDataService.createReview(data).then(response => {
                setSubmitted(true)
            })
            .catch(e =>{
                console.log(e);
            })
        }
    }
    return(
        <div>
            {submitted ? (
                <div>
                    <h4>Review submitted succesfully</h4>
                    <Link to={`/movies/${id}`}>Back to movie</Link>
                    {/* <Link to={"/movies"+props.match.params.id}>Back to movie</Link> */}
                </div>
            ) : (
                <Form>
                    <Form.Group>
                        <Form.Label>{editing ? "Edit" : "Create"}Review</Form.Label>
                        <Form.Control
                        type="text"
                        required
                        value={review}
                        onChange={onChangeReview}/>
                    </Form.Group>
                    <Button variant="primary" onClick={saveReview}>Submit</Button>
                </Form>
            )}
        </div>
    )
}
export default AddReview;