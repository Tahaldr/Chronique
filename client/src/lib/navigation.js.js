let globalNavigate = null;

export const setGlobalNavigate = (navigate) => {
  globalNavigate = navigate;
};

export const getGlobalNavigate = () => globalNavigate;
