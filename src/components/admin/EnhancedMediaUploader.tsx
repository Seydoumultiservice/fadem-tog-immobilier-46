
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMediaUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  acceptVideo?: boolean;
  onVideoChange?: (videoUrl: string) => void;
  videoUrl?: string;
}

const EnhancedMediaUploader = ({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  acceptVideo = false,
  onVideoChange,
  videoUrl
}: EnhancedMediaUploaderProps) => {
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('fadem-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('fadem-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const uploadPromises = acceptedFiles.map(uploadFile);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const isVideo = acceptedFiles[0].type.startsWith('video/');
      
      if (isVideo && acceptVideo && onVideoChange) {
        onVideoChange(uploadedUrls[0]);
        toast({
          title: "✅ Vidéo uploadée",
          description: "La vidéo a été ajoutée avec succès",
        });
      } else {
        const newImages = [...images, ...uploadedUrls].slice(0, maxImages);
        onImagesChange(newImages);
        toast({
          title: "✅ Images uploadées",
          description: `${uploadedUrls.length} image(s) ajoutée(s)`,
        });
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de l'upload",
        variant: "destructive",
      });
    }
  }, [images, onImagesChange, maxImages, acceptVideo, onVideoChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      ...(acceptVideo && { 'video/*': ['.mp4', '.webm', '.ogg'] })
    },
    maxFiles: acceptVideo ? 1 : maxImages - images.length
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeVideo = () => {
    if (onVideoChange) {
      onVideoChange('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-fadem-blue transition-colors">
        <div
          {...getRootProps()}
          className={`p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'bg-fadem-blue/10' : 'hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-600 mb-2">
            {isDragActive
              ? 'Déposez les fichiers ici...'
              : `Glissez-déposez vos ${acceptVideo ? 'médias' : 'images'} ou cliquez pour sélectionner`}
          </p>
          <p className="text-sm text-gray-500">
            {acceptVideo 
              ? 'Images: PNG, JPG, JPEG, GIF, WebP - Vidéos: MP4, WebM, OGG'
              : 'PNG, JPG, JPEG, GIF, WebP'
            }
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {acceptVideo 
              ? `Max: ${maxImages} images + 1 vidéo`
              : `Maximum ${maxImages} images`
            }
          </p>
        </div>
      </Card>

      {/* Aperçu des images */}
      {images.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <Image className="w-4 h-4 mr-2" />
            Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aperçu de la vidéo */}
      {acceptVideo && videoUrl && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <Video className="w-4 h-4 mr-2" />
            Vidéo
          </h4>
          <div className="relative group">
            <video
              src={videoUrl}
              controls
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={removeVideo}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMediaUploader;
