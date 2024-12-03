export interface SizeStock {
    [key: string]: number;
}

export interface Product {
    id: string
    name: string
    price: number
    description: string
    images: string[]
    categories: Array<{
        id: string
        name: string
    }>
    sizeStock: Record<string, number>
    status: 'draft' | 'active'
}