import { NavLink } from 'react-router';

type LinkState = {
  isActive: boolean;
  isPending: boolean;
  isTransitioning: boolean;
};

const linkClasses = ({ isActive }: LinkState) =>
  `btn btn-ghost ${isActive ? 'btn-active' : ''}`;

export default function NavBar() {
  return (
    <>
      <div className="navbar-start">
        <NavLink to="/" className="font-bold px-4 text-lg">
          AIC Explorer
        </NavLink>
      </div>
      <div className="navbar-center">
        <nav className="join">
          <NavLink to="/" className={linkClasses} end>
            Home
          </NavLink>
          <NavLink to="/gallery" className={linkClasses}>
            Gallery
          </NavLink>
        </nav>
      </div>
      <div className="navbar-end px-4" />
    </>
  );
}
