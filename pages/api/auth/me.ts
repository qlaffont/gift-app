import { api } from '../../../server';
import { getUserFromReq } from '../../../services/apis/authUser';

export default api({
  async GET({ req }) {
    const user = await getUserFromReq(req);
    return { email: user.email, name: user.name, id: user.id, lang: user.lang, description: user.description };
  },
});
