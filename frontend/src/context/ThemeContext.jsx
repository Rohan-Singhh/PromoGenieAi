import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user's theme preference on mount
    useEffect(() => {
        const fetchThemePreference = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user && user.theme) {
                    setTheme(user.theme);
                }
            } catch (error) {
                console.error('Error fetching theme preference:', error);
                // Fallback to system preference if there's an error
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                setTheme(systemTheme);
            } finally {
                setIsLoading(false);
            }
        };

        fetchThemePreference();
    }, []);

    // Update theme in backend when it changes
    const updateThemeInBackend = async (newTheme) => {
        try {
            await authService.updateTheme(newTheme);
        } catch (error) {
            console.error('Error updating theme preference:', error);
        }
    };

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        updateThemeInBackend(newTheme);

        // Apply theme to document
        if (newTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        } else {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
    };

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (theme === 'system') {
                document.documentElement.classList.toggle('dark', e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // Initial theme application
    useEffect(() => {
        if (!isLoading) {
            if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', systemTheme === 'dark');
            } else {
                document.documentElement.classList.toggle('dark', theme === 'dark');
            }
        }
    }, [theme, isLoading]);

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 