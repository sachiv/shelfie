import Author from "@/_lib/models/Author";

type AuthorInput = {
  id?: number;
  name: string;
  biography?: string;
  born_date?: Date;
};

const resolvers = {
  Query: {
    authors: async () => await Author.findAll(),
    author: async (_: unknown, args: { id: number }) =>
      await Author.findByPk(args.id),
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
