
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Image, Check, AlertCircle, FileImage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  file: File;
  preview: string;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  error?: string;
  url?: string;
}

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[], uploadStatus: { isUploading: boolean; allUploaded: boolean }) => void;
  maxFiles?: number;
  accept?: string;
  existingImages?: string[];
  onUploadStatusChange?: (isUploading: boolean) => void;
}

const ImageUploader = ({ 
  onImagesUploaded, 
  maxFiles = 10, 
  accept = "image/*",
  existingImages = [],
  onUploadStatusChange
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "❌ Erreur",
        description: "Veuillez sélectionner des fichiers image valides",
        variant: "destructive"
      });
      return;
    }

    if (files.length + imageFiles.length > maxFiles) {
      toast({
        title: "⚠️ Limite atteinte",
        description: `Vous ne pouvez uploader que ${maxFiles} images maximum`,
        variant: "destructive"
      });
      return;
    }

    const uploadFiles: UploadedFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      progress: 0,
      uploaded: false
    }));

    setFiles(prev => [...prev, ...uploadFiles]);
    
    toast({
      title: "📁 Images sélectionnées",
      description: `${imageFiles.length} image(s) prête(s) à être uploadée(s)`,
    });
  };

  const uploadFile = async (fileIndex: number) => {
    const fileData = files[fileIndex];
    if (!fileData || fileData.uploading || fileData.uploaded) return;

    try {
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, uploading: true, progress: 10 } : f
      ));

      const fileExt = fileData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, progress: 30 } : f
      ));

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fadem-images')
        .upload(filePath, fileData.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload storage:', uploadError);
        throw uploadError;
      }

      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, progress: 60 } : f
      ));

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('fadem-images')
        .getPublicUrl(filePath);

      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, progress: 80 } : f
      ));

      // Enregistrer dans la base de données
      const { error: dbError } = await supabase
        .from('uploaded_images')
        .insert({
          filename: fileName,
          original_name: fileData.file.name,
          mime_type: fileData.file.type,
          size_bytes: fileData.file.size,
          storage_path: filePath,
          public_url: publicUrl,
          related_type: 'general'
        });

      if (dbError) {
        console.error('Erreur DB:', dbError);
        throw dbError;
      }

      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { 
          ...f, 
          uploading: false, 
          uploaded: true, 
          progress: 100,
          url: publicUrl
        } : f
      ));

      toast({
        title: "✅ Image uploadée",
        description: `${fileData.file.name} a été uploadée avec succès !`,
      });

    } catch (error) {
      console.error('Erreur complète upload:', error);
      
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { 
          ...f, 
          uploading: false, 
          error: 'Erreur lors de l\'upload: ' + (error as Error).message
        } : f
      ));

      toast({
        title: "❌ Erreur d'upload",
        description: `Erreur lors de l'upload de ${fileData.file.name}`,
        variant: "destructive"
      });
    }
  };

  const removeFile = (index: number) => {
    const fileData = files[index];
    if (fileData.preview) {
      URL.revokeObjectURL(fileData.preview);
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAllFiles = async () => {
    if (isUploading) return;
    
    setIsUploading(true);
    onUploadStatusChange?.(true);
    
    const pendingFiles = files
      .map((file, index) => ({ file, index }))
      .filter(({ file }) => !file.uploaded && !file.uploading && !file.error);

    if (pendingFiles.length === 0) {
      const allUploadedUrls = files
        .filter(f => f.uploaded && f.url)
        .map(f => f.url!);
        
      const uploadStatus = {
        isUploading: false,
        allUploaded: allUploadedUrls.length > 0
      };
      
      onImagesUploaded([...existingImages, ...allUploadedUrls], uploadStatus);
      
      toast({
        title: "ℹ️ Toutes les images sont déjà uploadées",
        description: "Aucune nouvelle image à uploader",
      });
      setIsUploading(false);
      onUploadStatusChange?.(false);
      return;
    }

    toast({
      title: "🚀 Upload en cours",
      description: `Upload de ${pendingFiles.length} image(s) en cours...`,
    });

    for (const { index } of pendingFiles) {
      await uploadFile(index);
      // Petite pause entre les uploads
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Récupérer toutes les URLs des images uploadées avec succès
    const uploadedUrls = files
      .filter(f => f.uploaded && f.url)
      .map(f => f.url!);
    
    const uploadStatus = {
      isUploading: false,
      allUploaded: uploadedUrls.length > 0
    };
    
    if (uploadedUrls.length > 0) {
      onImagesUploaded([...existingImages, ...uploadedUrls], uploadStatus);
      
      toast({
        title: "🎉 Upload terminé",
        description: `${uploadedUrls.length} image(s) uploadée(s) avec succès !`,
      });
    }
    
    setIsUploading(false);
    onUploadStatusChange?.(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileImage className="w-5 h-5 text-fadem-blue" />
            Upload d'Images ({files.length}/{maxFiles})
          </div>
          {files.length >= 5 && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Check className="w-4 h-4" />
              Excellente galerie !
            </div>
          )}
        </CardTitle>
        {files.length < 5 && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            ⚠️ Ajoutez au moins 5 images pour une présentation optimale de votre bien
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Zone de drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            dragOver 
              ? 'border-fadem-blue bg-fadem-blue/10 scale-105' 
              : files.length < 5 
                ? 'border-amber-400 bg-amber-50 hover:border-fadem-blue/50 hover:bg-fadem-blue/5'
                : 'border-green-400 bg-green-50 hover:border-fadem-blue/50 hover:bg-fadem-blue/5'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <div className="animate-bounce mb-4">
            <Upload className={`w-12 h-12 mx-auto ${files.length < 5 ? 'text-amber-500' : 'text-green-500'}`} />
          </div>
          <p className="text-gray-600 mb-2 font-medium">
            Glissez vos images ici ou cliquez pour sélectionner
          </p>
          {files.length < 5 && (
            <p className="text-amber-600 font-medium text-sm mb-3">
              📷 Encore {5 - files.length} image(s) recommandée(s) 
            </p>
          )}
          <Input
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            className={`mb-2 transition-colors ${
              files.length < 5 
                ? 'bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-700' 
                : 'hover:bg-fadem-blue hover:text-white'
            }`}
          >
            <Image className="w-4 h-4 mr-2" />
            {files.length === 0 ? 'Commencer avec 5 images' : 'Ajouter plus d\'images'}
          </Button>
          <p className="text-xs text-gray-500">
            Maximum {maxFiles} images • JPG, PNG, WebP, GIF
          </p>
        </div>

        {/* Liste des fichiers */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h4 className="font-medium text-lg">Images sélectionnées ({files.length})</h4>
              <Button 
                onClick={uploadAllFiles}
                disabled={isUploading || files.every(f => f.uploaded || f.uploading)}
                className="bg-fadem-blue hover:bg-fadem-blue-dark disabled:opacity-50 hover:scale-105 transition-all duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Upload en cours...' : 'Uploader tout'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {files.map((fileData, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <img
                      src={fileData.preview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded border-2 border-fadem-blue/20"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-fadem-blue">
                        {fileData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {fileData.uploading && (
                        <div className="mt-2">
                          <Progress value={fileData.progress} className="h-2" />
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            Upload... {fileData.progress}%
                          </p>
                        </div>
                      )}
                      
                      {fileData.uploaded && (
                        <div className="flex items-center gap-1 mt-2 text-green-600">
                          <Check className="w-3 h-3" />
                          <span className="text-xs font-medium">✅ Uploadé</span>
                        </div>
                      )}
                      
                      {fileData.error && (
                        <div className="flex items-center gap-1 mt-2 text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-xs">{fileData.error}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {!fileData.uploaded && !fileData.uploading && !fileData.error && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => uploadFile(index)}
                          className="hover:bg-green-100 hover:border-green-500"
                        >
                          <Upload className="w-3 h-3" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(index)}
                        disabled={fileData.uploading}
                        className="hover:bg-red-100 hover:border-red-500"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images existantes */}
        {existingImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Images existantes ({existingImages.length})</h4>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {existingImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Existante ${index + 1}`}
                  className="w-full h-16 object-cover rounded border hover:scale-110 transition-transform cursor-pointer"
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
