import { api } from '../../../server';
import { removeRefresh } from '../../../services/apis/authUser';

export default api({
  async GET({ req, res }) {
    removeRefresh(req, res);

    res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
  },
});
