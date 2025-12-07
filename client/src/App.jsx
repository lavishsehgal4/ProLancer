import { RouterProvider } from "react-router-dom";
import { SSEProvider } from "./contexts/SSEContext";
import router from "./routes";

function App() {
  return (
    <SSEProvider>
      <RouterProvider router={router} />
    </SSEProvider>
  );
}

export default App;
