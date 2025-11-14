import java.util.*;

public class Library {
    private List<Book> books = new ArrayList<>();
    private List<Member> members = new ArrayList<>();

    public void addBook(Book book) {
        books.add(book);
    }

    public void registerMember(Member member) {
        members.add(member);
    }

    public void displayAllBooks() {
        if (books.isEmpty()) {
            System.out.println("No books available in the library.");
        } else {
            System.out.println("\n--- List of Books ---");
            for (Book b : books) System.out.println(b);
        }
    }

    public void displayAllMembers() {
        if (members.isEmpty()) {
            System.out.println("No members registered.");
        } else {
            System.out.println("\n--- List of Members ---");
            for (Member m : members) System.out.println(m);
        }
    }

    public void borrowBook(String memberId, String bookId) {
        Book book = findBookById(bookId);
        if (book == null) {
            System.out.println("Book not found!");
            return;
        }

        if (book.getAvailableCopies() > 0) {
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            System.out.println("Book borrowed successfully!");
        } else {
            System.out.println("No copies available.");
        }
    }

    public void returnBook(String memberId, String bookId) {
        Book book = findBookById(bookId);
        if (book == null) {
            System.out.println("Book not found!");
            return;
        }
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        System.out.println("Book returned successfully!");
    }

    public List<Book> searchBooksByTitle(String title) {
        List<Book> results = new ArrayList<>();
        for (Book b : books) {
            if (b.getTitle().equalsIgnoreCase(title)) results.add(b);
        }
        return results;
    }

    public List<Book> searchBooksByAuthor(String author) {
        List<Book> results = new ArrayList<>();
        for (Book b : books) {
            if (b.getAuthor().equalsIgnoreCase(author)) results.add(b);
        }
        return results;
    }

    public List<Book> searchBooksByGenre(String genre) {
        List<Book> results = new ArrayList<>();
        for (Book b : books) {
            if (b.getGenre().equalsIgnoreCase(genre)) results.add(b);
        }
        return results;
    }

    public double calculateFine(String memberId, String bookId) {
        return 50.0; // Flat fine for simplicity
    }

    private Book findBookById(String id) {
        for (Book b : books) {
            if (b.getId().equalsIgnoreCase(id)) return b;
        }
        return null;
    }
}
