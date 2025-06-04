import Book from "@/_models/Book";

export const dynamic = "force-dynamic";

async function getBooks() {
  const books = await Book.findAll();
  return { books };
}

export default async function Page() {
  const { books } = await getBooks();
  return (
    <ul>
      {books.map((book: Book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
}
