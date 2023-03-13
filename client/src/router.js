import {createBrowserRouter} from "react-router-dom";
import HomePage, { loader as HomeLoader } from "./pages/HomePage";
import AddMovie from "./pages/AddMovie";
import MoviePage from "./pages/MoviePage";
import App from "./App";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
        {
            path: "/",
            element: <HomePage />,
            loader: HomeLoader
        },
        {
            path: "movie/add",
            element: <AddMovie />
        },
        {
            path: "movie/:movieId",
            element: <MoviePage />
        },
    
        ]
    },
]);

export default router;