// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { TeamProvider } from './context/TeamContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/layout/ToastContainer';

import HomePage from './pages/HomePage';
import PokedexPage from './pages/PokedexPage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import TypesPage from './pages/TypesPage';
import GenerationsPage from './pages/GenerationsPage';
import ComparePage from './pages/ComparePage';
import TeamPage from './pages/TeamPage';
import FavoritesPage from './pages/FavoritesPage';

import ScrollToTop from './components/common/ScrollToTop';

import './App.css';

const App = () => {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <TeamProvider>
          <ToastProvider>
            <Router>
              <ScrollToTop />
              <div className="app-shell">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/pokedex" element={<PokedexPage />} />
                    <Route path="/pokemon/:idOrName" element={<PokemonDetailPage />} />
                    <Route path="/types" element={<TypesPage />} />
                    <Route path="/types/:typeName" element={<TypesPage />} />
                    <Route path="/generations" element={<GenerationsPage />} />
                    <Route path="/generations/:genId" element={<GenerationsPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
                <ToastContainer />
              </div>
            </Router>
          </ToastProvider>
        </TeamProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default App;
