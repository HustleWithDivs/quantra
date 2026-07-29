import React, { useState, useCallback } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { QuantraTable } from '../../components/reusable/QuantraTable';
// Use explicit type-only import to completely satisfy verbatimModuleSyntax
import type { TableColumn } from '../../components/reusable/QuantraTable';
import { useQuantraTable } from '../../hooks/reusable/useQuantraTable';

interface InfrastructureRecord {
  id: string;
  nodeName: string;
  loadFactor: string;
  status: 'Operational' | 'Degraded';
}

const mockNodes: InfrastructureRecord[] = [
  { id: '1', nodeName: 'US-EAST-GATEWAY', loadFactor: '42%', status: 'Operational' },
  { id: '2', nodeName: 'EU-CENTRAL-CLUSTER', loadFactor: '91%', status: 'Degraded' },
  { id: '3', nodeName: 'AP-SOUTH-PIPELINE', loadFactor: '15%', status: 'Operational' }
];

export default function TableWorkspace() {
  const [loading, setLoading] = useState(false);

  const handleFetchDataPayload = useCallback(({ page, search, sortKey, sortDirection }: any) => {
    setLoading(true);
    console.log(`📡 Fetching data matrix parameters: /api/nodes?page=${page}&q=${search}&sortBy=${sortKey}&dir=${sortDirection}`);
    
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const tableController = useQuantraTable({
    totalItems: 45, 
    itemsPerPage: 3,
    onFetchData: handleFetchDataPayload
  });

  const columns: TableColumn<InfrastructureRecord>[] = [
    { key: 'nodeName', header: 'Infrastructure Node Mesh ID', sortable: true },
    { key: 'loadFactor', header: 'Processing Load Core', sortable: true },
    {
      key: 'status',
      header: 'Health Metric',
      render: (row) => (
        <Badge bg={row.status === 'Operational' ? 'success' : 'danger'}>{row.status}</Badge>
      )
    }
  ];

  return (
    <Card className="border-0 shadow-sm p-4 mx-auto my-4" style={{ maxWidth: '900px' }}>
      <h4 className="fw-bold large-display mb-1">Infrastructure Control Grid</h4>
      <p className="text-muted small mb-4">Strictly decoupled UI presentation engine environment with custom inputs</p>

      <QuantraTable
        columns={columns}
        data={mockNodes}
        isLoading={loading}
        totalItems={45}
        tableController={tableController}
        searchPlaceholder="Filter node arrays..."
      />
    </Card>
  );
}
