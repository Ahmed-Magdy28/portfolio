import { useFetcher } from "react-router";
import { AdminCard } from "./ui/AdminCard";
import { AdminButton } from "./ui/AdminButton";
import { User, Smartphone } from "lucide-react";

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

  return (
    <fetcher.Form
      method="post"
      action="/__admin/save"
    >
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

      <AdminCard
        title="Identity & Avatar"
        description="Configure the primary avatar and display parameters for the hero section."
        icon={<User className="w-6 h-6 text-blue-600" />}
        className="border-t-4 border-t-blue-500"
        headerActions={
            <AdminButton type="submit" isLoading={isSubmitting} size="sm">
                Save Avatar
            </AdminButton>
        }
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Avatar Asset (Emoji or URL)
            </label>
            <input
              value={avatarValue}
              onChange={(event) => setAvatarValue(event.target.value)}
              placeholder="👨‍💻 or https://..."
              className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/30"
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
              className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/30"
            />
          </div>
        </div>
      </AdminCard>
    </fetcher.Form>
  );
};
