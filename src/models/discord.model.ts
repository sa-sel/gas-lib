export type DiscordWebhookPostParams = {
  content?: string;
  name?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
};

export type DiscordEmbed = {
  title?: string;
  description?: string;
  url?: string;

  image?: DiscordEmbedMedia;
  thumbnail?: DiscordEmbedMedia;
  video?: DiscordEmbedMedia;

  /** ISO8601 timestamp */
  timestamp?: string;

  /** Color code of the embed */
  color?: number;

  footer?: {
    text: string;
    icon_url?: string;
  };

  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };

  provider?: {
    name: string;
    url?: string;
  };

  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
};

export type DiscordEmbedMedia = {
  url: string;
  height?: string;
  width?: string;
};
