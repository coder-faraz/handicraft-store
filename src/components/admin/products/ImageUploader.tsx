// FILE: src/components/admin/products/ImageUploader.tsx
'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  folder?: string;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

export default function ImageUploader({
  value,
  onChange,
  maxImages = 6,
  folder = 'products',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error ?? 'Upload failed');
    }
    return { url: data.data.url, publicId: data.data.publicId };
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      const remaining = maxImages - value.length;
      const toUpload = files.slice(0, remaining);

      if (toUpload.length === 0) return;

      const newUploading: UploadingFile[] = toUpload.map((f) => ({
        id: `${f.name}-${Date.now()}`,
        name: f.name,
        progress: 0,
      }));

      setUploading((prev) => [...prev, ...newUploading]);

      const results = await Promise.allSettled(
        toUpload.map(async (file, idx) => {
          const result = await uploadFile(file);
          setUploading((prev) =>
            prev.map((u) =>
              u.id === newUploading[idx].id ? { ...u, progress: 100 } : u
            )
          );
          return result;
        })
      );

      const uploaded: UploadedImage[] = [];
      results.forEach((r, idx) => {
        if (r.status === 'fulfilled' && r.value) {
          uploaded.push(r.value);
        } else if (r.status === 'rejected') {
          setUploading((prev) =>
            prev.map((u) =>
              u.id === newUploading[idx].id
                ? { ...u, error: (r.reason as Error).message }
                : u
            )
          );
        }
      });

      onChange([...value, ...uploaded]);

      // Remove completed (no error) uploading items after delay
      setTimeout(() => {
        setUploading((prev) =>
          prev.filter((u) => newUploading.some((n) => n.id === u.id && u.error))
        );
      }, 1200);
    },
    [value, onChange, maxImages, folder]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    handleFiles(files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    handleFiles(files);
    e.target.value = '';
  };

  const removeImage = (publicId: string) => {
    onChange(value.filter((img) => img.publicId !== publicId));
  };

  const canUploadMore = value.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {canUploadMore && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
            dragOver
              ? 'border-brand-primary bg-brand-primary/5'
              : 'border-admin-border hover:border-brand-primary hover:bg-gray-50'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-admin-border flex items-center justify-center">
              <Upload size={18} className="text-admin-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-admin-text">
                Drop images here or <span className="text-brand-primary">browse</span>
              </p>
              <p className="text-xs text-admin-muted mt-0.5">
                JPEG, PNG, WebP up to 5MB — max {maxImages} images
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uploading progress */}
      {uploading.map((u) => (
        <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg border border-admin-border bg-gray-50">
          {u.error ? (
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          ) : (
            <Loader2 size={16} className="text-brand-primary animate-spin flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-admin-text truncate">{u.name}</p>
            {u.error && <p className="text-xs text-red-500">{u.error}</p>}
            {!u.error && (
              <div className="mt-1 h-1 bg-admin-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all"
                  style={{ width: `${u.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Image previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {value.map((img, idx) => (
            <div
              key={img.publicId}
              className="relative group aspect-square rounded-lg overflow-hidden border border-admin-border bg-gray-50"
            >
              <Image
                src={img.url}
                alt={`Product image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(img.publicId)}
                  className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
              {/* Primary badge */}
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded font-medium">
                  Main
                </span>
              )}
            </div>
          ))}
          {/* Placeholder slots */}
          {Array.from({ length: Math.max(0, Math.min(maxImages - value.length, 3)) }).map(
            (_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg border-2 border-dashed border-admin-border bg-gray-50 flex items-center justify-center"
              >
                <ImageIcon size={18} className="text-admin-muted/50" />
              </div>
            )
          )}
        </div>
      )}

      <p className="text-xs text-admin-muted">
        {value.length}/{maxImages} images uploaded. First image is used as the main product image.
      </p>
    </div>
  );
}
