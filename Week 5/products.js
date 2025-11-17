// products.js - Product data and utility functions

const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        category: "electronics",
        rating: 4.5,
        reviews: 124,
        description: "Premium wireless headphones with active noise cancellation and exceptional sound quality. Perfect for music lovers and professionals who demand the best audio experience.",
        features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "Bluetooth 5.0 connectivity",
            "Comfortable over-ear design",
            "Built-in microphone for calls"
        ],
        isNew: true,
        onSale: false,
        stock: 15
    },
    {
        id: 2,
        title: "Organic Cotton T-Shirt",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        category: "clothing",
        rating: 4.3,
        reviews: 89,
        description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors. Made from 100% certified organic cotton with a perfect fit.",
        features: [
            "100% organic cotton",
            "Pre-shrunk fabric",
            "Available in 8 colors",
            "Unisex sizing",
            "Machine washable"
        ],
        isNew: false,
        onSale: true,
        stock: 45
    },
    {
        id: 3,
        title: "Smart Home Security Camera",
        price: 129.99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-b6aMkWrSG2Vg-qC0vigKX5srHwCNOhzSHw&s",
        category: "electronics",
        rating: 4.7,
        reviews: 203,
        description: "Advanced HD security camera with night vision, motion detection, and smartphone alerts. Keep your home safe with cutting-edge technology.",
        features: [
            "1080p HD video quality",
            "Night vision capability",
            "Motion detection alerts",
            "Two-way audio communication",
            "Cloud storage included"
        ],
        isNew: true,
        onSale: false,
        stock: 8
    },
    {
        id: 4,
        title: "Ceramic Plant Pot Set",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
        category: "home",
        rating: 4.2,
        reviews: 67,
        description: "Beautiful set of 3 ceramic plant pots with drainage holes and matching saucers. Perfect for indoor plants and modern home decoration.",
        features: [
            "Set of 3 different sizes",
            "Drainage holes included",
            "Matching saucers",
            "Durable ceramic construction",
            "Modern minimalist design"
        ],
        isNew: false,
        onSale: false,
        stock: 25
    },
    {
        id: 5,
        title: "Professional Yoga Mat",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        category: "sports",
        rating: 4.6,
        reviews: 156,
        description: "Premium non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and other floor exercises.",
        features: [
            "6mm thickness for comfort",
            "Non-slip surface",
            "Eco-friendly TPE material",
            "Lightweight and portable",
            "Easy to clean"
        ],
        isNew: false,
        onSale: true,
        stock: 30
    },
    {
        id: 6,
        title: "Leather Crossbody Bag",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        category: "clothing",
        rating: 4.4,
        reviews: 91,
        description: "Stylish genuine leather crossbody bag perfect for everyday use. Spacious interior with multiple compartments for organization.",
        features: [
            "Genuine leather construction",
            "Adjustable strap",
            "Multiple compartments",
            "Magnetic closure",
            "Available in 4 colors"
        ],
        isNew: false,
        onSale: false,
        stock: 12
    },
    {
        id: 7,
        title: "LED Desk Lamp",
        price: 34.99,
        image: "https://bookmygift.in/cdn/shop/files/Beam_Fuzo_India.jpg?v=1727767440",
        category: "home",
        rating: 4.1,
        reviews: 78,
        description: "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for work, study, or reading.",
        features: [
            "Adjustable brightness levels",
            "Color temperature control",
            "Flexible arm design",
            "USB charging port",
            "Energy efficient LED"
        ],
        isNew: true,
        onSale: false,
        stock: 20
    },
    {
        id: 8,
        title: "Wireless Gaming Mouse",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
        category: "electronics",
        rating: 4.8,
        reviews: 287,
        description: "High-precision wireless gaming mouse with customizable RGB lighting. Designed for serious gamers who demand performance.",
        features: [
            "16,000 DPI sensor",
            "Customizable RGB lighting",
            "6 programmable buttons",
            "50-hour battery life",
            "Ergonomic design"
        ],
        isNew: false,
        onSale: true,
        stock: 18
    },
    {
        id: 9,
        title: "Running Sneakers",
        price: 94.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
        category: "sports",
        rating: 4.5,
        reviews: 198,
        description: "Lightweight running shoes with superior cushioning and breathability. Perfect for daily runs and athletic activities.",
        features: [
            "Lightweight mesh upper",
            "Responsive foam midsole",
            "Durable rubber outsole",
            "Breathable lining",
            "Available in multiple colors"
        ],
        isNew: true,
        onSale: false,
        stock: 22
    },
    {
        id: 10,
        title: "Stainless Steel Water Bottle",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
        category: "sports",
        rating: 4.3,
        reviews: 134,
        description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours. Perfect for sports, travel, and daily hydration.",
        features: [
            "Double-wall insulation",
            "24-hour cold retention",
            "BPA-free materials",
            "Leak-proof design",
            "Wide mouth opening"
        ],
        isNew: false,
        onSale: false,
        stock: 50
    },
    {
        id: 11,
        title: "Vintage Denim Jacket",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
        category: "clothing",
        rating: 4.2,
        reviews: 76,
        description: "Classic vintage-style denim jacket with a comfortable relaxed fit. A timeless piece that never goes out of style.",
        features: [
            "100% cotton denim",
            "Vintage wash finish",
            "Classic button closure",
            "Chest and side pockets",
            "Relaxed fit design"
        ],
        isNew: false,
        onSale: true,
        stock: 14
    },
    {
        id: 12,
        title: "Bamboo Cutting Board Set",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        category: "home",
        rating: 4.4,
        reviews: 102,
        description: "Eco-friendly bamboo cutting board set with juice grooves and handles. Perfect for food preparation and serving.",
        features: [
            "Set of 3 different sizes",
            "Sustainable bamboo material",
            "Juice grooves for easy cleaning",
            "Built-in handles",
            "Naturally antimicrobial"
        ],
        isNew: false,
        onSale: false,
        stock: 35
    }
];

// Utility functions
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function getProductById(id) {
    return products.find(product => product.id === id);
}

function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
}

function searchProducts(query) {
    if (!query) return products;
    
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
        product.title.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
    );
}

function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'name':
            return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sortedProducts;
    }
}