
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Link, Image, Video, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploaderProps {
  onImageUploaded?: (url: string) => void;
  onVideoAdded?: (url: string) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

const MediaUploader = ({ 
  onImageUploaded, 
  onVideoAdded, 
  acceptedTypes = "image/*",
  maxSizeMB = 10 
}: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "❌ Fichier trop volumineux",
        description: `Le fichier ne doit pas dépasser ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('fadem-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('fadem-images')
        .getPublicUrl(fileName);

      onImageUploaded?.(publicUrl);
      
      toast({
        title: "✅ Upload réussi",
        description: "L'image a été uploadée avec succès",
      });

    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "❌ Erreur d'upload",
        description: "Impossible d'uploader le fichier",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleVideoUrl = () => {
    if (!videoUrl.trim()) {
      toast({
        title: "❌ URL manquante",
        description: "Veuillez saisir une URL valide",
        variant: "destructive",
      });
      return;
    }

    // Valider que c'est une URL de vidéo
    const isValidVideoUrl = 
      videoUrl.includes('youtube.com') || 
      videoUrl.includes('youtu.be') || 
      videoUrl.includes('facebook.com') || 
      videoUrl.includes('vimeo.com') ||
      videoUrl.includes('dailymotion.com');

    if (!isValidVideoUrl) {
      toast({
        title: "⚠️ URL non supportée",
        description: "Utilisez YouTube, Facebook, Vimeo ou Dailymotion",
        variant: "destructive",
      });
      return;
    }

    onVideoAdded?.(videoUrl);
    setVideoUrl('');
    
    toast({
      title: "✅ Vidéo ajoutée",
      description: "L'URL vidéo a été ajoutée avec succès",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload d'images */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-fadem-blue" />
              <Label className="text-base font-medium">Upload d'images</Label>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept={acceptedTypes}
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-fadem-blue animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-fadem-blue" />
                )}
                <span className="text-sm text-gray-600">
                  {uploading ? 'Upload en cours...' : 'Cliquez pour uploader une image'}
                </span>
                <span className="text-xs text-gray-400">
                  JPG, PNG, GIF jusqu'à {maxSizeMB}MB
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL de vidéo */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-fadem-blue" />
              <Label className="text-base font-medium">Ajouter une vidéo</Label>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="border-fadem-blue/20 focus:border-fadem-blue"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports: YouTube, Facebook, Vimeo, Dailymotion
                </p>
              </div>
              <Button 
                onClick={handleVideoUrl}
                disabled={!videoUrl.trim()}
                className="bg-fadem-blue hover:bg-fadem-blue-dark"
              >
                <Link className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaUploader;
