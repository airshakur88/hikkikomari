"use client";

import { type DiscordUser } from "@/lib/discord";
import { ProfileCard } from "@/components/features/profile/profile-card";

interface HeroProfileProps {
  user: DiscordUser | null;
  loading?: boolean;
}

export function HeroProfile({ user, loading = false }: HeroProfileProps) {
  return (
    <ProfileCard
      name={user ? (user.globalName ?? user.username) : "..."}
      username={user?.username}
      bio="Olaa~ bem vindo ao meu site!! Clique nos botões abaixo caso tenha interesse em ver meu portfólio ou pedir uma comission!"
      avatarSrc={user?.avatarURL}
      badges={user?.badges}
      loading={loading}
    />
  );
}
