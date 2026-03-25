import { createContext, useState, useContext, useEffect, useCallback } from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([])
    const [toast, setToast] = useState(null) // { message, type: 'success' | 'remove' }

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")
        if (storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }, [])

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
        showToast(`"${movie.title}" added to favorites!`, 'success')
    }

    const removeFromFavorites = (movieId, title = '') => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
        if (title) showToast(`"${title}" removed from favorites`, 'remove')
    }

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toast,
        showToast,
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}