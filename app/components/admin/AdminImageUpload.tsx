import { useFetcher } from "../../lib/useFetcherCompat";
import { useState, useRef, useEffect } from "react";
import { Upload, Link as LinkIcon, X, ImageIcon } from "lucide-react";
import { AdminButton } from "./ui/AdminButton";
import { toast } from "sonner";
import { cn } from "../ui/utils";
import { IconValue } from "../IconValue";

interface AdminImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export const AdminImageUpload = ({ value, onChange, label }: AdminImageUploadProps) => {
  const fetcher = useFetcher<{ url?: string; error?: string }>();
  const [mode, setOpenMode] = useState<"link" | "upload">("link");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastProcessedData = useRef<typeof fetcher.data | null>(null);

  useEffect(() => {
    if (!fetcher.data || fetcher.data === lastProcessedData.current) return;
    
    lastProcessedData.current = fetcher.data;
    if (fetcher.data.url) {
      onChange(fetcher.data.url);
      toast.success("Image uploaded successfully");
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      fetcher.submit(formData, {
        method: "post",
        action: "/__admin/upload",
        encType: "multipart/form-data",
      });
    }
  };

  const isUploading = fetcher.state !== "idle";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <ImageIcon className="w-3 h-3" /> {label}
        </label>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setOpenMode("link")}
            className={cn(
              "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
              mode === "link" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500"
            )}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setOpenMode("upload")}
            className={cn(
              "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
              mode === "upload" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500"
            )}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === "link" ? (
        <div className="relative">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-xs font-mono dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all pr-10"
          />
          <LinkIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-300" />
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center gap-3",
            isUploading ? "border-sky-500 bg-sky-50/50 animate-pulse" : "border-gray-100 hover:border-sky-300 bg-gray-50/30 hover:bg-white dark:border-gray-800 dark:hover:border-sky-900"
          )}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,.svg"
          />
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
             <Upload className={cn("w-6 h-6", isUploading ? "text-sky-500" : "text-gray-400")} />
          </div>
          <div className="text-center">
             <div className="text-xs font-bold">{isUploading ? "Uploading..." : "Click to Upload Asset"}</div>
             <div className="text-[9px] font-black uppercase text-gray-400 mt-1 tracking-tighter">JPG, PNG, WEBP or SVG (Max 5MB)</div>
          </div>
        </div>
      )}

      {value && (
        <div className="relative group overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 p-6 flex justify-center min-h-32">
            <IconValue 
                value={value} 
                alt="Preview" 
                className="text-6xl"
                imageClassName="max-h-32 w-full object-contain rounded-lg" 
            />
            <button 
                type="button"
                onClick={() => onChange("")}
                className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
      )}
    </div>
  );
};
