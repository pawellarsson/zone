import React, { useState, useEffect } from 'react';
import { tmdbNowPlaying, tmdbGenres } from './service/tmdb';
import './App.css';

const apiKey = 'e38d3e0576301c927db1cff267759d40';
const voteRating = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let filterArr = [];
let newFilteredMovies = [];

const App = () => {
  const [movies, setMovies] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState(null);
  const [genres, setGenres] = useState(null);

  /**
   * Sort object based on value provided
   *
   * @param obj   object    object to be sorted
   * @param sortVal   string    value to be sorted by
   * @returns   object    sorted object
   */
  const sortMovies = (obj, sortVal) => {
    return obj.sort((a, b) => -1 * (a[sortVal] - b[sortVal]));
  };

  /**
   * Find and replace genre IDs with genre names in english
   *
   * @param movies    array   array holding all the movies
   * @param genres    object  object holding all the genres
   * @returns         array   movies array
   */
  const findAndReplaceGenres = (movies, genres) => {
    return movies.map(movie => {
      movie.genre_ids.map((id, i) => {
        genres.genres.map(genre => {
          if (id === genre.id) movie.genre_ids[i] = genre.name;
          return movie;
        });
        return movie;
      });
      return movie;
    });
  };

  /**
   * Call TMdB service to get all movies playing now
   */
  const getMoviesPlaying = async () => {
    try {
      await tmdbNowPlaying(apiKey)
        .then(res => {
          sortMovies(res.results, 'popularity');
          getGenres(res.results);
        });
    }
    catch (err) {
      console.warn(err);
    }
  };

  /**
   * Set movies and genres to state
   *
   * @param movies  array   array holding all the movies
   * @param genres  object  object holding all the genres
   */
  const setData = (movies, genres) => {
    setMovies(movies);
    setFilteredMovies(movies);
    setGenres(genres);
  };

  /**
   * Call TMdB service to get all genres
   *
   * @param   movies    array holding all the movies
   */
  const getGenres = async movies => {
    try {
      await tmdbGenres(apiKey)
        .then(res => {
          const sortedMovies = findAndReplaceGenres(movies, res);
          setData(sortedMovies, res);
        });
    }
    catch (err) {
      console.warn(err);
    }
  };

  /**
   * Filter movies based on genres checked
   *
   * @param name      string    genre name
   * @param checked   bool      checked/unchecked checkbox
   */
  const filterGenre = (name, checked) => {
    if (checked) filterArr.push(name);
    else {
      const index = filterArr.indexOf(name);
      if (index > -1) filterArr.splice(index, 1);
    }

    movies.forEach((movie, i) => {
      movie.genre_ids.forEach(genre => {
        filterArr.forEach(id => {
          if (genre === id) {
            newFilteredMovies.push(movie);
          } else {
            newFilteredMovies.forEach(mov => {
              mov.genre_ids.forEach(m => {
                if (m !== name && genre !== id) newFilteredMovies.splice(i, 1);
              });
            });
          }
        });
      });
    });

    if (filterArr.length > 0) setFilteredMovies(newFilteredMovies);
    else setFilteredMovies(movies);
  };

  /**
   * Filter movies based on dropdown rating
   *
   * @param rating    number    selected rating number from dropdown
   */
  const voteRatingChange = rating => {
    newFilteredMovies = [];

    movies.forEach((movie, i) => {
      if (rating <= movie.vote_average) newFilteredMovies.push(movie);
      else newFilteredMovies.splice(i, 1);
    });

    setFilteredMovies(newFilteredMovies);
  };

  /**
   * Start of app, run only once as array is empty
   */
  useEffect(() => {
    getMoviesPlaying();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <select name="voteRating" onChange={e => voteRatingChange(e.target.value)}>
          {
            voteRating.map(rating => {
              return <option value={rating} key={rating}>{rating}</option>
            })
          }
        </select>
        {genres && genres.genres.map(genre => {
          return (
            <label key={genre.name}>
              <input
                type="checkbox"
                value={genre.name}
                onClick={e => filterGenre(genre.name, e.target.checked)}
              />
              {genre.name}
            </label>
          );
        })}
        <div className="row">{/* this is left on purpose, please see readme.md console.log(filteredMovies) */}
          <div className="col-2">
          {
            filteredMovies && filteredMovies.map(movie => {
              return (
                <div key={movie.title} className="movie-box">
                  <div className="title">{movie.title}</div>
                  <div className="poster">
                    <img src={'https://image.tmdb.org/t/p/w154'+movie.poster_path} alt={movie.poster_path} width="120" />
                  </div>
                  <div className="genre">
                    {movie.genre_ids.map(id => `${id} `)}
                  </div>
                </div>
              )
            })
          }
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
