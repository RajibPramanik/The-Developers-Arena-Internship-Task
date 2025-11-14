/**
 * Main class to run the Library Management System
 * Entry point of the application
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("🚀 Starting Library Management System...");
        System.out.println("📚 Java Version: " + System.getProperty("java.version"));
        System.out.println("💻 VS Code Java Project\n");
        
        try {
            LibraryManagementSystem system = new LibraryManagementSystem();
            system.start();
        } catch (Exception e) {
            System.out.println("❌ An error occurred: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
