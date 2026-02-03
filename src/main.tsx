import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StrictMode } from "react";
import AppProvider from "./provider/app.tsx";
import { HelmetProvider } from "react-helmet-async";
import { Bounce, ToastContainer } from "react-toastify";

// Normal Inter
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

// Italic Inter
import "@fontsource/inter/100-italic.css";
import "@fontsource/inter/200-italic.css";
import "@fontsource/inter/300-italic.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/inter/500-italic.css";
import "@fontsource/inter/600-italic.css";
import "@fontsource/inter/700-italic.css";
import "@fontsource/inter/800-italic.css";
import "@fontsource/inter/900-italic.css";

// Albert-sans
import "@fontsource-variable/albert-sans"; // Defaults to wght axis
import "@fontsource-variable/albert-sans/wght.css"; // Specify axis
import "@fontsource-variable/albert-sans/wght-italic.css"; // Specify axis and style

// Normal Alegreya Sans
import "@fontsource/alegreya-sans/100.css";
// import "@fontsource/alegreya-sans/200.css";
import "@fontsource/alegreya-sans/300.css";
import "@fontsource/alegreya-sans/400.css";
import "@fontsource/alegreya-sans/500.css";
// import "@fontsource/alegreya-sans/600.css";
import "@fontsource/alegreya-sans/700.css";
import "@fontsource/alegreya-sans/800.css";
import "@fontsource/alegreya-sans/900.css";

// Italic Alegreya Sans
import "@fontsource/alegreya-sans/100-italic.css";
// import "@fontsource/alegreya-sans/200-italic.css";
import "@fontsource/alegreya-sans/300-italic.css";
import "@fontsource/alegreya-sans/400-italic.css";
import "@fontsource/alegreya-sans/500-italic.css";
// import "@fontsource/alegreya-sans/600-italic.css";
import "@fontsource/alegreya-sans/700-italic.css";
import "@fontsource/alegreya-sans/800-italic.css";
import "@fontsource/alegreya-sans/900-italic.css";

// Third Party Library
import "react-inner-image-zoom/lib/styles.min.css";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <AppProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </AppProvider>
    </HelmetProvider>
  </StrictMode>
);
