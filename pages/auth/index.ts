import { NextAuthProtectedCallback } from 'next-protected-auth';

export default NextAuthProtectedCallback({
  callback: (redirectUrl) => {
    window.location.replace(redirectUrl || '/');
  },
  noTokenCallback: (redirectUrl) => {
    window.location.replace(redirectUrl || '/');
  },
});
