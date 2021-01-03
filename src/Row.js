import axios from './axios';
import React, { useState, useEffect } from 'react';
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const base_url = "https://image.tmdb.org/t/p/w500/";

function Row( { title, fetchUrl, isLargeRow } ){
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();

    },[fetchUrl]);
    // console.table(movies);
    const handleClick = (movie) =>{
        if(trailerUrl){
            setTrailerUrl("");
        }else{
            movieTrailer(movie?.name || "")
            .then((url) => {
                console.log(url);
                // new URL(url).search :-gives us every thing after the question mark from the URL
                // now cont urlParams provides us the access to get the data from with the value for example
                // if we had https://www.something.com?v=kjfkshfkhkash&banana=5
                // now if we want the value of banana we simply need to do urlParams.get('banana'); that will return 5;
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            }).catch((error) => console.log(error))
        }
    }

    const opts = {
        height : "390px",
        width: "100%",
        playerVars: {autoplay:1}
    };

    return(
        <div className="row">
            <h2 style={{color: "white"}}>{title}</h2>

            <div className="row_posters">
                {
                    // movies.map( (movie) => {
                    //     <div>
                    //        <LazyLoadImage
                    //             key={movie.id}
                    //             className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                    //             onClick={()=>handleClick(movie)}
                    //             src={`${base_url}${isLargeRow ? movie.poster_path: movie.backdrop_path}`} 
                    //             alt={movie.name} 
                    //         />
                    //     </div>
                    // })
                    movies.map( (movie) => (
                        <img 
                        key={movie.id}
                        loading="lazy"
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path: movie.backdrop_path}`} 
                        onClick={()=>handleClick(movie)}
                        alt={movie.name} />
                    ))
                }
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
    
}

export default Row;