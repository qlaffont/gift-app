import { fetch } from 'fetch-opengraph';

import { api } from '../../server';
import { getUserFromReq } from '../../services/apis/authUser';

export default api({
  async GET({ req }) {
    await getUserFromReq(req);

    try {
      const res = await fetch(req.query.url as string);
      return res;
    } catch (error) {
      return {};
    }
  },
});
