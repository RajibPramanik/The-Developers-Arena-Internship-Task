public class Book {
    private String id;
    private String title;
    private String author;
    private String genre;
    private int totalCopies;
    private int availableCopies;

    public Book(String id, String title, String author, String genre, int totalCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getGenre() { return genre; }
    public int getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(int copies) { this.availableCopies = copies; }

    @Override
    public String toString() {
        return id + " - " + title + " by " + author + " (" + availableCopies + "/" + totalCopies + ")";
    }
}
