import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        <h1>My App Header</h1>
      </header>
      <main>
        <Outlet /> {/* 자식 라우트가 여기 렌더링됨 */}
      </main>
      <footer>
        <p>Footer Content</p>
      </footer>
    </div>
  );
};

export default Layout;
