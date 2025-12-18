import React from 'react';

const FeatureCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-card transition-shadow duration-300 border border-gray-50">
    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-2xl mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
    <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
  </div>
);

export default FeatureCard;