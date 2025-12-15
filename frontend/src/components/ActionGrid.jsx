import React from 'react';

function ActionGrid({ items = [] }) {
  return (
    <section className="actions-grid">
      {items.map((item) => (
        <button
          key={item.title}
          className="action-card"
          type="button"
          onClick={item.onClick}
        >
          <span className="action-title" dangerouslySetInnerHTML={{ __html: item.title }} />
          <div className="action-icon-circle">
            {item.icon}
          </div>
        </button>
      ))}
    </section>
  );
}

export default ActionGrid;
