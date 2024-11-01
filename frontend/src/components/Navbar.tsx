import { useWeb3 } from '../context/Web3Context';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { account, connect, disconnect, isConnected } = useWeb3();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">InsureChain</Link>
        <div className="navbar-nav">
        </div>
        <button 
          className="btn btn-primary"
          onClick={isConnected ? disconnect : connect}
        >
          {isConnected ? `Connected: ${account?.slice(0,6)}...` : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;