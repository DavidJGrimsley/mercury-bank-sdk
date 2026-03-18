import type {
  MercuryAccount,
  MercuryInvoicePayload,
  MercuryInvoiceResponse,
  MercuryRecipient,
  MercuryRecord,
  MercurySendMoneyInput,
  MercuryTransaction,
} from '@mr.dj2u/mercury';
import type { ReactNode } from 'react';
import type { InvoiceWizardStatus } from './components/invoice-wizard';

export type MercuryUiAdapter = {
  listAccounts?: () => Promise<MercuryAccount[]>;
  listRecipients?: () => Promise<MercuryRecipient[]>;
  listInvoices?: () => Promise<MercuryInvoiceResponse[]>;
  createInvoice?: (payload: MercuryInvoicePayload) => Promise<MercuryInvoiceResponse>;
  createRecipient?: (input: MercuryRecord) => Promise<MercuryRecipient>;
  updateRecipient?: (recipientId: string, input: MercuryRecord) => Promise<MercuryRecipient>;
  sendMoney?: (accountId: string, input: MercurySendMoneyInput) => Promise<MercuryTransaction>;
};

export type MercuryCustomerContact = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
};

export type MercuryCustomerContactAdapter = {
  loadCustomers: () => Promise<MercuryCustomerContact[]>;
  saveCustomerContact: (input: MercuryCustomerContact) => Promise<void>;
  syncCustomerToMercury?: (input: MercuryCustomerContact) => Promise<void>;
  formatSyncError?: (error: unknown) => string;
};

export type MercurySessionInvoiceAdapter = {
  defaults?: Partial<MercuryInvoicePayload>;
  resetKey?: string | number;
  busy?: boolean;
  status?: InvoiceWizardStatus;
  footer?: ReactNode;
  renderSourcePanel?: () => ReactNode;
  submitInvoice: (payload: MercuryInvoicePayload) => Promise<void> | void;
};

