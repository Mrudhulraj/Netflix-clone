import React,{useState,useEffect} from 'react'
import axios from "./axios"; //importing instance variable since instance variable is imported default --> axios is ab alias object here 
import "./Row.css"
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const baseUrl="https://image.tmdb.org/t/p/original/"
function Row({title,fetchUrl,isLargeRow}){

    const [movies,setMovies]= useState([]);
    const[trailerUrl,setTrailerUrl]=useState("");
    useEffect(()=>{ //you cant use async in useEffect but there is a 
        async function fetchData(){
            const request= await axios.get(fetchUrl)
            // console.log(request)
            setMovies(request.data.results);
            return request
        }
    fetchData();
    },
    [fetchUrl]);

    const opts={
        height:"390",
        width:"100%",
        playerVars:{
            autoplay:1
        }
    };

    const handleClick=(movie)=>{
        console.log(movie);
        if(trailerUrl){
            setTrailerUrl('');
        }else{
            movieTrailer(movie?.name || "").then(url=>{
                const urlParams=new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            })
            .catch((error)=>console.log(error))
        }
    }
    return(
        <div className='row'>
            <h2>{title}</h2>
            <div className="row_posters">
                {movies.map(movie=>(
                  <img key={movie.id} 
                  onClick={()=> handleClick({movie})}
                  className={`row_poster ${isLargeRow && "row_posterLarge"}`} 
                  src={`${baseUrl}${isLargeRow ? movie.poster_path:movie.backdrop_path}`} 
                  alt={movie.name} />  
                    /*key used to re-render the movie only onstead of whole row again and again i.e makes it faster*/
                ))}
            </div>
           {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}
        </div>
    )
}

export default Row