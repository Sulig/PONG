import { useState, useEffect } from "react";
import Profile from "../APIs/profile";

const BACKEND_URL = "http://localhost:3001";

export default function UserAvatar({ size = 150 }: { size?: number }) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    async function fetchAvatar() {
        try {
            const res = await Profile.get("/me", { withCredentials: true });
            if (res.data.avatarUrl) {
                if (res.data.avatarUrl === "/avatars/avatar_default.png")
                    setAvatarUrl(res.data.avatarUrl);
                else
                    setAvatarUrl(BACKEND_URL + res.data.avatarUrl);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    }

    useEffect(() => {
        fetchAvatar();
    }, []);

    return <img src={avatarUrl ?? ""} alt="avatar" width={size} />;
}
