// This server defines a basic implementation of the nextkit API.
import nextkit from 'nextkit';

export const api = nextkit({
  // On error is responsible for shipping an error message and a status back to the client.
  async onError(req, res, error) {
    console.error('error', error);

    return {
      message: 'An error occurred.',
      status: 500,
    };
  },
});
