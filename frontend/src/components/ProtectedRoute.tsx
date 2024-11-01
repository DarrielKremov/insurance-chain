import { Navigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

type Props = {
    children?: React.ReactNode
};

const ProtectedRoute = ({ children }: Props) => {
  const { isConnected } = useWeb3();

  if (!isConnected) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;