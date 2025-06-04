import Author from "@/_lib/models/Author";
import Book from "@/_lib/models/Book";
import { Op, WhereOptions } from "sequelize";

// Add this type above the resolvers object
type BookInput = {
  id?: number;
  title: string;
  description?: string;
  published_date?: Date;
  author_id: number;
};

const resolvers = {
  Query: {
    books: async (
      _: unknown,
      args: {
        page?: number;
        limit?: number;
        search?: string;
        author_id?: number;
      }
    ) => {
      const page = args.page || 1;
      const limit = args.limit || 10;
      const offset = (page - 1) * limit;

      const whereClause: WhereOptions = {};

      if (args.search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${args.search}%` } },
          { "$author.name$": { [Op.iLike]: `%${args.search}%` } },
        ];
      }

      if (args.author_id) {
        whereClause.author_id = args.author_id;
      }

      const { count, rows } = await Book.findAndCountAll({
        include: [
          {
            model: Author,
            as: "author",
            required: args.search ? true : false,
          },
        ],
        where: whereClause,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      return {
        books: rows,
        total: count,
        hasMore: count > page * limit,
      };
    },
    book: async (_: unknown, args: { id: number }) =>
      await Book.findByPk(args.id, {
        include: [
          {
            model: Author,
            as: "author",
          },
        ],
      }),
  },

  Book: {
    author: async (book: Book) => {
      return await Author.findByPk(book.author_id);
    },
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
  },
};

export default resolvers;
