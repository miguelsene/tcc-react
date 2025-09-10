import { categorias } from '../../data/bazares';
import './CategoryFilter.css';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-filter scroll-animate">
      <h3>
        <i className="bi bi-funnel-fill"></i>
        Filtrar por Categoria
      </h3>
      <div className="categories-grid">
        <button
          className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => onCategoryChange('')}
        >
          <i className="bi bi-grid-fill"></i>
          <span>Todas</span>
        </button>
        {categorias.map(categoria => (
          <button
            key={categoria.id}
            className={`category-btn ${selectedCategory === categoria.nome ? 'active' : ''}`}
            onClick={() => onCategoryChange(categoria.nome)}
            style={{ '--category-color': categoria.cor }}
          >
            <i className={categoria.icon}></i>
            <span>{categoria.nome}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;