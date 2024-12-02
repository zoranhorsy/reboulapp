export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    category: string;
    sizeStock: {
        [size: string]: number;
    };
}

