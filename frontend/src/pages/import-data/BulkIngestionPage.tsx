import React from 'react';
import { Container, Row, Col, Card, Form, Table, Button } from 'react-bootstrap';
import { BiUpload, BiCloudUpload, BiCheckShield, BiBrain } from 'react-icons/bi';
import { useBulkIngestionForm } from '../../hooks/import-data/useBulkIngestionForm';

export const BulkIngestionPage: React.FC = () => {
  const {
    file,
    headers,
    currentMapping,
    isAnalyzing,
    isSubmitting,
    targetDbFields,
    handleFileAnalysis,
    handleFieldMappingChange,
    executeBulkIngestion
  } = useBulkIngestionForm();

  return (
    <Container fluid className="py-4 px-4 bg-body-tertiary" style={{ minHeight: '85vh' }}>
      {/* Structural Page Identity Heading Elements */}
      <Row className="mb-4">
        <Col>
          <h4 className="fw-bold text-dark">Automated Catalog Ingestion Control Hub</h4>
          <p className="text-muted small mb-0">
            Upload bulk inventory spreadsheets. System-wide 5-tier taxonomies automatically initialize when unrecognized items are identified.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Left Control Column: Asset Drop Panel */}
        <Col lg={5}>
          <Card className="border-0 shadow-sm rounded-3 p-4 text-center border-dashed bg-white h-100 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '260px' }}>
            <BiCloudUpload className="text-primary display-3 mb-2" />
            <h6 className="fw-bold text-dark">Drop Raw Spreadsheet Here</h6>
            <p className="text-muted small px-3">Select the supplier file format parameters you want to introduce into inventory control environments.</p>
            
            <Form.Control 
              type="file" 
              accept=".csv" 
              onChange={(e: any) => e.target.files?.[0] && handleFileAnalysis(e.target.files[0])} 
              className="mt-2 w-75 mx-auto"
              disabled={isAnalyzing || isSubmitting}
            />
            
            {isAnalyzing && (
              <div className="small text-warning mt-3 fw-medium d-flex align-items-center gap-1 justify-content-center">
                <BiBrain className="fs-5 animate-pulse" /> LangChain AI structural engine parsing headers...
              </div>
            )}

            {file && !isAnalyzing && (
              <div className="mt-3 p-2 bg-light rounded border text-start w-75 mx-auto">
                <span className="d-block small text-truncate text-success fw-bold">✓ Staged File:</span>
                <span className="small text-secondary text-truncate d-block">{file.name}</span>
              </div>
            )}
          </Card>
        </Col>

        {/* Right Control Column: Interactive Matrix Lookup Interface */}
        <Col lg={7}>
          {headers.length > 0 ? (
            <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white">
              <div className="bg-light px-3 py-3 border-bottom d-flex align-items-center gap-2">
                <BiBrain className="text-primary fs-5" /> 
                <span className="small fw-bold text-dark">Active Column Configuration Matrix Mapping</span>
              </div>
              
              <Card.Body className="p-0" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                <Table responsive hover className="align-middle mb-0 small">
                  <thead className="table-light position-sticky top-0 style-thead-layer" style={{ zIndex: 2 }}>
                    <tr>
                      <th className="py-2 px-3">Uploaded Spreadsheet Header</th>
                      <th className="py-2 px-3">Database Target Fields Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headers.map((header) => (
                      <tr key={header}>
                        <td className="fw-bold text-secondary px-3">{header}</td>
                        <td className="px-3">
                          <Form.Select 
                            size="sm" 
                            value={currentMapping[header] || ''} 
                            onChange={(e) => handleFieldMappingChange(header, e.target.value)}
                            className={currentMapping[header] ? 'text-primary border-primary fw-semibold bg-primary-subtle' : 'text-muted'}
                          >
                            <option value="">-- Drop / Skip Field Node --</option>
                            {targetDbFields.map(f => (
                              <option key={f.key} value={f.key}>{f.label}</option>
                            ))}
                          </Form.Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
              
              {/* Submission Footer Actions */}
              <div className="p-3 bg-light border-top d-flex justify-content-end gap-2">
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={executeBulkIngestion} 
                  disabled={isSubmitting || isAnalyzing}
                  className="d-flex align-items-center gap-1 px-3 fw-semibold"
                >
                  <BiCheckShield className="fs-5" /> 
                  {isSubmitting ? 'Queueing Worker Engine...' : 'Commit Mapping & Start Bulk Upload'}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm rounded-3 bg-white p-5 text-center d-flex flex-column justify-content-center align-items-center h-100">
              <BiUpload className="text-muted display-4 mb-2" />
              <h6 className="text-secondary fw-semibold">No Layout Config Staged</h6>
              <p className="text-muted small max-w-xs mb-0">Upload a vendor inventory matrix source spreadsheet file on the left side to compile target schema mapping configurations.</p>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BulkIngestionPage;