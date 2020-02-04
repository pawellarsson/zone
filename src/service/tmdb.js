/**
 * Fetch call to TMdB to get all the movies currently playing
 *
 * @param apiKey    string    API key
 * @returns         object    result from TMbD with all the movies + some extra info
 */
const tmdbNowPlaying = apiKey => {
  return fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=1`)
    .then(res => res.json())
    .then(data => data);
};

/**
 * Fetch call to TMdB to get all genres
 *
 * @param apiKey    string    API key
 * @returns         object    holding all the genres
 */
const tmdbGenres = apiKey => {
  return fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
    .then(res => res.json())
    .then(data => console.log(data));
};

export { tmdbNowPlaying, tmdbGenres }
