import { Button } from "./button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

interface TablePaginationProps {
  currentPage: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function TablePagination({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">每页显示</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">条</span>
        </div>
        <span className="text-sm text-gray-700">
          共 {totalCount} 条记录，第 {currentPage} / {totalPages} 页
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          首页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          末页
        </Button>
      </div>
    </div>
  )
}