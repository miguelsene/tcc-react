import { useState, useEffect } from 'react';
import { favoritoService, getUsuarioLogado } from '../services/api';

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = getUsuarioLogado();
    setUsuario(user);
    
    const handleUserChange = () => {
      const updatedUser = getUsuarioLogado();
      setUsuario(updatedUser);
    };

    window.addEventListener('userUpdated', handleUserChange);
    return () => window.removeEventListener('userUpdated', handleUserChange);
  }, []);

  const verificarFavorito = async (bazarId) => {
    if (!usuario) return false;
    
    try {
      return await favoritoService.verificar(usuario.id, bazarId);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  };

  const toggleFavorito = async (bazarId) => {
    console.log('Usuario no hook:', usuario);
    
    if (!usuario || usuario.tipoUsuario === 'guest') {
      alert('Você precisa estar logado para favoritar bazares');
      return false;
    }

    if (usuario.tipoUsuario === 'dono') {
      alert('Donos de bazar não podem favoritar bazares');
      return false;
    }

    setLoading(true);
    try {
      const isFavorito = favoritos.has(bazarId);
      
      if (isFavorito) {
        await favoritoService.remover(usuario.id, bazarId);
        setFavoritos(prev => {
          const newSet = new Set(prev);
          newSet.delete(bazarId);
          return newSet;
        });
      } else {
        await favoritoService.adicionar(usuario.id, bazarId);
        setFavoritos(prev => new Set([...prev, bazarId]));
      }

      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      return !isFavorito;
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      alert('Erro ao alterar favorito. Tente novamente.');
      return favoritos.has(bazarId);
    } finally {
      setLoading(false);
    }
  };

  const isFavorito = (bazarId) => {
    return favoritos.has(bazarId);
  };

  const carregarFavoritos = async () => {
    if (!usuario || usuario.tipoUsuario === 'guest' || usuario.tipoUsuario === 'dono') return;

    try {
      const bazaresFavoritos = await favoritoService.listarPorUsuario(usuario.id);
      const favoritosIds = new Set(bazaresFavoritos.map(bazar => bazar.id.toString()));
      setFavoritos(favoritosIds);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  useEffect(() => {
    carregarFavoritos();
  }, [usuario?.id]);

  return {
    favoritos,
    loading,
    toggleFavorito,
    isFavorito,
    verificarFavorito,
    carregarFavoritos
  };
};