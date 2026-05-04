import { FileSearch } from 'lucide-react';
import React from 'react';

type DataTableProps = {
    data: any[];
    columns: { header: string; accessor: string, cell?: (value: any) => React.ReactNode }[];
    loading: boolean;
};

const DataTable = ({ data, columns, loading }: DataTableProps) => {
    return (
        <div className="overflow-x-auto rounded-lg  mt-6">
            <table className="table w-full">
                <thead className=" ">
                    <tr className=" ">
                        {columns.map((column) => (
                            <th key={column.accessor} className="text-xs text-text-muted font-semibold uppercase tracking-wider ">
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-text">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <tr key={index} className="animate-pulse border-t border-border">
                                {columns.map((column) => (
                                    <td key={column.accessor}>
                                        <div className="h-4 rounded bg-surface-strong/70 w-3/4"></div>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-10! text-text-muted text-base">
                                <div
                                    className="flex items-center justify-center w-full min-h-64"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-muted">
                                            <FileSearch className="h-6 w-6 text-text-muted" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-text">No Data Available</h3>
                                        <p className="text-sm text-text-muted mt-1 max-w-sm">There is no data to display.</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        Array.isArray(data) ?
                            ((data.map((row, index) => (
                                <tr key={index} className="border-t border-border transition hover:bg-surface-muted/60 ">
                                    {columns.map((column) => (
                                        <td key={column?.accessor} className="text-sm text-text py-4">
                                            {column.cell ? column.cell(row) : row[column.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            )))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center text-base">
                                        <div className="flex items-center justify-center p-8 text-center">
                                            <div className="text-error text-2xl font-semibold">
                                                Error: DataTable requires an array of data.
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;