import { getAccessToken } from 'next-protected-auth';

const base = process.env.NEXT_PUBLIC_BASE_URL;

class RestAPIService {
  static login = `${base}/api/auth/connect`;

  public static async logout() {
    const res = await fetch(`${base}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify({}),
    });

    return res;
  }

  public static async refresh() {
    const res = await fetch(`${base}/api/auth/refresh`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (res.ok) {
      return res.json();
    }

    throw res.json();
  }
}
export default RestAPIService;
