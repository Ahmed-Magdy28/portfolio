import { useEffect, useState } from "react";

interface HomeAvatarSource {
  avatar: string;
  avatarSize?: number;
}

export const useHomeAdminAvatar = (home: HomeAvatarSource) => {
  const [avatarValue, setAvatarValue] = useState(home.avatar);
  const [avatarSize, setAvatarSize] = useState(String(home.avatarSize ?? 128));

  useEffect(() => {
    setAvatarValue(home.avatar);
    setAvatarSize(String(home.avatarSize ?? 128));
  }, [home.avatar, home.avatarSize]);

  return {
    avatarSize,
    avatarValue,
    setAvatarSize,
    setAvatarValue,
  };
};
