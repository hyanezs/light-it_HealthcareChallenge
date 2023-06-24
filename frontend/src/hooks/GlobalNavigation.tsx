import { useNavigate, type NavigateFunction } from 'react-router-dom';

export let globalNavigate: NavigateFunction;

const GlobalNavigation = () => {
  globalNavigate = useNavigate();

  return null;
};

export default GlobalNavigation;
