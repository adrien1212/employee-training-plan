import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface PaginationProps {
    page: number;
    totalPages: number;
    pageSize: number;
    pageSizes?: number[];
    busy?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    pageSize,
    pageSizes = [5, 10, 20, 50],
    busy = false,
    onPageChange,
    onPageSizeChange,
}) => {
    const handlePrev = () => {
        if (page > 0) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page + 1 < totalPages) {
            onPageChange(page + 1);
        }
    };

    const handleSizeChange = (value: string) => {
        const newSize = Number(value);
        onPageSizeChange(newSize);
        onPageChange(0);
    };

    return (
        <div className="flex items-center justify-between mt-4 p-4">
            <div className="text-gray-600">
                Page {page + 1} sur {totalPages}
            </div>
            <div className="flex gap-2">
                <Button disabled={page === 0 || busy} onClick={handlePrev}>
                    Précédent
                </Button>
                <Button disabled={page + 1 >= totalPages || busy} onClick={handleNext}>
                    Suivant
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="pageSizeSelect">Taille :</Label>
                <Select
                    id="pageSizeSelect"
                    value={pageSize.toString()}
                    onValueChange={handleSizeChange}
                    disabled={busy}
                >
                    <SelectTrigger className="w-24">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizes.map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size} / page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default Pagination;
