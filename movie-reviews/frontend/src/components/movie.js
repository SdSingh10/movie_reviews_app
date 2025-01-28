import React, { useState, useEffect } from 'react'
import MovieDataService from '../services/movies'
import { Link, useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import moment from 'moment'

const Movie = ({ user }) => {
    const { id } = useParams();
    console.log("Movie ID from params:", id);

    // const [movie, setMovie] = useState({
    //     id: null,
    //     title: "",
    //     rated: "",
    //     reviews:[]
    // })
    const [movie, setMovie] = useState({
        id: null,
        title: "Unknown Title",
        rated: "Not Rated",
        reviews: [],
        plot: "No description available.",
        poster: null,
    });

    const getMovie = id => {
        if (!id) {
            console.error("Movie ID is undefined. Cannot fetch movie.");
            return;
        }

        MovieDataService.get(id)
            .then(response => {
                console.log(response);
                setMovie(response.data)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }

    useEffect(() => {
        if (!id) {
            console.error("Movie ID is undefined. Cannot fetch movie.");
            return;
        }
        console.log("Fetching movie with ID:", id);
        getMovie(id);
    }, [id]);


    const deleteReview = (reviewId, index) => {
        MovieDataService.deleteReview(reviewId, user.id).then(response => {
            setMovie((prevState) => {
                prevState.reviews.splice(index, 1)
                return ({
                    ...prevState
                })
            })
        })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Image
                            src={movie.poster ? `${movie.poster}/100px180` : "placeholder-image-url"}
                            fluid
                        />
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header as="h5">{movie.title}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {movie.plot}
                                </Card.Text>
                                {user &&
                                    <Link to={`/movies/${id}/review`}>
                                        Add Review
                                    </Link>}
                            </Card.Body>
                        </Card>
                        <h2>Reviews</h2>
                        <br></br>
                        {movie.reviews.map((review, index) => {
                            return (
                                <Card key={review._id}>
                                    <Card.Body>
                                        <h5>{review.name + " reviewed on "} {moment(review.date)
                                            .format("Do MMMM YYYY")}</h5>
                                        <p>{review.review}</p>
                                        {user && user.id === review.user_id &&
                                            <Row>
                                                <Col>
                                                    <Link to={`/movies/${id}/review`} state={{ currentReview: review }}>
                                                        Edit
                                                    </Link>

                                                </Col>
                                                <Col><Button variant="link"
                                                    onClick={() => deleteReview(review._id, index)}>
                                                    Delete</Button></Col>
                                            </Row>}
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default Movie;