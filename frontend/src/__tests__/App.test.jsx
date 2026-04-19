import { render, screen } from "@testing-library/react";
import React from "react";

function Dummy() {
  return <h1>Welcome KalaSetu</h1>;
}

test("renders heading", () => {
  render(<Dummy />);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});