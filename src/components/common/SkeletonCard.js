// src/components/common/SkeletonCard.js
import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-pill skeleton-id" />
        <div className="skeleton-circle" />
      </div>
      <div className="skeleton-artwork" />
      <div className="skeleton-title" />
      <div className="skeleton-badges">
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
      </div>
      <div className="skeleton-footer" />
    </div>
  );
};

export default SkeletonCard;
