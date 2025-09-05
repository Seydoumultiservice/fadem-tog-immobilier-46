
import React from 'react';
import { X } from 'lucide-react';
import { GalleryImage } from '@/types/database';

interface ImageModalProps {
  image: GalleryImage;
  onClose: () => void;
}

const ImageModal = ({ image, onClose }: ImageModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-full bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <img
              src={image.image_url}
              alt={image.titre}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div className="md:w-1/3 p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-fadem-blue mb-4">
              {image.titre}
            </h2>
            
            {image.description && (
              <p className="text-gray-700 mb-4 leading-relaxed">
                {image.description}
              </p>
            )}
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{new Date(image.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              
              {image.categorie && (
                <div className="flex justify-between">
                  <span className="font-medium">Catégorie:</span>
                  <span className="capitalize">{image.categorie}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="font-medium">Statut:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  image.statut === 'publie' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {image.statut?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
