import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { BiPlus, BiPackage, BiTrash, BiEditAlt } from 'react-icons/bi';
import { useProducts } from '../../hooks/product/useProducts';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraConfirmBox } from '../../components/reusable/QuantraConfirmBox';
import { QuantraTable } from '../../components/reusable/QuantraTable';
import { VariantModal } from '../../components/product/VariantModal';

export const ProductData: React.FC = () => {
  const {
    products,
    totalItems,
    isLoading,
    isDeleting,
    columns,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    productToDelete,
    fetchProducts,
    handleExecuteDelete,
    expandedRows,
    handleExecuteVariantDelete,
    navigateToAddWizard,
    variantModalOpen,
    setVariantModalOpen,
    activeParentProductId,
    selectedVariantContext,
    openCreateVariantModal,
    openEditVariantModal
  } = useProducts();

  return (
    <Container fluid className="py-4 px-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiPackage className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Product Catalog Matrix</h4>
          </div>
        </Col>
        <Col xs="auto">
          <QuantraButton 
            variant="primary" 
            icon={<BiPlus className="fs-5" />} 
            onClick={navigateToAddWizard}
            text="Launch Creator Wizard"
          />
        </Col>
      </Row>

      <QuantraTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        totalItems={totalItems}
        searchPlaceholder="Filter via SKU, Barcode or Name..."
        tableController={{
          currentPage: 1,
          searchTerm: '',
          sortKey: 'sku',
          sortDirection: 'asc',
          totalPages: 1,
          paginationRange: [1],
          handleSearchChange: () => {},
          handleSortChange: () => {},
          handlePageChange: () => {}
        }}
        // Custom row injector module configuration to display inline sub-variants
        renderExpandedRow={(row: any) => {
  if (!expandedRows[row.product_id]) return null;
  return (
    <tr className="bg-light">
      <td colSpan={6} className="p-3">
        <Card className="border-0 shadow-sm rounded-3">
          <Card.Body className="p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-secondary small text-uppercase tracking-wider mb-0">Nested Active Variants Options Matrix</h6>
              <QuantraButton size="sm" variant="outline-primary" className="d-flex align-items-center gap-1 py-1" onClick={() => openCreateVariantModal(row.product_id)}>
                <BiPlus /> Append Variant Configuration Option
              </QuantraButton>
            </div>
            <Table responsive hover size="sm" className="align-middle border mb-0">
              <thead className="table-light fs-7">
                <tr>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Preview</th>
                  <th className="text-center" style={{ width: '120px' }}>Action Handlers</th>
                </tr>
              </thead>
              <tbody className="fs-7">
                {row.variants && row.variants.length > 0 ? (
                  row.variants.map((v: any) => (
                    <tr key={v.product_variant_id}>
                      <td className="text-monospace text-secondary small">{v.color_name || 'Global Baseline Default'}</td>
                      <td className="text-monospace text-secondary small">{v.size_name || 'Global Baseline Default'}</td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          {v.product_images && v.product_images.length > 0 ? (
                            v.product_images.map((img: string, idx: number) => (
                              <img 
                                key={idx} 
                                src={`${import.meta.env.VITE_IMAGE_BASE_URL || ''}${img}`} 
                                alt="Local Variant asset" 
                                className="img-thumbnail object-fit-cover rounded border" 
                                style={{ width: '45px', height: '45px' }} 
                              />
                            ))
                          ) : (
                            <span className="text-muted italic small">No Local Media Attached</span>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <QuantraButton variant="outline-secondary" size="sm" icon={<BiEditAlt />} onClick={() => openEditVariantModal(row.product_id, v)}/>
                          
                          <QuantraButton variant="outline-danger" size="sm" icon={<BiTrash />}  onClick={() => handleExecuteVariantDelete(v.product_variant_id)}/>
                            
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="text-center text-muted py-2">No variations tracked.</td></tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </td>
    </tr>
  );
}}
      />
<VariantModal 
  show={variantModalOpen} 
  onClose={() => setVariantModalOpen(false)} 
  productId={activeParentProductId} 
  selectedVariant={selectedVariantContext} 
  onSuccess={fetchProducts} 
/>
      <QuantraConfirmBox
        show={confirmDeleteOpen}
        title={`Purge Product Entry: "${productToDelete?.product_name}"`}
        message={`Are you completely certain? Deleting this core catalog profile drops all associated multi-image files saved in your local upload folder context permanently.`}
        confirmText="Confirm Purge"
        confirmVariant="danger"
        isLoading={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
      />
    </Container>
  );
};

export default ProductData;