import Author from "@/_lib/models/Author";
import Book from "@/_lib/models/Book";
import { Op, WhereOptions } from "sequelize";

type AuthorInput = {
  id?: number;
  name: string;
  biography?: string;
  born_date?: Date;
  image?: string;
};

const resolvers = {
  Query: {
    authors: async (
      _: unknown,
      {
        page = 1,
        limit = 10,
        search,
        sortBy = "name",
        sortOrder = "asc",
      }: {
        page: number;
        limit: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
      }
    ) => {
      const offset = (page - 1) * limit;
      const whereClause: WhereOptions = {};

      if (search) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (whereClause as any)[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { biography: { [Op.iLike]: `%${search}%` } },
        ] as unknown as WhereOptions;
      }

      const { rows: authors, count: total } = await Author.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Book,
            as: "books",
            attributes: ["id", "title"],
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        authors: authors || [],
        total,
        totalPages,
      };
    },
    author: async (_: unknown, args: { id: number }) =>
      await Author.findByPk(args.id, {
        include: [
          {
            model: Book,
            as: "books",
            attributes: ["id", "title"],
          },
        ],
      }),
  },

  Author: {
    books: async (author: Author) => {
      return await Book.findAll({
        where: { author_id: author.id },
        attributes: ["id", "title"],
      });
    },
  },

  Mutation: {
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
