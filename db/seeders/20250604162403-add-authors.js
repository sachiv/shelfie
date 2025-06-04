"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "authors",
      [
        {
          name: "J.K. Rowling",
          biography: "British author best known for the Harry Potter series",
          born_date: new Date("1965-07-31"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "George R.R. Martin",
          biography:
            "American novelist and short story writer, best known for A Song of Ice and Fire series",
          born_date: new Date("1948-09-20"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Stephen King",
          biography:
            "American author of horror, supernatural fiction, suspense, and fantasy novels",
          born_date: new Date("1947-09-21"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Agatha Christie",
          biography:
            "English writer known for her detective novels featuring Hercule Poirot and Miss Marple",
          born_date: new Date("1890-09-15"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Neil Gaiman",
          biography:
            "English author of novels, short stories, comic books, and graphic novels",
          born_date: new Date("1960-11-10"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Margaret Atwood",
          biography:
            "Canadian poet, novelist, literary critic, and environmental activist",
          born_date: new Date("1939-11-18"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Brandon Sanderson",
          biography: "American author of epic fantasy and science fiction",
          born_date: new Date("1975-12-19"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Ursula K. Le Guin",
          biography:
            "American author of science fiction, fantasy, and children's books",
          born_date: new Date("1929-10-21"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Terry Pratchett",
          biography:
            "English author of fantasy novels, particularly the Discworld series",
          born_date: new Date("1948-04-28"),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Octavia E. Butler",
          biography:
            "American science fiction author and multiple recipient of Hugo and Nebula awards",
          born_date: new Date("1947-06-22"),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("authors", null, {});
  },
};
