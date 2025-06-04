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
      _: any,
      {
        page = 1,
        limit = 10,
        search,
        author_id,
        published_from,
        published_to,
      }: {
        page: number;
        limit: number;
        search?: string;
        author_id?: number;
        published_from?: string;
        published_to?: string;
      }
    ) => {
      const offset = (page - 1) * limit;
      const whereClause: WhereOptions = {};

      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { "$author.name$": { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (author_id) {
        whereClause.author_id = author_id;
      }

      if (published_from || published_to) {
        whereClause.published_date = {};
        if (published_from) {
          whereClause.published_date[Op.gte] = new Date(published_from);
        }
        if (published_to) {
          whereClause.published_date[Op.lte] = new Date(published_to);
        }
      }

      const { rows: books, count: total } = await Book.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Author,
            as: "author",
          },
        ],
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      return {
        books,
        total,
        hasMore: total > page * limit,
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
