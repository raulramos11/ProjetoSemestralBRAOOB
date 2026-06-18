import React from 'react';
import { NavLink } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Página não encontrada</h2>
        <p className="not-found-description">
          A página que você procura não existe ou foi movida.
        </p>
        <NavLink to="/" className="btn btn-primary">
          Voltar ao Início
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;