import { Link, useLocation, Outlet} from "react-router-dom"

function ConfigGarage() {
  const location = useLocation()


  const sidebarItems = [
    {
      name: "Brand",
      path: "brand",
    },
    {
      name: "Model",
      path: "model",
    },
    {
      name: "Category Car",
      path: "categorycar",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Config Garage</h2>
        <nav>
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors ${
                    location.pathname === item.path ? "bg-gray-700" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* เนื้อหาด้านขวา */}
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">
            {sidebarItems.find((item) => item.path === location.pathname)?.name || "Config Garage"}
          </h1>
          <p>You can create, update and delete brand, model or category car in this page.</p>

          {/* Outlet จะใช้แสดง Component ของ Route ที่เลือก */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ConfigGarage

