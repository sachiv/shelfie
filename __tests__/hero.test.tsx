import { render } from "@testing-library/react";
import Hero from "../src/_ui/modules/Landing/hero";

describe("Hero", () => {
  it("should match snapshot", () => {
    const { container } = render(<Hero />);
    expect(container).toMatchSnapshot();
  });

  it("should render all main elements", () => {
    const { getByText, getByRole } = render(<Hero />);

    // Check for badge text
    expect(getByText("Discover Your Next Read 📚")).toBeInTheDocument();

    // Check for heading
    expect(
      getByText("Your Personal Book Discovery Platform")
    ).toBeInTheDocument();

    // Check for description
    expect(
      getByText(
        "Explore a vast collection of books, discover new authors, and build your reading list. Search, filter, and find your next favorite book with ease."
      )
    ).toBeInTheDocument();

    // Check for buttons
    const browseButton = getByRole("link", { name: /browse books/i });
    const authorsButton = getByRole("link", { name: /meet authors/i });

    expect(browseButton).toBeInTheDocument();
    expect(browseButton).toHaveAttribute("href", "/books");

    expect(authorsButton).toBeInTheDocument();
    expect(authorsButton).toHaveAttribute("href", "/authors");
  });
});
