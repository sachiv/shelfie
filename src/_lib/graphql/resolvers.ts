import Author from "@/_lib/models/Author";
import Book from "@/_lib/models/Book";

const resolvers = {
  Query: {
    books: async () => await Book.findAll(),
    book: async (_: unknown, args: { id: number }) =>
      await Book.findByPk(args.id),
    authors: async () => await Author.findAll(),
    author: async (_: unknown, args: { id: number }) =>
      await Author.findByPk(args.id),
  },
};

export default resolvers;
