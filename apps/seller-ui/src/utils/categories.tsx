// categories.tsx
export interface ShopCategory {
    value: string;
    label: string;
}

// Move "electronics", "technology", "laptop_pc", "mobile", "gaming" to the top
export const shopCategories: ShopCategory[] = [
    { value: "electronics", label: "Electronics & Gadgets" },
    { value: "technology", label: "Software & Technology Services" },
    { value: "laptop_pc", label: "Laptops & Computers" },
    { value: "mobile", label: "Mobile Phones & Accessories" },
    { value: "gaming", label: "Gaming & Accessories" },
    { value: "furniture", label: "Furniture & Home Decor" },
    { value: "automotive", label: "Automotive & Accessories" },
    { value: "books", label: "Books & Stationery" },
    { value: "toys", label: "Toys & Games" },
    { value: "sports", label: "Sports & Fitness" },
    { value: "hardware", label: "Hardware & Tools" },
    { value: "pet", label: "Pet Supplies & Services" },
    { value: "medical", label: "Medical & Pharmacy" },
    { value: "jewelry", label: "Jewelry & Watches" },
    { value: "florist", label: "Florists & Gift Shops" },
    { value: "baby", label: "Baby & Kids Store" },
    { value: "art", label: "Art & Craft Supplies" },
    { value: "music", label: "Music Instruments & Stores" },
    { value: "garden", label: "Garden & Outdoor Equipment" },
    { value: "bakery", label: "Bakery & Confectionery" },
    { value: "fashion", label: "Fashion & Clothing" },
    { value: "beauty", label: "Beauty & Cosmetics" },
    { value: "food", label: "Food & Beverages" },
    { value: "health", label: "Health & Wellness" },
    { value: "photography", label: "Photography & Video Services" },
    { value: "education", label: "Education & Training" },
    { value: "travel", label: "Travel & Tourism" },
    { value: "stationery", label: "Office & Stationery" },
    { value: "footwear", label: "Footwear" },
    { value: "grocery", label: "Grocery & Daily Needs" },
    { value: "cleaning", label: "Cleaning & Household" },
    { value: "appliances", label: "Home Appliances" },
    { value: "optical", label: "Optical & Eyewear" },
    { value: "construction", label: "Construction & Building Materials" },
    { value: "station", label: "Fuel & Service Stations" },
    { value: "other", label: "Other" },
];
