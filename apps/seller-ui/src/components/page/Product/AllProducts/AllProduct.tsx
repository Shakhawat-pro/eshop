"use client";
import BreadCrumbAndHeader from '@/components/Shared/BreadCrumbAndHeader';
import DataTable from '@/components/Shared/DataTable/DataTable';
import DeleteModal from '@/components/Shared/Modal/DeleteModal';
import Modal from '@/components/Shared/Modal/Modal';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import {
    BarChart3, BadgeCheck, Clock3, Eye,
    Package2, Pencil, Plus, Search, Star, Trash, X, SlidersHorizontal,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Filters = {
    search: string;
    status: string;
    category: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
};

const DEFAULT_FILTERS: Filters = {
    search: '',
    status: '',
    category: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
};

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: '' },
    { label: 'Active',       value: 'active' },
    { label: 'Pending',      value: 'pending' },
    { label: 'Draft',        value: 'draft' },
];

const SORT_OPTIONS = [
    { label: 'Last Updated',  value: 'updatedAt' },
    { label: 'Date Created',  value: 'createdAt' },
    { label: 'Price',         value: 'sale_price' },
    { label: 'Stock',         value: 'stock_quantity' },
    { label: 'Rating',        value: 'rating' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const AllProducts = () => {
    const router      = useRouter();
    const queryClient = useQueryClient();

    const [filters, setFilters]               = useState<Filters>(DEFAULT_FILTERS);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [showAnalytics, setShowAnalytics]   = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const debouncedSearch = useDebounce(filters.search, 400);

    const activeFilters = {
        ...filters,
        search: debouncedSearch,
    };

    const hasActiveFilters =
        activeFilters.search    !== DEFAULT_FILTERS.search    ||
        activeFilters.status    !== DEFAULT_FILTERS.status    ||
        activeFilters.category  !== DEFAULT_FILTERS.category  ||
        activeFilters.sortBy    !== DEFAULT_FILTERS.sortBy    ||
        activeFilters.sortOrder !== DEFAULT_FILTERS.sortOrder;

    // ── Query ──────────────────────────────────────────────────────────────────

    const { data, isLoading } = useQuery({
        queryKey: ['shop-products', activeFilters],
        queryFn: async () => {
            const params: Record<string, string> = {};
            if (activeFilters.search)   params.search    = activeFilters.search;
            if (activeFilters.status)   params.status    = activeFilters.status;
            if (activeFilters.category) params.category  = activeFilters.category;
            params.sortBy    = activeFilters.sortBy;
            params.sortOrder = activeFilters.sortOrder;

            const res = await axiosInstance.get('/product/api/get-shop-products', { params });
            return res?.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const products: any[]       = data?.products ?? [];
    const stats                 = data?.stats    ?? { total: 0, active: 0, lowStock: 0, avgRating: 0 };
    const categories: string[]  = data?.meta?.categories ?? [];

    // ── Helpers ────────────────────────────────────────────────────────────────

    const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
        setFilters((prev) => ({ ...prev, [key]: value }));

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    const formatCurrency = (value?: number) => {
        if (typeof value !== 'number') return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', maximumFractionDigits: 2,
        }).format(value);
    };

    const formatDate = (value?: string) => {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    const handleDeleteProduct = useCallback(async () => {
        if (!selectedProduct) return;
        // TODO: call delete API
        queryClient.invalidateQueries({ queryKey: ['shop-products'] });
        setShowDeleteModal(false);
        setSelectedProduct(null);
    }, [selectedProduct, queryClient]);

    // ── Columns ────────────────────────────────────────────────────────────────

    const columns = useMemo(() => [
        {
            header: 'Image', accessor: 'images',
            cell: (row: any) => (
                <img
                    src={row?.images?.[0]?.url || '/placeholder.png'}
                    alt={row?.images?.[0]?.file_id || 'Product Image'}
                    className="h-16 w-16 rounded object-cover"
                />
            ),
        },
        {
            header: 'Product Name', accessor: 'title',
            cell: (row: any) => (
                <div className="space-y-1">
                    <div className="font-semibold text-text">{row?.title}</div>
                    <div className="text-xs text-text-muted">{row?.slug}</div>
                </div>
            ),
        },
        {
            header: 'Category', accessor: 'category',
            cell: (row: any) => (
                <div className="space-y-1">
                    <div>{row?.category || 'Uncategorized'}</div>
                    <div className="text-xs text-text-muted">{row?.subCategory || 'No sub-category'}</div>
                </div>
            ),
        },
        {
            header: 'Pricing', accessor: 'sale_price',
            cell: (row: any) => (
                <div className="space-y-1">
                    <div className="font-semibold">{formatCurrency(row?.sale_price)}</div>
                    <div className="text-xs text-text-muted line-through">{formatCurrency(row?.regular_price)}</div>
                </div>
            ),
        },
        {
            header: 'Stock', accessor: 'stock_quantity',
            cell: (row: any) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    (row?.stock_quantity ?? 0) <= 5
                        ? 'bg-warning/10 text-warning'
                        : 'bg-success/10 text-success'
                }`}>
                    {row?.stock_quantity ?? 0} items
                </span>
            ),
        },
        {
            header: 'Status', accessor: 'status',
            cell: (row: any) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    row?.status === 'active'  ? 'bg-success/10 text-success'  :
                    row?.status === 'pending' ? 'bg-warning/10 text-warning'  :
                    'bg-surface-muted text-text-muted'
                }`}>
                    {row?.status || 'draft'}
                </span>
            ),
        },
        {
            header: 'Rating', accessor: 'rating',
            cell: (row: any) => (
                <div className="flex items-center gap-1 font-medium">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{(row?.rating ?? 0).toFixed(1)}</span>
                </div>
            ),
        },
        {
            header: 'Updated', accessor: 'updatedAt',
            cell: (row: any) => (
                <div className="space-y-1 text-sm">
                    <div>{formatDate(row?.updatedAt)}</div>
                    <div className="text-xs text-text-muted">Created {formatDate(row?.createdAt)}</div>
                </div>
            ),
        },
        {
            header: 'Actions', accessor: 'actions',
            cell: (row: any) => (
                <div className="flex flex-wrap gap-2">
                    <button
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-surface-muted"
                        onClick={() => { setSelectedProduct(row); setShowAnalytics(false); }}
                    >
                        <Eye className="h-4 w-4" /> View
                    </button>
                    <button
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-surface-muted"
                        onClick={() => { setSelectedProduct(row); setShowAnalytics(true); }}
                    >
                        <BarChart3 className="h-4 w-4" /> Analytics
                    </button>
                    <button
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-surface-muted"
                        onClick={() => router.push(`/dashboard/products/edit/${row.id}`)}
                    >
                        <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        onClick={() => { setSelectedProduct(row); setShowDeleteModal(true); }}
                    >
                        <Trash className="h-4 w-4" /> Delete
                    </button>
                </div>
            ),
        },
    ], [router]);

    // ── Render ─────────────────────────────────────────────────────────────────

    const selectClass =
        'rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text outline-none transition focus:border-blue-500 cursor-pointer';

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <BreadCrumbAndHeader
                    header="All Products"
                    breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Products' }]}
                />
                <button
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    onClick={() => router.push('/dashboard/products/create')}
                >
                    <Plus size={16} strokeWidth={2.5} /> Add Product
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: 'Total Products',  value: stats.total,                  icon: <Package2 className="h-4 w-4" /> },
                    { label: 'Active Products', value: stats.active,                 icon: <BadgeCheck className="h-4 w-4" /> },
                    { label: 'Low Stock',        value: stats.lowStock,               icon: <Clock3 className="h-4 w-4" /> },
                    { label: 'Avg. Rating',      value: Number(stats.avgRating).toFixed(1), icon: <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> },
                ].map(({ label, value, icon }) => (
                    <div key={label} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-text-muted">
                            <span>{label}</span>{icon}
                        </div>
                        <div className="mt-3 text-2xl font-semibold text-text">{value}</div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">

                {/* Filter bar */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-text">Products</h2>
                            <p className="mt-1 text-sm text-text-muted">
                                Search, filter, and manage your shop products.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                            <input
                                value={filters.search}
                                onChange={(e) => set('search', e.target.value)}
                                placeholder="Search by name, slug or category…"
                                className="w-full rounded-xl border border-border bg-surface-muted py-2.5 pl-10 pr-4 text-sm text-text outline-none transition focus:border-blue-500"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => set('search', '')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Secondary filters row */}
                    <div className="flex flex-wrap items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 shrink-0 text-text-muted" />

                        {/* Status */}
                        <select
                            value={filters.status}
                            onChange={(e) => set('status', e.target.value)}
                            className={selectClass}
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        {/* Category — populated from backend meta */}
                        <select
                            value={filters.category}
                            onChange={(e) => set('category', e.target.value)}
                            className={selectClass}
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        {/* Sort field */}
                        <select
                            value={filters.sortBy}
                            onChange={(e) => set('sortBy', e.target.value)}
                            className={selectClass}
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        {/* Sort direction */}
                        <select
                            value={filters.sortOrder}
                            onChange={(e) => set('sortOrder', e.target.value as 'asc' | 'desc')}
                            className={selectClass}
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>

                        {/* Clear all */}
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                            >
                                <X className="h-3.5 w-3.5" /> Clear filters
                            </button>
                        )}

                        {/* Result count */}
                        <span className="ml-auto text-xs text-text-muted">
                            {isLoading ? '…' : `${products.length} result${products.length !== 1 ? 's' : ''}`}
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <DataTable columns={columns} data={products} loading={isLoading} />
                </div>
            </div>

            {/* View modal */}
            <Modal
                isOpen={Boolean(selectedProduct) && !showAnalytics}
                onClose={() => setSelectedProduct(null)}
                ariaLabelledBy="product-preview-title"
            >
                {selectedProduct && (
                    <div className="bg-surface p-6">
                        <h1 id="product-preview-title" className="text-2xl font-semibold text-text">
                            {selectedProduct.title}
                        </h1>
                    </div>
                )}
            </Modal>

            {/* Analytics modal */}
            <Modal
                isOpen={Boolean(selectedProduct) && showAnalytics}
                onClose={() => { setSelectedProduct(null); setShowAnalytics(false); }}
                ariaLabelledBy="product-analytics-title"
            >
                {selectedProduct && (
                    <div className="bg-surface p-6">
                        <h1 id="product-analytics-title" className="text-2xl font-semibold text-text">
                            Product Analytics
                        </h1>
                    </div>
                )}
            </Modal>

            {/* Delete modal */}
            <DeleteModal
                title="Delete Product"
                value={selectedProduct?.title}
                isOpen={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setSelectedProduct(null); }}
                onConfirm={handleDeleteProduct}
            />
        </div>
    );
};

export default AllProducts;