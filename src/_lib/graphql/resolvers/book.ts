import Author from "@/_lib/models/Author";
import Book from "@/_lib/models/Book";
import connectDB from "@/_lib/mongo/connectMongo";
import BookMongo from "@/_lib/mongo/models/Book";
import { GraphQLScalarType, Kind, ValueNode } from "graphql";
import { Op, WhereOptions } from "sequelize";

// Add DateTime scalar resolver
const dateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime custom scalar type",
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value: unknown) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      value instanceof Date
    ) {
      return new Date(value);
    }
    return null;
  },
  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Add this type above the resolvers object
type BookInput = {
  id?: number;
  title: string;
  description?: string;
  published_date?: Date;
  author_id: number;
};

const resolvers = {
  DateTime: dateTimeScalar,
  Query: {
    books: async (
      _: unknown,
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
        published_from?: Date;
        published_to?: Date;
      }
    ) => {
      const offset = (page - 1) * limit;
      const whereClause: WhereOptions = {};

      if (search) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (whereClause as any)[Op.or] = [
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
          whereClause.published_date[Op.gte] = published_from;
        }
        if (published_to) {
          whereClause.published_date[Op.lte] = published_to;
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

      // Fetch ratings from MongoDB
      await connectDB();
      const booksWithRatings = await Promise.all(
        books.map(async (book) => {
          const mongoBook = await BookMongo.findOne({ id: book.id });
          return {
            ...book.toJSON(),
            ratings: mongoBook?.ratings || [],
          };
        })
      );

      return {
        books: booksWithRatings,
        total,
        hasMore: total > page * limit,
      };
    },
    book: async (_: unknown, args: { id: number }) => {
      const book = await Book.findByPk(args.id, {
        include: [
          {
            model: Author,
            as: "author",
          },
        ],
      });

      if (!book) return null;

      // Fetch ratings from MongoDB
      await connectDB();
      const mongoBook = await BookMongo.findOne({ id: args.id });

      return {
        ...book.toJSON(),
        ratings: mongoBook?.ratings || [],
      };
    },
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
    addBookRating: async (
      _: unknown,
      args: { bookId: number; rating: { rating: number; comment: string } }
    ) => {
      await connectDB();

      const book = await BookMongo.findOne({ id: args.bookId });
      if (!book) {
        // Create new book entry if it doesn't exist
        const newBook = new BookMongo({
          id: args.bookId,
          ratings: [
            {
              ...args.rating,
              createdAt: new Date(),
            },
          ],
        });
        await newBook.save();
        return {
          id: args.bookId,
          ratings: newBook.ratings,
        };
      }

      // Add new rating to existing book
      book.ratings.push({
        ...args.rating,
        createdAt: new Date(),
      });
      await book.save();

      return {
        id: args.bookId,
        ratings: book.ratings,
      };
    },
  },
};

export default resolvers;
