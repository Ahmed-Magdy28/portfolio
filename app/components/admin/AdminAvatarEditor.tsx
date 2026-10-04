import { useFetcher } from "../../lib/useFetcherCompat";
import { AdminCard } from "./ui/AdminCard";
import { AdminButton } from "./ui/AdminButton";
import { User, Smartphone, Image as ImageIcon } from "lucide-react";
import { AdminImageUpload } from "./AdminImageUpload";

interface AdminAvatarEditorProps {
  home: any;
  avatarValue: string;
  avatarSize: string;
  setAvatarValue: (val: string) => void;
  setAvatarSize: (val: string) => void;
  lang: string;
}

export const AdminAvatarEditor = ({
  home,
  avatarValue,
  avatarSize,
  setAvatarValue,
  setAvatarSize,
  lang,
}: AdminAvatarEditorProps) => {
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const isSubmitting = fetcher.state !== "idle";

  const isEmoji = !avatarValue.startsWith("http") && !avatarValue.startsWith("/") && avatarValue.length <= 4;

  return (
    <div className="space-y-6">
      <AdminCard
        title="Identity & Avatar"
        description="Configure the primary avatar and display parameters for the hero section."
        icon={<User className="w-6 h-6 text-blue-600" />}
        className="border-t-4 border-t-blue-500"
        isCollapsible={true}
        defaultOpen={false}
      >
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Preview Section */}
          <div className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-gray-50/50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 lg:w-1/3">
             <div 
                className="relative flex items-center justify-center bg-white dark:bg-gray-800 shadow-2xl rounded-full overflow-hidden mb-6 border-4 border-white dark:border-gray-700"
                style={{ 
                    width: Math.min(Number(avatarSize) || 128, 200), 
                    height: Math.min(Number(avatarSize) || 128, 200) 
                }}
             >
                {isEmoji ? (
                    <span style={{ fontSize: (Math.min(Number(avatarSize) || 128, 200)) * 0.6 }}>
                        {avatarValue}
                    </span>
                ) : (
                    <img 
                        src={avatarValue} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover"
                    />
                )}
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Preview</p>
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Avatar Asset (Emoji or URL)
                </label>
                <input
                  value={avatarValue}
                  onChange={(event) => setAvatarValue(event.target.value)}
                  placeholder="👨‍💻 or https://..."
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Visual Size (Pixels)
                </label>
                <input
                  type="number"
                  value={avatarSize}
                  onChange={(event) => setAvatarSize(event.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/30"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 dark:border-white/5">
                <AdminImageUpload 
                    label="Avatar Image"
                    value={avatarValue}
                    onChange={(url: string) => setAvatarValue(url)}
                />
            </div>

            <div className="flex justify-end pt-4">
                <fetcher.Form method="post" action="/__admin/save">
                    <input type="hidden" name="intent" value="save-content-section" />
                    <input type="hidden" name="section" value="home" />
                    <input type="hidden" name="locale" value={lang} />
                    <input
                        type="hidden"
                        name="payload"
                        value={JSON.stringify(
                        {
                            ...home,
                            avatar: avatarValue,
                            avatarSize: Number(avatarSize) || 128,
                        },
                        null,
                        2,
                        )}
                    />
                    <AdminButton type="submit" isLoading={isSubmitting} size="lg" className="px-10">
                        Apply Changes
                    </AdminButton>
                </fetcher.Form>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
};
