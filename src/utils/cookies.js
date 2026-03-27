export const cookies = {
  getOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    };
  },
  set(res, name, value, options = {}) {
    res.cookie(name, value, { ...this.getOptions(), ...options });
  },

  clear(res, name, options = {}) {
    res.clearCookie(name, { ...this.getOptions(), ...options });
  },

  get(req, name) {
    return req.cookies[name];
  }
};
