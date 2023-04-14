import { ResourceUrl } from '@lib/constants';
import { DiscordWebhookPostParams } from '@lib/models';

export class DiscordWebhook {
  constructor(public readonly url: string) {}

  post({ content, embeds, ...payload }: DiscordWebhookPostParams) {
    UrlFetchApp.fetch(this.url, {
      contentType: 'application/json',
      method: 'post',
      payload: JSON.stringify(<DiscordWebhookPostParams>{
        content: content ?? '',
        embeds: embeds.map(({ footer, thumbnail, ...embed }) => ({
          footer: footer ?? {
            text: 'Powered by Diretoria de Tecnologia with 💙',
            icon_url: ResourceUrl.HackermanIcon /* eslint-disable-line */,
          },
          thumbnail: thumbnail ?? {
            url: ResourceUrl.RoundLogo,
          },
          ...embed,
        })),
        ...payload,
      }),
    });
  }
}
