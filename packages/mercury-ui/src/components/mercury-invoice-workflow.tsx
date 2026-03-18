import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { MercuryAccount, MercuryInvoicePayload } from '@mr.dj2u/mercury';
import type { MercuryUiAdapter } from '../adapter';
import { MercuryLogo } from './mercury-logo';
import { QuickInvoiceWizard } from './quick-invoice-wizard';
import type { MercuryStatusTone } from './mercury-status-notice';

type WorkflowStatus = {
  message: string;
  tone: MercuryStatusTone;
};

type MercuryInvoiceWorkflowProps = {
  adapter: MercuryUiAdapter;
  onInvoiceCreated?: () => void;
  onError?: (message: string) => void;
};

export function MercuryInvoiceWorkflow({
  adapter,
  onInvoiceCreated,
  onError,
}: MercuryInvoiceWorkflowProps) {
  const [accounts, setAccounts] = useState<MercuryAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<WorkflowStatus>({
    message: 'Load accounts to start creating Mercury invoices.',
    tone: 'neutral',
  });

  useEffect(() => {
    let active = true;

    async function refreshAccounts(): Promise<void> {
      if (!adapter.listAccounts) {
        const message = 'Mercury invoice workflow requires a listAccounts adapter.';
        onError?.(message);
        setStatus({ message, tone: 'error' });
        return;
      }

      setIsLoadingAccounts(true);
      try {
        const rows = await adapter.listAccounts();
        if (!active) {
          return;
        }

        setAccounts(rows);
        setStatus({
          message: rows.length > 0 ? 'Accounts ready for invoice routing.' : 'No Mercury accounts found.',
          tone: rows.length > 0 ? 'success' : 'error',
        });
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Failed to load Mercury accounts.';
        onError?.(message);
        setStatus({ message, tone: 'error' });
      } finally {
        if (active) {
          setIsLoadingAccounts(false);
        }
      }
    }

    refreshAccounts().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [adapter, onError]);

  async function handleSubmit(payload: MercuryInvoicePayload): Promise<void> {
    if (!adapter.createInvoice) {
      const message = 'Mercury invoice workflow requires a createInvoice adapter.';
      onError?.(message);
      setStatus({ message, tone: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const invoice = await adapter.createInvoice(payload);
      const hostedUrl = `${invoice.hosted_url ?? invoice.hostedUrl ?? ''}`.trim();
      setStatus({
        message: hostedUrl
          ? `Invoice ${invoice.id} created. Hosted URL: ${hostedUrl}`
          : `Invoice ${invoice.id} created successfully.`,
        tone: 'success',
      });
      onInvoiceCreated?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create Mercury invoice.';
      onError?.(message);
      setStatus({ message, tone: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View
      style={{
        gap: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#314233',
        backgroundColor: '#0f1711',
        padding: 20,
      }}
    >
      <View style={{ gap: 8 }}>
        <MercuryLogo variant="horizontal" size={280} />
        <Text style={{ color: '#d4e0d0', fontSize: 15 }}>
          Direct invoice creation in Mercury AR using the extracted Mercury UI package.
        </Text>
      </View>

      <Text style={{ color: '#d4e0d0', fontSize: 14 }}>
        {isLoadingAccounts ? 'Loading accounts from Mercury...' : 'Accounts ready for invoice routing.'}
      </Text>

      <View
        style={{
          gap: 8,
          borderWidth: 1,
          borderColor: '#d4b568',
          borderRadius: 14,
          backgroundColor: '#fff8e6',
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: '#6b4e00', fontWeight: '700' }}>AR beta guardrails</Text>
        <Text style={{ color: '#6b4e00', fontSize: 12, lineHeight: 18 }}>
          Mercury invoicing is still beta. Review routing, service period, line items, and send-email behavior carefully before submitting.
        </Text>
      </View>

      <QuickInvoiceWizard
        accounts={accounts}
        onSubmit={handleSubmit}
        busy={isSubmitting}
        status={status}
      />
    </View>
  );
}
