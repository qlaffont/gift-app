/* eslint-disable no-useless-escape */
export const stringCharactersParser = (text: string) => {
  return (text || '')
    .replaceAll(/(?:\r\n|\r|\n)/g, '<br/>')
    .replaceAll(
      /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
      '<a href="$1" class="underline hover:no-underline cursor-pointer" target="_blank">$1</a>',
    );
};
