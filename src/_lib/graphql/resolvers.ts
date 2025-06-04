import Author from "@/_lib/models/Author";
import Book from "@/_lib/models/Book";

// Add this type above the resolvers object
type BookInput = {
  id?: number;
  title: string;
  description?: string;
  published_date?: Date;
  author_id: number;
};

type AuthorInput = {
  id?: number;
  name: string;
  biography?: string;
  born_date?: Date;
};

const resolvers = {
  Query: {
    books: async () => await Book.findAll(),
    book: async (_: unknown, args: { id: number }) =>
      await Book.findByPk(args.id),
    authors: async () => await Author.findAll(),
    author: async (_: unknown, args: { id: number }) =>
      await Author.findByPk(args.id),
  },

  Mutation: {
    createBook: async (_: unknown, args: { book: BookInput }) => {
      const book = await Book.create(args.book);
      return book;
    },
    updateBook: async (_: unknown, args: { book: BookInput }) => {
      if (!args.book.id) {
        throw new Error("Book ID is required");
      }
      const book = await Book.findByPk(args.book.id);
      if (!book) {
        throw new Error("Book not found");
      }
      await book.update(args.book);
      return book;
    },
    deleteBook: async (_: unknown, args: { id: number }) => {
      const book = await Book.findByPk(args.id);
      if (!book) {
        throw new Error("Book not found");
      }
      await book.destroy();
      return book;
    },
    createAuthor: async (_: unknown, args: { author: AuthorInput }) => {
      const author = await Author.create(args.author);
      return author;
    },
    updateAuthor: async (_: unknown, args: { author: AuthorInput }) => {
      if (!args.author.id) {
        throw new Error("Author ID is required");
      }
      const author = await Author.findByPk(args.author.id);
      if (!author) {
        throw new Error("Author not found");
      }
      await author.update(args.author);
      return author;
    },
    deleteAuthor: async (_: unknown, args: { id: number }) => {
      const author = await Author.findByPk(args.id);
      if (!author) {
        throw new Error("Author not found");
      }
      await author.destroy();
      return author;
    },
  },
};

export default resolvers;
