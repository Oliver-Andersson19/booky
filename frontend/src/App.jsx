import { Link, Outlet } from "react-router-dom";
import { useAuth } from './context/authContext.jsx';
import { pages } from "./router/routes.jsx";

function App() {

  const { user } = useAuth();

  console.log(user)

  return (

    <div>
      <nav style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
        {pages.map((page) => (
          <Link key={page.path} to={page.path}>{page.label}</Link>
        ))}
 
      </nav>
      
      <main>
        <Outlet />
      </main>
    
    </div>
  );
}

export default App;
