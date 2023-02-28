import { NextkitError } from 'nextkit';

import { api } from '../../server';

export default api({
  async GET() {
    return {
      text: 'Hello World!',
    };
  },
  async DELETE() {
    throw new NextkitError(500, 'This was intentionally thrown.');
  },
});
