interface Movie {
  category_id: number;
  cover: string;
  description: string;
  duration: number;
  id: number;
  score: string;
  showingon: string;
  star_actor: string;
  title: string;
  type: string;
  actor?: string;
  director?: string;
  thumb?: string;
}

export default Movie;