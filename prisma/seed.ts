import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const problems = [
  {
    title: "Parking Lot System",
    description: `# Parking Lot System

Design a class diagram for a **Parking Lot Management System**.

## Problem Statement

Design a system that manages a multi-floor parking lot. The system should support:

- Multiple floors, each with parking spots of different sizes (compact, regular, large)
- Different vehicle types (motorcycle, car, truck) that fit in appropriate spots
- Entry and exit panels for ticket-based access
- Tracking which spots are available and which are occupied
- Payment processing when vehicles exit

## Key Considerations

- A truck needs a large spot, a car needs a regular or large spot, a motorcycle can fit in any spot
- The system should be able to find the nearest available spot for a given vehicle type
- Payment should support multiple strategies (cash, card, etc.)`,
    difficulty: "MEDIUM" as const,
    tags: ["Creational Patterns", "Strategy Pattern", "OOP Basics"],
    requirements: {
      expectedClasses: [
        "ParkingLot",
        "ParkingFloor",
        "ParkingSpot",
        "Vehicle",
        "Car",
        "Truck",
        "Motorcycle",
        "Ticket",
        "Payment",
        "EntryPanel",
        "ExitPanel",
      ],
      expectedRelationships: [
        { type: "composition", source: "ParkingLot", target: "ParkingFloor" },
        { type: "composition", source: "ParkingFloor", target: "ParkingSpot" },
        { type: "inheritance", source: "Car", target: "Vehicle" },
        { type: "inheritance", source: "Truck", target: "Vehicle" },
        { type: "inheritance", source: "Motorcycle", target: "Vehicle" },
        { type: "association", source: "ParkingSpot", target: "Vehicle" },
        { type: "association", source: "Ticket", target: "Vehicle" },
      ],
      expectedPatterns: ["Strategy", "Factory"],
    },
  },
  {
    title: "Library Management System",
    description: `# Library Management System

Design a class diagram for a **Library Management System**.

## Problem Statement

Design a system for managing a library that supports:

- Managing books, members, and librarians
- Searching for books by title, author, or subject
- Issuing and returning books with due date tracking
- Reservation system for books currently checked out
- Fine calculation for overdue books
- A catalog that holds all book records

## Key Considerations

- A member can borrow up to 5 books at a time
- Books can have multiple copies (BookItem)
- Differentiate between the abstract concept of a Book and a physical BookItem
- Members and Librarians are both types of accounts but with different permissions`,
    difficulty: "EASY" as const,
    tags: ["Inheritance", "Association", "OOP Basics"],
    requirements: {
      expectedClasses: [
        "Library",
        "Book",
        "BookItem",
        "Member",
        "Librarian",
        "Account",
        "Catalog",
        "BookReservation",
        "BookLending",
        "Fine",
      ],
      expectedRelationships: [
        { type: "composition", source: "Library", target: "Book" },
        { type: "aggregation", source: "Book", target: "BookItem" },
        { type: "inheritance", source: "Member", target: "Account" },
        { type: "inheritance", source: "Librarian", target: "Account" },
        { type: "association", source: "Member", target: "BookLending" },
        { type: "association", source: "BookLending", target: "BookItem" },
        { type: "association", source: "Member", target: "BookReservation" },
      ],
      expectedPatterns: ["Observer"],
    },
  },
  {
    title: "Elevator System",
    description: `# Elevator System

Design a class diagram for an **Elevator System** in a building.

## Problem Statement

Design a system that manages multiple elevators in a building:

- The building has multiple floors and multiple elevators
- Users can request an elevator from any floor (up or down)
- Users inside an elevator can select a destination floor
- The system dispatches the optimal elevator to handle each request
- Elevators have states: moving up, moving down, idle
- Each elevator has a door that opens and closes

## Key Considerations

- The dispatcher/scheduler should decide which elevator handles which request
- An elevator has a capacity limit
- The system should handle concurrent requests efficiently
- Consider using the State pattern for elevator states`,
    difficulty: "HARD" as const,
    tags: ["State Pattern", "Strategy Pattern", "Composition"],
    requirements: {
      expectedClasses: [
        "Building",
        "Elevator",
        "Floor",
        "ElevatorController",
        "Request",
        "Door",
        "ElevatorState",
        "MovingUpState",
        "MovingDownState",
        "IdleState",
        "Dispatcher",
      ],
      expectedRelationships: [
        { type: "composition", source: "Building", target: "Elevator" },
        { type: "composition", source: "Building", target: "Floor" },
        { type: "composition", source: "Elevator", target: "Door" },
        { type: "inheritance", source: "MovingUpState", target: "ElevatorState" },
        { type: "inheritance", source: "MovingDownState", target: "ElevatorState" },
        { type: "inheritance", source: "IdleState", target: "ElevatorState" },
        { type: "association", source: "Elevator", target: "ElevatorState" },
        { type: "association", source: "Dispatcher", target: "Elevator" },
      ],
      expectedPatterns: ["State", "Strategy"],
    },
  },
  {
    title: "Snake & Ladder Game",
    description: `# Snake & Ladder Game

Design a class diagram for a **Snake & Ladder Board Game**.

## Problem Statement

Design a system for the classic Snake & Ladder game:

- The game is played on a board with numbered cells (typically 1–100)
- The board has snakes (that move a player down) and ladders (that move a player up)
- Multiple players take turns rolling a dice
- A player moves forward by the dice value and may land on a snake or ladder
- The game ends when a player reaches the final cell

## Key Considerations

- The board has a fixed set of snakes and ladders placed at specific positions
- A snake has a head (start) and tail (end); a ladder has a bottom (start) and top (end)
- The game should support 2–4 players
- Consider who manages game flow (turns, win detection)`,
    difficulty: "EASY" as const,
    tags: ["OOP Basics", "Composition", "Aggregation"],
    requirements: {
      expectedClasses: [
        "Game",
        "Board",
        "Cell",
        "Snake",
        "Ladder",
        "Player",
        "Dice",
      ],
      expectedRelationships: [
        { type: "composition", source: "Board", target: "Cell" },
        { type: "composition", source: "Board", target: "Snake" },
        { type: "composition", source: "Board", target: "Ladder" },
        { type: "aggregation", source: "Game", target: "Player" },
        { type: "composition", source: "Game", target: "Board" },
        { type: "composition", source: "Game", target: "Dice" },
      ],
      expectedPatterns: [],
    },
  },
  {
    title: "Online Bookstore",
    description: `# Online Bookstore

Design a class diagram for an **Online Bookstore** (like Amazon Books).

## Problem Statement

Design an e-commerce system for selling books online:

- Users can browse a catalog, search for books, and view book details
- Users can add books to a shopping cart and place orders
- Orders go through a checkout process with shipping address and payment
- Payment can be made via credit card, debit card, or wallet
- Orders have statuses: pending, shipped, delivered, cancelled
- The system tracks inventory for each book

## Key Considerations

- Separate the concept of a Book (catalog item) from OrderItem (a specific purchase)
- A ShoppingCart holds multiple CartItems before checkout
- Use the Strategy pattern for payment methods
- An Order contains multiple OrderItems and a shipping address`,
    difficulty: "MEDIUM" as const,
    tags: ["Strategy Pattern", "Factory Pattern", "Composition"],
    requirements: {
      expectedClasses: [
        "User",
        "Book",
        "Catalog",
        "ShoppingCart",
        "CartItem",
        "Order",
        "OrderItem",
        "Payment",
        "CreditCardPayment",
        "WalletPayment",
        "Address",
        "Inventory",
      ],
      expectedRelationships: [
        { type: "composition", source: "ShoppingCart", target: "CartItem" },
        { type: "composition", source: "Order", target: "OrderItem" },
        { type: "association", source: "CartItem", target: "Book" },
        { type: "association", source: "OrderItem", target: "Book" },
        { type: "association", source: "User", target: "ShoppingCart" },
        { type: "association", source: "User", target: "Order" },
        { type: "inheritance", source: "CreditCardPayment", target: "Payment" },
        { type: "inheritance", source: "WalletPayment", target: "Payment" },
      ],
      expectedPatterns: ["Strategy", "Factory"],
    },
  },
  {
    title: "Hotel Reservation System",
    description: `# Hotel Reservation System

Design a class diagram for a **Hotel Reservation System**.

## Problem Statement

Design a system for managing hotel reservations:

- The hotel has multiple rooms of different types (standard, deluxe, suite)
- Guests can search for available rooms by date range and room type
- Guests make reservations specifying check-in and check-out dates
- Reservations can be confirmed, checked-in, checked-out, or cancelled
- Payment is processed at checkout, supporting multiple payment methods
- Housekeeping tracks room status (clean, dirty, under maintenance)

## Key Considerations

- A Room has a type and a rate per night
- Room availability depends on existing reservations for the date range
- A Guest may have multiple reservations over time
- Consider the State pattern for room status management`,
    difficulty: "MEDIUM" as const,
    tags: ["State Pattern", "Strategy Pattern", "Association"],
    requirements: {
      expectedClasses: [
        "Hotel",
        "Room",
        "RoomType",
        "Guest",
        "Reservation",
        "Payment",
        "RoomStatus",
        "Housekeeper",
        "Invoice",
      ],
      expectedRelationships: [
        { type: "composition", source: "Hotel", target: "Room" },
        { type: "association", source: "Room", target: "RoomType" },
        { type: "association", source: "Guest", target: "Reservation" },
        { type: "association", source: "Reservation", target: "Room" },
        { type: "association", source: "Reservation", target: "Payment" },
        { type: "association", source: "Room", target: "RoomStatus" },
      ],
      expectedPatterns: ["State", "Strategy"],
    },
  },
  {
    title: "ATM Machine",
    description: `# ATM Machine

Design a class diagram for an **ATM (Automated Teller Machine)** system.

## Problem Statement

Design a system that models an ATM machine:

- Users authenticate with a card and PIN
- Users can check balance, deposit cash, withdraw cash, and transfer funds
- The ATM communicates with a bank system to verify accounts and process transactions
- Each transaction is logged with a timestamp and status
- The ATM has physical components: card reader, cash dispenser, keypad, screen

## Key Considerations

- The ATM has different states: idle, card inserted, authenticated, transaction in progress
- Use the State pattern to manage ATM states
- Transactions are of different types (withdrawal, deposit, transfer, balance inquiry)
- The ATM has a limited cash supply that decreases with withdrawals`,
    difficulty: "HARD" as const,
    tags: ["State Pattern", "Inheritance", "Composition"],
    requirements: {
      expectedClasses: [
        "ATM",
        "CardReader",
        "CashDispenser",
        "Keypad",
        "Screen",
        "Account",
        "Bank",
        "Card",
        "Transaction",
        "Withdrawal",
        "Deposit",
        "Transfer",
        "BalanceInquiry",
        "ATMState",
      ],
      expectedRelationships: [
        { type: "composition", source: "ATM", target: "CardReader" },
        { type: "composition", source: "ATM", target: "CashDispenser" },
        { type: "composition", source: "ATM", target: "Keypad" },
        { type: "composition", source: "ATM", target: "Screen" },
        { type: "inheritance", source: "Withdrawal", target: "Transaction" },
        { type: "inheritance", source: "Deposit", target: "Transaction" },
        { type: "inheritance", source: "Transfer", target: "Transaction" },
        { type: "inheritance", source: "BalanceInquiry", target: "Transaction" },
        { type: "association", source: "ATM", target: "ATMState" },
        { type: "association", source: "ATM", target: "Bank" },
        { type: "association", source: "Card", target: "Account" },
      ],
      expectedPatterns: ["State"],
    },
  },
  {
    title: "Chess Game",
    description: `# Chess Game

Design a class diagram for a **Chess Game**.

## Problem Statement

Design a system that represents a chess game:

- A chess board is an 8x8 grid of cells
- Each cell may contain a piece (King, Queen, Rook, Bishop, Knight, Pawn)
- Two players (white and black) take turns making moves
- Each piece type has its own movement rules
- The game tracks game state: active, check, checkmate, stalemate, draw
- Move validation ensures only legal moves are accepted

## Key Considerations

- All pieces inherit from a base Piece class but override movement logic
- A move is from one cell to another and may capture an opponent piece
- The board must be able to check if a move puts the player's own king in check
- Consider using polymorphism for piece movement rules`,
    difficulty: "HARD" as const,
    tags: ["Inheritance", "Polymorphism", "Composition"],
    requirements: {
      expectedClasses: [
        "Game",
        "Board",
        "Cell",
        "Piece",
        "King",
        "Queen",
        "Rook",
        "Bishop",
        "Knight",
        "Pawn",
        "Player",
        "Move",
      ],
      expectedRelationships: [
        { type: "composition", source: "Board", target: "Cell" },
        { type: "association", source: "Cell", target: "Piece" },
        { type: "inheritance", source: "King", target: "Piece" },
        { type: "inheritance", source: "Queen", target: "Piece" },
        { type: "inheritance", source: "Rook", target: "Piece" },
        { type: "inheritance", source: "Bishop", target: "Piece" },
        { type: "inheritance", source: "Knight", target: "Piece" },
        { type: "inheritance", source: "Pawn", target: "Piece" },
        { type: "composition", source: "Game", target: "Board" },
        { type: "aggregation", source: "Game", target: "Player" },
        { type: "association", source: "Move", target: "Cell" },
      ],
      expectedPatterns: [],
    },
  },
];

async function main() {
  console.log("Seeding problems...");

  for (const problem of problems) {
    const id = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Delete existing to avoid conflicts, then create fresh
    await prisma.problem.deleteMany({ where: { id } });

    // The Prisma Postgres adapter has issues with String[] fields,
    // so we create without tags then set them via raw SQL.
    await prisma.problem.create({
      data: {
        id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        requirements: problem.requirements,
      },
    });

    // Set tags via raw query to work around ppg adapter array bug
    if (problem.tags.length > 0) {
      const tagsLiteral = `{${problem.tags.map((t) => `"${t}"`).join(",")}}`;
      await prisma.$executeRaw`UPDATE "Problem" SET "tags" = ${tagsLiteral}::text[] WHERE "id" = ${id}`;
    }
    console.log(`  ✓ ${problem.title}`);
  }

  console.log(`\nSeeded ${problems.length} problems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
