import java.util.*;

public class LibraryManagementSystem {
    private Library library;
    private Scanner sc = new Scanner(System.in);

    public LibraryManagementSystem() {
        library = new Library();
    }

    public void start() {
        while (true) {
            System.out.println("\n===== Library Management System =====");
            System.out.println("1. Add Book");
            System.out.println("2. Register Member");
            System.out.println("3. Display All Books");
            System.out.println("4. Display All Members");
            System.out.println("5. Borrow Book");
            System.out.println("6. Return Book");
            System.out.println("7. Search Book");
            System.out.println("8. Calculate Fine");
            System.out.println("9. Exit");
            System.out.print("Enter your choice: ");

            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {
                case 1 -> addBook();
                case 2 -> registerMember();
                case 3 -> library.displayAllBooks();
                case 4 -> library.displayAllMembers();
                case 5 -> borrowBook();
                case 6 -> returnBook();
                case 7 -> searchBook();
                case 8 -> calculateFine();
                case 9 -> {
                    System.out.println("Exiting...");
                    return;
                }
                default -> System.out.println("Invalid choice!");
            }
        }
    }

    private void addBook() {
        System.out.print("Enter Book ID: ");
        String id = sc.nextLine();
        System.out.print("Enter Title: ");
        String title = sc.nextLine();
        System.out.print("Enter Author: ");
        String author = sc.nextLine();
        System.out.print("Enter Genre: ");
        String genre = sc.nextLine();
        System.out.print("Enter Total Copies: ");
        int copies = sc.nextInt();
        sc.nextLine();

        Book book = new Book(id, title, author, genre, copies);
        library.addBook(book);
        System.out.println("✅ Book added successfully!");
    }

    private void registerMember() {
        System.out.print("Enter Member ID: ");
        String id = sc.nextLine();
        System.out.print("Enter Name: ");
        String name = sc.nextLine();
        System.out.print("Enter Email: ");
        String email = sc.nextLine();
        System.out.print("Enter Phone: ");
        String phone = sc.nextLine();

        Member member = new Member(id, name, email, phone);
        library.registerMember(member);
        System.out.println("✅ Member registered successfully!");
    }

    private void borrowBook() {
        System.out.print("Enter Member ID: ");
        String memberId = sc.nextLine();
        System.out.print("Enter Book ID: ");
        String bookId = sc.nextLine();
        library.borrowBook(memberId, bookId);
    }

    private void returnBook() {
        System.out.print("Enter Member ID: ");
        String memberId = sc.nextLine();
        System.out.print("Enter Book ID: ");
        String bookId = sc.nextLine();
        library.returnBook(memberId, bookId);
    }

    private void searchBook() {
        System.out.print("Search by (title/author/genre): ");
        String type = sc.nextLine().toLowerCase();
        System.out.print("Enter search term: ");
        String term = sc.nextLine();

        List<Book> results = switch (type) {
            case "title" -> library.searchBooksByTitle(term);
            case "author" -> library.searchBooksByAuthor(term);
            case "genre" -> library.searchBooksByGenre(term);
            default -> new ArrayList<>();
        };

        if (results.isEmpty()) {
            System.out.println("No matching books found.");
        } else {
            results.forEach(System.out::println);
        }
    }

    private void calculateFine() {
        System.out.print("Enter Member ID: ");
        String memberId = sc.nextLine();
        System.out.print("Enter Book ID: ");
        String bookId = sc.nextLine();
        double fine = library.calculateFine(memberId, bookId);
        System.out.println("Fine Amount: ₹" + fine);
    }
}
