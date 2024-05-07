import Login from "./Pages/login";
import Register from "./Pages/register";
import Chat from "./Pages/chat";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <HashRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/chat" element={<Chat />} />
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}

export default App;
