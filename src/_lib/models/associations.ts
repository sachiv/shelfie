import Author from "./Author";
import Book from "./Book";

// Define the associations
Book.belongsTo(Author, {
  foreignKey: "author_id",
  as: "author",
});

Author.hasMany(Book, {
  foreignKey: "author_id",
  as: "books",
});

export { Author, Book };
