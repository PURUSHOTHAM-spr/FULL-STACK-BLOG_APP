import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../store/AuthStore";

const renderRoute = (authState, allowedRoles = ["AUTHOR"]) => {
  useAuth.setState(authState);

  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route path="/" element={<p>Home page</p>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <p>Protected content</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuth.setState({
      currentUser: null,
      loading: false,
      isAuthenticated: false,
      error: null,
    });
  });

  it("redirects unauthenticated users to login", () => {
    renderRoute({
      currentUser: null,
      loading: false,
      isAuthenticated: false,
      error: null,
    });

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects authenticated users with the wrong role home", () => {
    renderRoute({
      currentUser: { role: "USER" },
      loading: false,
      isAuthenticated: true,
      error: null,
    });

    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("renders protected content for an allowed role", () => {
    renderRoute({
      currentUser: { role: "AUTHOR" },
      loading: false,
      isAuthenticated: true,
      error: null,
    });

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});
