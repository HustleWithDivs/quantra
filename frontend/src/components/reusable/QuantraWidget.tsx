import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

// Define layout rules for trend variants
export type WidgetTrendDirection = 'up' | 'down' | 'neutral';

interface QuantraWidgetProps {
  title: string;
  value?: string | number;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode; // Optional slot for icons or dropdown buttons
  trendLabel?: string;
  trendDirection?: WidgetTrendDirection;
  trendVariant?: 'success' | 'danger' | 'warning' | 'secondary';
  isLoading?: boolean;
  footerText?: string;
  children?: React.ReactNode; // Extra visual tracking content like small sparklines or subtext maps
}

/**
 * Reusable Metric Widget Component (TypeScript + React-Bootstrap)
 * Integrates dashboard metric tokens with native skeleton loading placeholders
 */
export const QuantraWidget: React.FC<QuantraWidgetProps> = ({
  title,
  value,
  icon,
  headerActions,
  trendLabel,
  trendDirection,
  trendVariant = 'success',
  isLoading = false,
  footerText,
  children,
}) => {
  
  // Render structure if backend data fetching is active
  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm h-100 p-3 bg-body-tertiary">
        <Card.Body className="p-2 d-flex flex-column justify-content-between h-100">
          <div className="w-100">
            <Placeholder as={Card.Title} animation="glow" className="mb-3">
              <Placeholder xs={6} size="sm" className="rounded" />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow" className="mb-2">
              <Placeholder xs={8} size="lg" className="py-3 rounded" />
            </Placeholder>
          </div>
          <Placeholder as="div" animation="glow" className="mt-2">
            <Placeholder xs={4} size="xs" className="rounded" />
          </Placeholder>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm h-100 p-3 bg-body-tertiary">
      <Card.Body className="p-2 d-flex flex-column justify-content-between h-100">
        
        {/* Header Block Section */}
        <div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted small fw-medium text-uppercase tracking-wider">{title}</span>
            {headerActions && <div className="widget-actions-wrapper">{headerActions}</div>}
          </div>

          {/* Primary Value Matrix View Section */}
          <div className="d-flex align-items-center justify-content-between mt-1">
            {value !== undefined && (
              <h3 className="large-display mb-0 fw-bold fs-2 text-body">
                {value}
              </h3>
            )}
            {icon && <div className="text-secondary opacity-75 d-flex align-items-center">{icon}</div>}
          </div>

          {/* Optional inline slot container for graphs or maps */}
          {children && <div className="mt-3">{children}</div>}
        </div>

        {/* Footer/Trend Trend Section */}
        {(trendLabel || footerText) && (
          <div className="mt-4 pt-2 border-top border-light-subtle d-flex align-items-center justify-content-between extra-small" style={{ fontSize: '0.85rem' }}>
            {trendLabel && (
              <span className={`fw-semibold text-${trendVariant} d-inline-flex align-items-center gap-1`}>
                {trendDirection === 'up' && '▲'}
                {trendDirection === 'down' && '▼'}
                {trendLabel}
              </span>
            )}
            {footerText && <span className="text-muted text-nowrap ms-auto">{footerText}</span>}
          </div>
        )}

      </Card.Body>
    </Card>
  );
};
