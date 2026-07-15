import React from 'react';
import { Container, Row, Col, Card, Form, Table, Button, Modal } from 'react-bootstrap';
import { BiUpload, BiCloudUpload, BiCheckShield, BiBrain, BiChevronRight, BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useBulkIngestionForm } from '../../hooks/import-data/useBulkIngestionForm';

export const BulkIngestionPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation
  const {
    file, headers, currentMapping, previewRows, step, isAnalyzing, isSubmitting,
    showConflictModal, templateName, targetDbFields, setStep, setShowConflictModal,
    setTemplateName, handleFileAnalysis, handleFieldMappingChange, saveMappingAndProceed, executeBulkIngestion
  } = useBulkIngestionForm();

  return (
    <Container fluid className="py-4 px-4 bg-body-tertiary" style={{ minHeight: '85vh' }}>
      
      {/* Dynamic Modal Conflict Interrupter */}
      <Modal show={showConflictModal} onHide={() => setShowConflictModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fs-6 fw-bold text-dark">Mapping Structure Detected</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-secondary">
          An identical or high-overlapping matching matrix template profile already exists in system records. Would you like to use this mapping definition or define a custom configuration?
        </Modal.Body>
        <Modal.Footer className="bg-light p-2">
          <Button size="sm" variant="secondary" onClick={() => { setShowConflictModal(false); setStep('MAPPING'); }}>Create Custom Variant</Button>
          <Button size="sm" variant="primary" onClick={() => { setShowConflictModal(false); setStep('PREVIEW'); }}>Continue with Existing Mapping</Button>
        </Modal.Footer>
      </Modal>

      <Row className="mb-3 align-items-center">
        <Col>
          <h4 className="fw-bold text-dark">Automated Catalog Ingestion Control Hub</h4>
          <p className="text-muted small mb-0">Step-by-step smart MDM layout pipeline matching arbitrary sheets into structured enterprise taxonomy hierarchies.</p>
        </Col>
        {/* Added Back Button for step 1 upload view */}
        {step === 'UPLOAD' && (
          <Col xs="auto">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="d-flex align-items-center gap-1"
              onClick={() => navigate(-1)} // Takes user back to the previous route (Mapping List)
            >
              <BiArrowBack /> Back to Schema Vault
            </Button>
          </Col>
        )}
      </Row>

      {/* STEP 1: Upload Workspace Asset Panel */}
      {step === 'UPLOAD' && (
        <Card className="border-0 shadow-sm p-5 text-center bg-white border-dashed rounded-3">
          <BiCloudUpload className="text-primary display-3 mb-2 animate-pulse" />
          <h6 className="fw-bold">Upload Source Inventory Document</h6>
          <Form.Control 
            type="file" 
            accept=".csv" 
            onChange={(e: any) => e.target.files?.[0] && handleFileAnalysis(e.target.files[0])} 
            className="mt-3 w-50 mx-auto small"
            disabled={isAnalyzing}
          />
          {isAnalyzing && <div className="small text-warning mt-3 fw-bold"><BiBrain className="fs-5" /> Smart Engine computing optimal schemas across active taxonomies...</div>}
        </Card>
      )}

      {/* STEP 2: Configure Mapping Assignments Layer */}
      {step === 'MAPPING' && (
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white">
          <div className="bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
            <span className="small fw-bold text-dark"><BiBrain className="text-primary" /> Mapping Strategy Adjustments Matrix</span>
            <Button size="sm" variant="outline-secondary" onClick={() => setStep('UPLOAD')}><BiArrowBack /> Back</Button>
          </div>
          <Card.Body className="p-0" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <Table responsive hover className="align-middle mb-0 small">
              <thead className="table-light position-sticky top-0">
                <tr><th>Spreadsheet Column Header Name</th><th>Database Domain Property Assignment</th></tr>
              </thead>
              <tbody>
                {headers.map(h => (
                  <tr key={h}>
                    <td className="fw-bold text-secondary px-3">{h}</td>
                    <td className="px-3">
                      <Form.Select size="sm" value={currentMapping[h] || ''} onChange={(e) => handleFieldMappingChange(h, e.target.value)}>
                        <option value="">-- Drop Node Element --</option>
                        {targetDbFields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
          <div className="p-3 bg-light border-top d-flex align-items-center gap-3 justify-content-end">
            <Form.Control size="sm" placeholder="Enter Template Profile Identifier Name..." value={templateName} onChange={(e) => setTemplateName(e.target.value)} style={{ width: '320px' }} />
            <Button variant="success" size="sm" onClick={saveMappingAndProceed} className="d-flex align-items-center gap-1">Continue to Preview <BiChevronRight /></Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Preview Layout Matrix Records Before Submission */}
      {step === 'PREVIEW' && (
        <Card className="border-0 shadow-sm rounded-3 bg-white overflow-hidden">
          <div className="bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
            <span className="small fw-bold text-dark">Data Preview Stream Matrix Check</span>
            <Button size="sm" variant="outline-secondary" onClick={() => setStep('MAPPING')}><BiArrowBack /> Edit Mappings</Button>
          </div>
          <Card.Body className="p-0" style={{ overflowX: 'auto', maxHeight: '45vh' }}>
            <Table responsive hover bordered className="mb-0 text-nowrap small align-middle">
              <thead className="table-light">
                <tr>
                  {headers.map(h => (
                    <th key={h} className="py-2">
                      <div className="fw-bold text-dark">{h}</div>
                      <div className="text-primary small font-monospace">➔ {currentMapping[h] || '[Dropped]'}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map(h => <td key={h} className="text-secondary">{row[h] || <span className="text-muted text-opacity-25">null</span>}</td>)}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
          <div className="p-3 bg-light border-top d-flex justify-content-end">
            <Button variant="success" size="sm" onClick={executeBulkIngestion} disabled={isSubmitting} className="fw-bold px-4">
              {isSubmitting ? 'Queueing Worker Engine...' : 'Confirm Data Integrity & Run Bulk Ingestion'}
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default BulkIngestionPage;