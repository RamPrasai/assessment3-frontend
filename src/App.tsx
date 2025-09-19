import { Container, Navbar, Nav, Form, Button } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import PostList from "./pages/PostList";
import PostView from "./pages/PostView";
import PostCreate from "./pages/PostCreate";
import PostEdit from "./pages/PostEdit";
import { useEffect, useState } from "react";

function TokenBox() {
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");
  const nav = useNavigate();

  useEffect(() => {
    const h = () => setToken(localStorage.getItem("token") ?? "");
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  return (
    <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
      <Form.Control
        size="sm"
        type="text"
        placeholder="Paste API token…"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: 360 }}
        className="me-2"
      />
      <Button
        size="sm"
        variant="outline-info"
        onClick={() => {
          localStorage.setItem("token", token.trim());
          alert("Token saved. Try refreshing the posts list.");
          nav("/");
        }}
      >
        Save Token
      </Button>
      <Button
        size="sm"
        variant="outline-secondary"
        className="ms-2"
        onClick={() => {
          localStorage.removeItem("token");
          setToken("");
          alert("Token cleared.");
          nav("/");
          // If you prefer a hard reload instead:
          // window.location.reload();
        }}
      >
        Clear
      </Button>
    </Form>
  );
}

export default function App() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">UNE Blog (A3)</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Posts</Nav.Link>
            <Nav.Link as={Link} to="/post/create">Create</Nav.Link>
          </Nav>
          <TokenBox />
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/post/create" element={<PostCreate />} />
        <Route path="/post/edit/:id" element={<PostEdit />} />
        <Route path="/post/:id" element={<PostView />} />
      </Routes>
    </>
  );
}
