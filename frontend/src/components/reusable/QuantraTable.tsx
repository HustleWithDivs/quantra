import React from 'react';
import { Table, Spinner, Pagination, Row, Col } from 'react-bootstrap';
import { BiChevronUp, BiChevronDown, BiSort } from 'react-icons/bi';
import { QuantraSearchBox } from './QuantraSearchBox';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface QuantraTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  totalItems: number;
  searchPlaceholder?: string;
  tableController: {
    currentPage: number;
    searchTerm: string;
    sortKey: string;
    sortDirection: 'asc' | 'desc';
    totalPages: number;
    paginationRange: (number | string)[];
    handleSearchChange: (query: string) => void;
    handleSortChange: (key: string) => void;
    handlePageChange: (pageNumber: number) => void;
  };
}

export function QuantraTable<T>({
  columns,
  data,
  isLoading = false,
  totalItems,
  searchPlaceholder = "Search operational logs...",
  tableController,
}: QuantraTableProps<T>) {
  const {
    currentPage,
    searchTerm,
    sortKey,
    sortDirection,
    totalPages,
    paginationRange,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
  } = tableController;

  return (
    <div className="custom-table-presentation-layer">
      <Row className="mb-2">
        <Col md={4} sm={6}>
          <QuantraSearchBox
            name="table-filter-query"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </Col>
      </Row>

      <div className="position-relative border rounded overflow-hidden bg-body-tertiary">
        <Table responsive hover className="mb-0 align-middle">
          <thead className="table-light">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => col.sortable && handleSortChange(col.key as string)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                  className="py-3 px-4 fw-semibold text-body-secondary"
                >
                  <div className="d-flex align-items-center gap-2">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-muted fs-6">
                        {sortKey !== col.key ? (
                          <BiSort />
                        ) : sortDirection === 'asc' ? (
                          <BiChevronUp className="text-primary fs-5" />
                        ) : (
                          <BiChevronDown className="text-primary fs-5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                  <span className="text-muted small">Syncing live database channels...</span>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5 text-muted small">
                  No records match current filtration profiles.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-3 px-4 text-body">
                      {col.render ? col.render(row) : (row[col.key as keyof T] as unknown as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Controls Wrapper */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3 px-1">
          <div className="small text-muted">
            Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalItems} records total)
          </div>
          <Pagination className="mb-0">
            <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
            
            {paginationRange.map((item, index) => {
              if (item === '...') {
                // Unique composite tracking key to handle dual middle ellipsis indicators cleanly
                return <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />;
              }
              return (
                <Pagination.Item
                  key={`page-${item}`}
                  active={item === currentPage}
                  onClick={() => handlePageChange(item as number)}
                >
                  {item}
                </Pagination.Item>
              );
            })}

            <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
          </Pagination>
        </div>
      )}
    </div>
  );
}
