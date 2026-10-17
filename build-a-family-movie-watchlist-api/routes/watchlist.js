import express from "express";
import { authorizeModification } from "../middleware/authorize.js";
import { authenticate } from "../middleware/authenticate.js";
import { addMovie, getWatchlist, updateMovie, deleteMovie } from "../utils/db.js";

const router = express.Router();

router.get('/:userId',authenticate,async (req,res) => {
  const userId = Number(req.params.userId);
  const watchlist = getWatchlist(userId);

  return res.status(200).json({
    message:"ok",
    watchlist
  });
});

router.post('/:userId/movies', authenticate, authorizeModification, async (req, res) => {
  const userId = Number(req.params.userId);
  const { title, genre } = req.body;

  const movie = addMovie(userId, { title, genre });

  if (!movie) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(201).json({
    message: "ok",
    movie
  });
});

router.put('/:userId/movies/:movieId',authenticate,authorizeModification,(req,res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);
  const {title,genre,watched} = req.body;

  const movie = updateMovie(userId,movieId,{
    title,
    genre,
    watched
  });

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  return res.status(200).json({ message: 'ok', movie });

});

router.delete("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const deleted = deleteMovie(userId, movieId);

  if (!deleted) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  return res.status(200).json({ message: 'ok' });
});

export default router;